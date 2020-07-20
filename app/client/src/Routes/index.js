import React from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from 'react-loadable';
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import * as ROUTES from "../Constants";
import Loading from "../Components/Loading";

const drawerWidth = 240;
const styles = (theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
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
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'center'
    },
    content: {
        flexGrow: 1,
    },
    contentShift: {
    },
    toolbar: theme.mixins.toolbar,
    nested: {
        paddingLeft: theme.spacing(6),
    },
    ListItemIcon: {
        marginRight: '0px'
    }


});

const LoadingComponent = () => <Loading />;

const AsyncLogin = Loadable({
    loader: () => import('../Pages/Login'),
    loading: LoadingComponent
});
const AsyncHome = Loadable({
    loader: () => import('../Pages/Home'),
    loading: LoadingComponent
});
const AsyncCompanies = Loadable({
    loader: () => import('../Pages/Companies'),
    loading: LoadingComponent
});
const AsyncCompaniesAddEdit = Loadable({
    loader: () => import('../Pages/Companies/Add-Edit'),
    loading: LoadingComponent
});
const AsyncEmployees = Loadable({
    loader: () => import('../Pages/Employees'),
    loading: LoadingComponent
});
const AsyncEmployeesAddEdit = Loadable({
    loader: () => import('../Pages/Employees/Add-Edit'),
    loading: LoadingComponent
});
const NavigatorPages = props => {
    const { classes } = props;
    return (
        <div className="routes">
            <div className={classes.root} id="content">
                <CssBaseline />
                <main
                    className={classNames(classes.content, classes.contentShift)} id="content-main">
                    <div className={'container contain-component'}>
                        <Switch>
                            <Route exact path={ROUTES.HOME} component={AsyncHome} />
                            <Route exact path={ROUTES.LOGIN} component={AsyncLogin} />
                            <Route exact path={ROUTES.COMPANIES} component={AsyncCompanies} />
                            <Route exact path={ROUTES.COMPANIESADD} component={AsyncCompaniesAddEdit} />
                            <Route exact path={ROUTES.COMPANIESEDIT} component={AsyncCompaniesAddEdit} />
                            <Route exact path={ROUTES.EMPLOYEES} component={AsyncEmployees} />
                            <Route exact path={ROUTES.EMPLOYEESADD} component={AsyncEmployeesAddEdit} />
                            <Route exact path={ROUTES.EMPLOYEESEDIT} component={AsyncEmployeesAddEdit} />
                        </Switch>
                    </div>
                </main>
            </div>
        </div>
    )
}
NavigatorPages.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NavigatorPages);