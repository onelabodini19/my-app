import React, { useState } from 'react';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import axios from "axios";
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useMutation, useQueries } from "react-query";


const getUsers = () => axios.get("http://localhost:8090/api/user").then((res) => res.data);
const getCandidates = () => axios.get("http://localhost:8090/api/candidate").then((res) => res.data);
const deleteCandidate = (deleteValue) => axios.delete(`http://localhost:8090/api/candidate/${deleteValue}`, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => res.data);
const updateCandidate = (inputValue) => axios.put(`http://localhost:8090/api/candidate/${inputValue.candidateId}`, null,
    {
        params: { type: 2 }
    }, JSON.stringify(inputValue), {
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => res.data);
const createCandidate = (newCandidate) => axios.post("http://localhost:8090/api/candidate", JSON.stringify(newCandidate), {
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => res.data);



function renderTextField(params) {
    return <TextField variant="standard" readOnly value={params.value} />;
}

renderTextField.propTypes = {
    value: PropTypes.string,
};

function TextFieldEditInputCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const handleChange = (event) => {
        const newValue = event.target.value;
        apiRef.current.setEditCellValue({ id, field, value: newValue })

    };

    const handleRef = (element) => {
        if (element) {
            const input = element.querySelector(`input[value="${value}"]`);
            input?.focus();
        }
    };

    return (
        <TextField
            ref={handleRef}
            type="text"
            value={value}
            onChange={handleChange}
        >
        </TextField>
    );
}

TextFieldEditInputCell.propTypes = {

    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    value: PropTypes.string,
};

const renderTextFieldEditInputCell = (params) => {
    return <TextFieldEditInputCell {...params} />;
};


const columns = [

    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: true
    },
    // {
    //     field: 'positon',
    //     headerName: 'Applying for',
    //     width: 150,
    //     editable: true,
    //     type: 'string'
    // },
    // {
    //     field: 'status',
    //     headerName: 'Status',
    //     width: 150,
    //     editable: true,
    //     type: 'string'
    // },
    {
        field: 'type',
        headerName: 'Candidate Type',
        width: 150,
        editable: true,
        renderCell: renderTextField,
        renderEditCell: renderTextFieldEditInputCell,
        type: 'string'
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 150,
        editable: true
    },
    {
        field: 'phone',
        headerName: 'Phone',
        width: 150,
        editable: true
    }
];


export default function Candidate() {
    const [candidates, setCandidates] = useState([]);
    const [candidateSelected, setCandidateSelected] = useState({});
    const [newCandidate, setNewCandidate] = useState({});
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([{ 'userId': '' }])
    const [type, setType] = useState("");


    const [candidatesQuery, usersQuery] = useQueries([
        {
            queryKey: ['candidates'],
            queryFn: () =>
                getCandidates(),
            onSuccess: (data) => {
                setCandidates(data)
            }
        },
        {
            queryKey: ['users'],
            queryFn: () =>
                getUsers(),
            onSuccess: (data) => {
                setUsers(data)
            }
        },
    ],
    );

    const deleteCandidateMutation = useMutation(deleteCandidate, {
        onSuccess: (data) => {
        }
    });

    const updateCandidateMutation = useMutation(updateCandidate, {
        onSuccess: (data) => {
        }
    });

    const createCandidateMutation = useMutation(createCandidate, {
        onSuccess: (data) => {

        }
    });
    
    if (candidatesQuery.isLoading) return 'Loading Candidates...';
    if (usersQuery.isLoading) return 'Loading Users...';

    if (candidatesQuery.error)
        return 'An error has occurred: ' + candidatesQuery.error.message;

    if (usersQuery.error)
        return 'An error has occurred: ' + usersQuery.error.message;


    const handleCellClick = (e) => {
        console.log(e);
        setCandidateSelected(e.row);
    };

    const handleDelete = () => {
        const deletedRows = [...candidates];
        const idx = deletedRows.findIndex(i => i.candidateId === candidateSelected.candidateId);
        if (idx > -1) {
            deletedRows.splice(idx, 1);
            setCandidates(deletedRows);
            deleteCandidateMutation.mutate(candidateSelected.candidateId);
        }

    };

    const handleCellKeyDown = (params, event, details) => {
        if (event.key === 'Enter') {
            const modifiedCandidate = {
                ...params.row,
                [params.field]: event.target.value
            }
            console.log(modifiedCandidate)
            updateCandidateMutation.mutate(modifiedCandidate)
            setNewCandidate(modifiedCandidate);
        }
    }


    const handleFormSubmit = (e) => {
        e.preventDefault();
        const candidate = ({
            ...newCandidate,
            userId,
            type

        })

        createCandidateMutation.mutate(candidate)
    }

    const handleUserChange = (event) => {
        setUserId(event.target.value);
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    return (
        <div className='grid-container' style={{ height: 300, width: '50%', marginLeft: 600, marginTop: 100 }} >

            <DataGrid
                rows={candidates}
                columns={columns}
                getRowId={(row) => row.candidateId}
                onCellClick={handleCellClick}
                onCellKeyDown={(params, event, details) => {
                    handleCellKeyDown(params, event, details)
                }}
            />
            <h2>Add a candidate</h2>
            <form onSubmit={handleFormSubmit}>
                <InputLabel >UserId</InputLabel>
                <Select
                    value={userId}
                    onChange={handleUserChange}
                    label="userId">
                    {users.map(user => (
                        <MenuItem value={user.userId} key={user.userId}>{user.userId}</MenuItem>
                    ))
                    }
                </Select>

                <InputLabel >CandidateType</InputLabel>
                <Select
                    value={type}
                    onChange={handleTypeChange}
                    label="type">
                    {candidates.map(candidate => (
                        <MenuItem value={candidate.type} key={candidate.candidateId}>{candidate.type}</MenuItem>
                    ))
                    }
                </Select>
                <button type="submit"> Add </button>
            </form>

            <button type='button' onClick={handleDelete}>Delete</button>
        </div>
    )
}
