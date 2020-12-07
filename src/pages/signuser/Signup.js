import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Spinner from '../../components/spinner/Spinner';
import AuthHelper from '../../helpers/AuthHelper';
import ChatHttpServer from '../../helpers/ChatHttpServer';
import "./form.css";
import logo from "../../res/logo.svg";
import ThemeContext from '../../contexts/themeContext';

const Signup = (props) => {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const dispatch = useDispatch();
    const { error, userId, isLoading, token } = useSelector(state => state.auth);

    const signup = (e) => {
        e.preventDefault()
        dispatch(ChatHttpServer.signupUser({ username: name, email, password }))
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
                    <form onSubmit={signup}>
                        <h2> <img src={logo} alt="logo" />   YouChat </h2>
                        <h3> Join and Start a Conversation <span role="img" aria-label="rocket">🚀</span></h3>
                        <input placeholder="Your Username" value={name} type="name" onChange={(e) => setName(e.target.value)} />
                        <input placeholder="Your Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
                        <input placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                        <div className="error">{ error ? error : '' }</div>
                        <div>
                            <button type="submit" disabled={!(password.trim().length > 0 && name.trim().length > 0)}>
                                Create
                                { isLoading ? <Spinner /> : '' }
                            </button>
                        </div>
                        <div className="redirect"><Link to="/login">Login</Link>, If you have an account</div>
                    </form>
                </main>
            )
        }
        </ThemeContext.Consumer>
    )
}

export default Signup;