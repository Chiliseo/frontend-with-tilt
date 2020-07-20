import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Avatar,
    Button,
    CssBaseline,
    FormControl,
    Input,
    InputLabel,
    Paper,
    Typography
} from "@material-ui/core/";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import AuthContext from "../../Auth";

const styles = theme => ({
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
            .spacing() * 3}px`
    },
    avatar: {
        margin: theme.spacing(),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing()
    },
    submit: {
        marginTop: theme.spacing(3)
    }
});

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null
};
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };


    render() {
        const { classes } = this.props;
        const { username, password } = this.state;
        const isInvalid = password === "" || username === "";
        return (
            // <AuthProvider>
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    <AuthContext.Consumer>
                        {context => (

                            <form className={classes.form} onSubmit={(e) => context.logIn(e, this.state)} >
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        onChange={this.onChange}
                                        required
                                        autoFocus
                                        type="email"
                                    />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        id="password"
                                        onChange={this.onChange}
                                        required
                                    />
                                </FormControl>


                                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={isInvalid} onClick={(e) => context.logIn(e, this.state)}>
                                    Sign in
                                </Button>
                                <p className="text-uppercase text-danger text-center mt-4">{context.state.error}</p>
                            </form>

                        )}
                    </AuthContext.Consumer>
                </Paper>
            </main>
            // </AuthProvider>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired
};
// Login.contextType=useContext(withAuth);

export default withStyles(styles)(Login);
