import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AuthContext from "../../../Auth";
import history from '../../../Components/History';
import axios from 'axios';

const AddEdit = props => {
    const authContext = React.useContext(AuthContext);
    const [Title, setTitle] = useState('');
    const [Employee, setEmployee] = useState({
        companyId: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        admin: false
    });
    const [CompanyName, setCompanyName] = useState('')
    const [Error, setError] = useState('')
    useEffect(() => {
        const { match } = props;
        console.log(match);
        getCompanyName()
        if (match.params.id) {
            setTitle(`Edit Employee`);
            let where = { "where": { "id": match.params.id } }
            axios.get(`http://${authContext.state.endPoint}/api/employees?filter=${encodeURI(JSON.stringify(where))}&access_token=${encodeURI(authContext.state.user.id)}`)
                .then(company => {
                    console.log(company);
                    if (company.data.length > 0) {
                        setEmployee(company.data[0]);
                        setTitle(`Edit Employee ${company.data[0].firstName}`);
                    }
                    // setCompanies(companies.data);
                }).catch(error => {
                    console.log(error);
                });

        } else {
            setTitle('New Employee')
        }
    }, [])
    const getCompanyName = () => {
        axios.get(`http://${authContext.state.endPoint}/api/companies?access_token=${encodeURI(authContext.state.user.id)}`)
            .then(company => {
                console.log(company);
                if (company.data.length > 0) {
                    setCompanyName(company.data[0].companyName);
                    setEmployee({ ...Employee, companyId: company.data[0].id });
                }
                // setCompanies(companies.data);
            }).catch(error => {
                console.log(error);
            });
    }
    const onChange = (event) => {
        if (event.target.name === 'admin') {
            setEmployee({ ...Employee, [event.target.name]: event.target.checked });
        } else {
            setEmployee({ ...Employee, [event.target.name]: event.target.value });
        }
    }

    const add = (data) => {
        console.log(data);
        axios.post(`http://${authContext.state.endPoint}/api/employees?access_token=${encodeURI(authContext.state.user.id)}`, data)
            .then(employee => {

                history.push(`/employees`);

            }).catch(error => {
                if (error.response) {
                    setError(error.response.data.error.message)
                } else {
                    setError('Uups Try Again')
                }
            })
    }
    const update = (id, data) => {
        axios.put(`http://${authContext.state.endPoint}/api/employees/${id}&?access_token=${encodeURI(authContext.state.user.id)}`, data)
            .then(employee => {

            }).catch(error => {
                if (error.response) {
                    setError(error.response.data.error.message)
                } else {
                    setError('Uups Try Again')
                }
            })

    }
    const submit = (e) => {
        console.log(e);
        console.log(Employee)
        if (Employee.id) {
            update(Employee.id, Employee);
        } else {
            add(Employee);
        }
    }
    const back = (e) => {
        history.push(`/employees`);
    }
    return (
        <div className="card">

            <div className="card-header">
                {Title}
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input autoComplete="off" onChange={onChange} type="text" name="firstName" className="form-control" value={`${Employee.firstName}`} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input autoComplete="off" onChange={onChange} type="text" name="lastName" className="form-control" value={`${Employee.lastName}`} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input autoComplete="off" onChange={onChange} type="email" name="email" className="form-control" value={`${Employee.email}`} />
                        </div>
                    </div>
                    {Employee && !Employee.id ? (<div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input autoComplete="off" onChange={onChange} type="password" name="password" className="form-control" value={`${Employee.password}`} />
                        </div>
                    </div>) : (<></>)}
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <input autoComplete="off" readOnly={true} type="text" name="companyName" className="form-control" value={`${CompanyName}`} />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="admin">Is Admin</label>
                            <input autoComplete="off" checked={Employee.admin} onChange={onChange} type="checkbox" name="admin" className="form-control" value={`${Employee.admin}`} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-right">
                        <button className="btn btn-success mr-2" onClick={(e) => submit(e)}>Save</button>
                        <button className="btn btn-primary mr-2" onClick={(e) => back(e)}>Cancel</button>
                        {Error && <p className="text-danger mt-4">{Error}</p>}
                    </div>
                </div>
            </div>
        </div >
    );
};

AddEdit.propTypes = {

};

export default AddEdit;