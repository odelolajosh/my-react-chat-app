import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import {  } from 'react'
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Main from './pages/main/Main';
import Join from './pages/join/Join';
import Login from './pages/signuser/Login';
import Signup from './pages/signuser/Signup';
import NotFound from './pages/notfound/NotFound';
import AuthHelper from './helpers/AuthHelper';
import ChatHttpServer from './helpers/ChatHttpServer';
import { connect } from 'react-redux';
import ThemeContext from './contexts/themeContext';

class App extends Component {

  componentDidMount() {
    // window.localStorage.clear()
    if (AuthHelper.isAuthenticated()) {
      const { userId, token } = AuthHelper.getAuthValue();
      this.props.checkUserToken(userId, token)
    }
  }
  
  render() {
    return (
      <ThemeContext.Consumer>
      {
        ({ theme }) => (
          <div className={`app-body`} style={{ background: theme.backgroundColor, color: theme.textColor }}>
          <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route path="/" exact><Redirect to="/in"/></Route>
              <PrivateRoute path="/in" component={Main}  />
              <Route path="/join" component={Join}  />
              <PublicRoute path="/login" component={Login} />
              <PublicRoute path="/signup" component={Signup} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Router>
          </div>
        )
      }
      </ThemeContext.Consumer>
    )
  }
}

export default connect(
  (state) => ({ userId: state.auth.userId, token: state.auth.token }),
  (dispatch) => ({ checkUserToken: (userId, token) => dispatch(ChatHttpServer.checkToken(userId, token)) })
)(App);
