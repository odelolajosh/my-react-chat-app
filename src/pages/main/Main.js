import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import SpinnerFullPage from '../../components/spinner';

import './main.css';

const Home = lazy(() => import("../home/Home"));

class Main extends React.Component {
    render() {
        const { pathname: path } = this.props.location;
        return (
            <div className="main-in">
                <div className="container">
                    <Suspense fallback={<SpinnerFullPage />}>
                        <Switch>
                            <Route path="/in" exact> <Redirect to={`${path}/chat`} /> </Route>
                            <Route path="/in/chat" exact component={Home} />
                        </Switch> 
                    </Suspense>
                </div>
            </div>
        )
    }
}

export default withRouter(Main);