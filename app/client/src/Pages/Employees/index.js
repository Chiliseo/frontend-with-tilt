import React, { useEffect, useState } from 'react'
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

function Employees(props) {
    const authContext = React.useContext(AuthContext);
    const [Employees, setEmployees] = useState([]);
    useEffect(() => {
        console.log(authContext);
        getEmployees();

    }, [])
    const getEmployees = () => {
        axios.get(`http://${authContext.state.endPoint}/api/employees?access_token=${encodeURI(authContext.state.user.id)}`)
            .then(employees => {
                setEmployees(employees.data);
            }).catch(error => {
                console.log(error);
            });
    }
    const remove = (id, index) => {
        console.log(id);
        axios.delete(`http://${authContext.state.endPoint}/api/employees/${id}?access_token=${encodeURI(authContext.state.user.id)}`)
            .then(employees => {
                setEmployees(Employees => Employees.splice(index, 1))
            }).catch(error => {
                console.log(error);
            });
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <h2>Employees</h2>
                </div>
                <div className="col-md-6 text-right">
                    <Link to="/employees/add" color="white">
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
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Employees && Employees.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left">{row.firstName} {row.lastName}</TableCell>
                                <TableCell align="left">{row.email}</TableCell>
                                <TableCell align="right">
                                    <Link to={`/employees/edit/${row.id}`} color="white" className="pr-2 pl-2">
                                        <Button color="primary" variant="contained" className="btn btn-primary btn-lg">
                                            <Icon>edit</Icon> Edit
                                    </Button>
                                    </Link>

                                    <Button color="secondary" variant="contained" onClick={() => remove(id, index)} className="btn btn-primary btn-lg pr-2 pl-2">
                                        <Icon>delete</Icon> Remove
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

Employees.propTypes = {

}

export default Employees

