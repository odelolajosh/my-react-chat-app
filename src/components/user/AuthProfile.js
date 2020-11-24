import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatHttpServer from '../../helpers/ChatHttpServer';
import usePromise from '../../hooks/usePromise';
import Spinner from '../spinner/Spinner';
import './user.css';

export const AuthProfile = () => {
    // const [user, changeUser] = useState();
    const { token, userId } = useSelector((state) => state.auth);
    const [ user, error, pending ] = usePromise (
        () => ChatHttpServer.getUserDetails(userId, token),
        { }
    )
    
    if (pending) {
        return <Spinner />
    }
    if (error) {
        return <div>error</div>
    }
    return (
        <div className="auth-profile--bx">
            <div className="auth-profile-img--bx"></div>
            <div className="auth-profile-dt--bx">
                <div className="username">{ user.username }</div>
            </div>
        </div>
    )
}