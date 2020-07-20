import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import AuthContext from "../../Auth";
import {
    Icon,
    Button
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const Companies = props => {
    const authContext = React.useContext(AuthContext);
    const [Companies, setCompanies] = useState([]);
    useEffect(() => {
        console.log(authContext);
        getCompanies();

    }, [])
    const getCompanies = () => {
        axios.get(`http://${authContext.state.endPoint}/api/companies?access_token=${encodeURI(authContext.state.user.id)}`)
            .then(companies => {
                setCompanies(companies.data);
            }).catch(error => {
                console.log(error);
            });
    }
    const remove = (id) => {
        console.log(id);
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <h2>Companies</h2>
                </div>
                <div className="col-md-6 text-right">
                    <Link to="/companies/add" color="white">
                        <Button color="primary" variant="contained" className="btn btn-primary btn-lg">
                            <Icon>add</Icon> New
                        </Button>
                    </Link>
                </div>
            </div>
            <TableContainer component={Paper} className="mt-4">
                <Table className="" aria-label="caption table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Company Name</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Companies && Companies.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {row.companyName}
                                </TableCell>
                                <TableCell align="right">{row.firstName} {row.lastName}</TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="right">
                                    <Link to={`/companies/edit/${row.id}`} color="white" className="pr-2 pl-2">
                                        <Button color="primary" variant="contained" className="btn btn-primary btn-lg">
                                            <Icon>edit</Icon> Edit
                                    </Button>
                                    </Link>
                                    <Link color="white" onClick={() => remove(row.id)} className="pr-2 pl-2">
                                        <Button color="secondary" variant="contained" className="btn btn-primary btn-lg">
                                            <Icon>delete</Icon> Remove
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

Companies.propTypes = {

};

export default Companies;