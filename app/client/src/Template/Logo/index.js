import React, { Component } from 'react';
import logo from '../../logo.svg';
import '../../App.css';

class Logo extends Component {
    render() {
        return (
            <img src={logo} className="App-logo" width="64" alt="logo" />
        );
    }
}

export default Logo;