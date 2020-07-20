import React from 'react';
import {
    Icon,
    Button
} from "@material-ui/core";
import { Link } from "react-router-dom";
import AuthContext from "../../Auth";
// import PropTypes from 'prop-types';

const Home = props => {
    return (
        <div className="row">
            <AuthContext.Consumer>
                {context => (
                    context.state.isLoggedIn ? (
                        <React.Fragment>
                            <div className="col-md-2">
                                <Link to="/companies" color="white">
                                    <Button color="primary" variant="contained" className="btn btn-primary btn-lg w-100 pt-4 pb-4">
                                        <Icon>business</Icon> Companies
                                </Button>
                                </Link>
                            </div>
                            <div className="col-md-2">
                                <Link to="/employees" color="white">
                                    <Button color="primary" variant="contained" className="btn btn-primary btn-lg w-100 pt-4 pb-4">
                                        <Icon>people</Icon> Employees
                                </Button>
                                </Link>
                            </div>
                        </React.Fragment>) : (
                            <div className="col-md-12 text-center p5">
                                Login for show options
                            </div>
                        )
                )}
            </AuthContext.Consumer>
        </div>
    );
};

Home.propTypes = {

};

export default Home;