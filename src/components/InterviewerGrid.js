import React, { useState } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useMutation, useQueries } from "react-query";
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';



const getUsers = () => axios.get("http://localhost:8090/api/user").then((res) => res.data);
const getDepartments = () => axios.get("http://localhost:8090/api/department").then((res) => res.data);
const getInterviewers = () => axios.get("http://localhost:8090/api/interviewer").then((res) => res.data);
const createInterviewer = (newInterviewer) => axios.post("http://localhost:8090/api/interviewer", JSON.stringify(newInterviewer), {
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => res.data);

const updateInterviewer = (inputValue) => axios.put(`http://localhost:8090/api/interviewer/${inputValue.interviewerId}`, JSON.stringify(inputValue), {
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => res.data);

const deleteInterviewer = (deleteValue) => axios.delete(`http://localhost:8090/api/interviewer/${deleteValue}`, {
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
        field: 'departmentName',
        headerName: 'Department',
        width: 150,
        editable: true
    },
    {
        field: 'position',
        headerName: 'Position',
        width: 150,
        editable: true,
        renderCell: renderTextField,
        renderEditCell: renderTextFieldEditInputCell,
        type: 'string'
    },
    {
        field: 'availability',
        headerName: 'Availability',
        width: 150,
        editable: true,
        renderCell: renderTextField,
        renderEditCell: renderTextFieldEditInputCell,
        type: 'string'
    },
    {
        field: 'notes',
        headerName: 'Notes',
        width: 150,
        editable: true,
        renderCell: renderTextField,
        renderEditCell: renderTextFieldEditInputCell,
        type: 'string'
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: true
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

export default function Grid() {
    const [newInterviewer, setNewInterviewer] = useState({})
    const [interviewers, setInterviewers] = useState([])
    const [interviewerSelected, setInterviewerSelected] = useState({});
    const [userId, setUserId] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [users, setUsers] = useState([{ 'userId': '' }])
    const [departments, setDepartments] = useState([{ 'departmentId': '' }])

    const [interviewersQuery, usersQuery, departmentsQuery] = useQueries([
        {
            queryKey: ['interviewers'],
            queryFn: () =>
                getInterviewers(),
            onSuccess: (data) => {
                setInterviewers(data)
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
        {
            queryKey: ['departments'],
            queryFn: () =>
                getDepartments(),
            onSuccess: (data) => {
                setDepartments(data)
            }
        },
    ],
    );


    const createInterviewerMutation = useMutation(createInterviewer, {
        onSuccess: (data) => {
            const interviewer={
                availability: data.availability,
                departmentName:data.department.departmentName,
                email:data.user.email,
                interviewerId: data.interviewerId,
                name:data.user.name,
                notes:data.notes,
                phone:data.user.phone,
                position:data.position
            }
            
            setInterviewers([
                ...interviewers,
                interviewer
            ]);
        }
    });

    const updateInterviewerMutation = useMutation(updateInterviewer, {
        onSuccess: (data) => {
        }
    });

    const deleteInterviewerMutation = useMutation(deleteInterviewer, {
        onSuccess: (data) => {
        }
    });


    if (interviewersQuery.isLoading) return 'Loading Interviewers...';
    if (usersQuery.isLoading) return 'Loading Users...';
    if (departmentsQuery.isLoading) return 'Loading Departments...';

    if (interviewersQuery.error)
        return 'An error has occurred: ' + interviewersQuery.error.message;

    if (usersQuery.error)
        return 'An error has occurred: ' + usersQuery.error.message;

    if (departmentsQuery.error)
        return 'An error has occurred: ' + departmentsQuery.error.message;


    const handleFormChange = (e) => {
        setNewInterviewer(
            {
                ...newInterviewer,
                [e.target.name]: e.target.value
            }
        );
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const interviewer=({
            ...newInterviewer,
            userId,
            departmentId
        })
    
        createInterviewerMutation.mutate(interviewer)
    }

    const handleCellKeyDown = (params, event, details) => {
        if (event.key == 'Enter') {
            const modifiedInterviewer = {
                ...params.row,
                [params.field]: event.target.value
            }
            console.log(modifiedInterviewer)
            updateInterviewerMutation.mutate(modifiedInterviewer)
            setNewInterviewer(modifiedInterviewer);
        }
    }


    const handleCellClick = (e) => {
        console.log(e);
        setInterviewerSelected(e.row);
    };

    const handleDelete = () => {
        const deletedRows = [...interviewers];
        const idx = deletedRows.findIndex(i => i.interviewerId === interviewerSelected.interviewerId);
        if (idx > -1) {
            deletedRows.splice(idx, 1);
            setInterviewers(deletedRows);
            deleteInterviewerMutation.mutate(interviewerSelected.interviewerId);
        }
        
    };

    const handleUserChange = (event) => {
        setUserId(event.target.value);
    };

    const handleDepartmentChange = (event) => {
        setDepartmentId(event.target.value);
    };


    return (
        <div className='grid-container' style={{ height: 300, width: '50%', marginLeft: 600, marginTop: 100 }} >

            <DataGrid
                rows={interviewers}
                columns={columns}
                experimentalFeatures={{ newEditingApi: true }}
                getRowId={(row) => row.interviewerId}
                onCellKeyDown={(params, event, details) => {
                    handleCellKeyDown(params, event, details)
                }}
                onCellClick={handleCellClick}
            />

            <h2>Add an interviewer</h2>
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

                <InputLabel >DepartmentId</InputLabel>
                <Select
                    value={departmentId}
                    onChange={handleDepartmentChange}
                    label="departmentId">
                    {departments.map(department => (
                        <MenuItem value={department.departmentId} key={department.departmentId}>{department.departmentId}</MenuItem>
                    ))
                    }
                </Select>

                <input
                    type="text"
                    name="position"
                    required="required"
                    placeholder="Add position"
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="availability"
                    required="required"
                    placeholder="Add availability"
                    onChange={handleFormChange}
                />
                <input
                    type="text"
                    name="notes"
                    required={false}
                    placeholder="Add notes"
                    onChange={handleFormChange}
                />
                <button type="submit"> Add </button>
            </form>

            <button type='button' onClick={handleDelete}>Delete</button>


        </div >

    );
}
