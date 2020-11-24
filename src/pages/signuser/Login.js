import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Spinner from '../../components/spinner/Spinner';
import ThemeContext from '../../contexts/themeContext';
import AuthHelper from '../../helpers/AuthHelper';
import ChatHttpServer from '../../helpers/ChatHttpServer';
import "../../styles/form.css";
import logo from "../../res/logo.svg";

const Login = (props) => {
    const [ name, setName ] = useState("");
    const [ password, setPassword ] = useState("");
    const dispatch = useDispatch();
    const { error, isLoading, token, userId } = useSelector(state => state.auth);

    const login = (e) => {
        e.preventDefault()
        dispatch(ChatHttpServer.loginUser({ username: name, password }))
    }
    
    const { from } = props.location.state || { from: {pathname: '/'} }
    if (token) {
        AuthHelper.authenticate(userId, token, () => <Redirect to={from.pathname} />)
        return <Redirect to={from.pathname} />
    }
    return (
        <ThemeContext.Consumer>
        {
            theme => (
                <main className={`${theme} form-page`}>
                    <form onSubmit={login}>
                        <h2> <img src={logo} alt="logo" />   YouChat </h2>
                        <h3>{ props.location.state ? "Yeah! You have to login" : "Welcome Back!" } <span role="img" aria-label="cool">😎</span></h3>
                        <input placeholder="Your Username" value={name} type="name" onChange={(e) => setName(e.target.value)} />
                        <input placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                        { error ? <div className="error">{ error }</div> : '' }
                        <div>
                            <button type="submit" disabled={!(password.trim().length > 0 && name.trim().length > 0)}>
                                Login
                                { isLoading ? <Spinner /> : '' }
                            </button>
                        </div>
                        <div className="redirect">You don't have an account?<Link to="/signup">Sign Up</Link></div>
                    </form>
                </main>
            )
        }
        </ThemeContext.Consumer>
        
    )
}

export default Login;