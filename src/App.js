import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
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
        theme => (
          <div className={`app-body ${theme}`}>
          <Router>
            <Switch>
              <Route path="/" exact><Redirect to="/chat" /></Route>
              <PrivateRoute path="/chat" component={Home}  />
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
