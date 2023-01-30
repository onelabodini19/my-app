import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { useQuery } from "react-query";



const getCandidates = () => axios.get("http://localhost:8090/api/candidate").then((res) => res.data);


const columns = [

    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: true
    },
    {
        field: 'positon',
        headerName: 'Applying for',
        width: 150,
        editable: true,
        type: 'string'
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        editable: true,
        type: 'string'
    },
    {
        field: 'type',
        headerName: 'Candidate Type',
        width: 150,
        editable: true,
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

    const { isLoading, isError, data, error, refetch } = useQuery(["candidate"], () => getCandidates(), {
        onSuccess: (data) => {
            console.log(data)
            setCandidates(data)
        }
    });

    if (isLoading) return "Loading...";
    if (error) return "An error has occurred: " + error.message;

    return (
        <div className='grid-container' style={{ height: 300, width: '50%', marginLeft: 600, marginTop: 100 }} >

            <DataGrid
                rows={candidates}
                columns={columns}
                getRowId={(row) => row.candidateId}
            />
        </div>
    )
}
