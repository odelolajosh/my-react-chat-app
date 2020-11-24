import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthHelper from '../helpers/AuthHelper';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => AuthHelper.isAuthenticated() === true 
                ? <Component { ...props }/> 
                : <Redirect to={{ pathname: "/login", state: { from: props.location } }} /> }
         />
    )
}

export default PrivateRoute;