import React, { Component, createContext } from "react";
import history from '../Components/History';
import axios from 'axios';


const AuthContext = createContext({});
export default AuthContext;

class AuthProvider extends Component {
    constructor(props) {
        super(props);
        var user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : false;
        this.state = {
            isLoggedIn: localStorage.getItem("user") ? true : false,
            endPoint: localStorage.getItem("endPoint") ? localStorage.getItem("endPoint") : process.env.REACT_APP_API_REMOTE,
            user: user,
            error: '',
        };
        this.logOut = this.logOut.bind(this);
        this.logIn = this.logIn.bind(this);
    }
    logIn = (e, dataState) => {
        console.log(dataState);
        e.preventDefault();
        const { email, password } = dataState;
        let data = {
            email: email,
            password: password
        }
        axios.post(`http://${this.state.endPoint}/api/directory/${encodeURI(email)}`)
            .then(directory => {
                this.setState({ endPoint: directory.data });
                axios.post(`http://${directory.data}/api/logins`, data)
                    .then(user => {
                        if (user.data) {
                            localStorage.setItem("user", JSON.stringify(user.data));
                            this.setState({
                                user: user.data
                            });
                            this.setState({
                                isLoggedIn: localStorage.getItem("user") ? true : false
                            });
                            history.push(`/`);
                        }
                    }).catch(error => {
                        if (error.response) {
                            const dataResponse = error.response.data;
                            const { message } = dataResponse.error;
                            this.setState({ error: message });
                        }
                    })
            }).catch(error => {
                if (error.response) {
                    const dataResponse = error.response.data;
                    const { message } = dataResponse.error;
                    this.setState({ error: message });

                }
            })


    };

    logOut = (data) => {
        localStorage.removeItem("user");

        this.setState({
            isLoggedIn: false
        });
        this.setState({
            user: false
        });
        history.push('/login', null);
    };

    render() {
        return (
            <AuthContext.Provider
                value={{
                    state: this.state,
                    logIn: this.logIn,
                    logOut: this.logOut
                }}
                auth={{ ...this.state }}
            >
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

// export default AuthProvider;
export const Consumer = AuthContext.Consumer;
export const Provider = AuthProvider;