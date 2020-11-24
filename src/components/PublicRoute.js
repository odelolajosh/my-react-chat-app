import React from 'react';
import { Redirect, Route } from 'react-router-dom'; 
import AuthHelper from '../helpers/AuthHelper';

const PublicRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => AuthHelper.isAuthenticated() === false 
                ? <Component { ...props } /> 
                : <Redirect to="/chat" /> }
         />
    )
}

export default PublicRoute;