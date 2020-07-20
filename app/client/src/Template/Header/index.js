import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import history from '../../Components/History';

// context 
import AuthContext from "../../Auth";
// import * as ROLES from "../../constants/roles";


import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/green";
import {
    AppBar,
    Toolbar,
    Button,
    Icon
} from "@material-ui/core";
import Logo from "../Logo";
// var user = JSON.parse(localStorage.getItem('user'));
// import Cookies from 'universal-cookie';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    hide: {
        display: 'none',
    },
    LinkItem: {
        color: grey[50],
        textDecoration: "none",
        "&:hover": {
            color: grey[50],
            textDecoration: "none",
        }
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#0da5de",
        marginBottom: '20px',
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    }
});
// const cookies = new Cookies();

class ButtonAppBar extends Component {
    //   static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            btnConfig: true,
        };
        this.signOut = this.signOut.bind(this)
    }
    // componentDidMount() {
    //     if (localStorage.getItem('idcentro')) {
    //         this.setState({ btnConfig: !this.state.btnConfig })
    //     }
    //     if (localStorage.getItem("user")) {
    //         this.setState({ login: true })
    //     }
    // }
    signOut() {
        localStorage.setItem("logout", true);
        localStorage.removeItem("user");
        history.push('/login?logout=true', null);
    }
    render() {
        const { classes } = this.props;
        const { open } = this.props;
        return (

            <div id="headerApp">
                <AppBar position="static"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}>
                    <Toolbar className="container-fluid">
                        <Link to="/" className={classes.flex}>
                            <Logo />
                        </Link>
                        <>
                            <AuthContext.Consumer>
                                {context => (
                                    <React.Fragment>
                                        {context.state.isLoggedIn ? (
                                            <Button color="inherit" onClick={() => context.logOut('hi')}>
                                                <Icon>exit_to_app</Icon> Sign out
                                            </Button>
                                        ) : (
                                                <Link to="/login" color="white" className={classes.LinkItem}>
                                                    <Button color="inherit">
                                                        <Icon>people</Icon> Login
                                                    </Button>
                                                </Link>
                                                )
                                        }
                                    </React.Fragment>
                                )}
                            </AuthContext.Consumer>


                        </>
                    </Toolbar>
                </AppBar>
            </div >


        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired
};

// export default withFirebase(withStyles(styles)(ButtonAppBar));
export default withStyles(styles)(ButtonAppBar);
