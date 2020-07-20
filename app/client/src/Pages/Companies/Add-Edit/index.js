import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AuthContext from "../../../Auth";
import history from '../../../Components/History';
import axios from 'axios';

const AddEdit = props => {
    const authContext = React.useContext(AuthContext);
    const [Title, setTitle] = useState('')
    const [Company, setCompany] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const [Error, setError] = useState('')
    useEffect(() => {
        const { match } = props;
        console.log(match);
        if (match.params.id) {
            setTitle(`Edit Company`);
            let where = { "where": { "id": match.params.id } }
            axios.get(`http://${authContext.state.endPoint}/api/companies?filter=${encodeURI(JSON.stringify(where))}&access_token=${encodeURI(authContext.state.user.id)}`)
                .then(company => {
                    console.log(company);
                    if (company.data.length > 0) {
                        setCompany(company.data[0]);
                        setTitle(`Edit Company ${company.data[0].companyName}`);
                    }
                    // setCompanies(companies.data);
                }).catch(error => {
                    console.log(error);
                });

        } else {
            setTitle('New Company')
        }
    }, [])
    const onChange = (event) => {
        setCompany({ ...Company, [event.target.name]: event.target.value });
    }
    const add = (data) => {
        axios.post(`http://${authContext.state.endPoint}/api/companies/`, data)
            .then(company => {
                
                history.push(`/companies`);

            }).catch(error => {
                if (error.response) {
                    setError(error.response.data.error.message)
                } else {
                    setError('Uups Try Again')
                }
            })
    }
    const update = (id, data) => {
        // axios.put(`http://${authContext.state.endPoint}/api/companies/${id}&?access_token=${encodeURI(authContext.state.user.id)}`, data)
        //     .then(company => {

        //     }).catch(error => {

        // })
    }
    const submit = (e) => {
        console.log(e);
        console.log(Company)
        if (Company.id) {
            update(Company.id, Company);
        } else {
            add(Company);
        }
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
                            <label htmlFor="companyName">Company Name</label>
                            <input autoComplete="off" onChange={onChange} type="text" name="companyName" className="form-control" value={`${Company.companyName}`} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input autoComplete="off" onChange={onChange} type="text" name="firstName" className="form-control" value={`${Company.firstName}`} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input autoComplete="off" onChange={onChange} type="text" name="lastName" className="form-control" value={`${Company.lastName}`} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input autoComplete="off" onChange={onChange} type="email" name="email" className="form-control" value={`${Company.email}`} />
                        </div>
                    </div>
                    {!Company.id ? (<div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input autoComplete="off" onChange={onChange} type="password" name="password" className="form-control" value={`${Company.password}`} />
                        </div>
                    </div>) : (<></>)}
                </div>
                <div className="row">
                    <div className="col-md-12 text-right">
                        <button className="btn btn-success" onClick={(e) => submit(e)}>Save</button>
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