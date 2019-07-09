import React from 'react';
import { HashRouter as Router, Route, Switch,Redirect } from 'react-router-dom';
import App from './App';
import Admin from './admin';
import Login from './Pages/login';
import Home from './Pages/home';
import City from './Pages/city';
import Order from './Pages/order';
import Common from './commom';
import OrderDetail from './Pages/order/detail';
import User from './Pages/user';
import BikeMap from './Pages/map/bikemap';
import permission from './Pages/permission';
import Nofound from './Pages/nomatch';

export default class iRouter extends React.Component {
    render() {
        return (
            <Router>
                <App>
                    <Switch>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/common" render={() =>
                            <Common>
                                <Route path="/common/order/detail/:orderId" component={OrderDetail}></Route>
                            </Common>
                        }></Route>
                        <Route path="/" render={() =>
                            <Admin>
                                <Switch>
                                    <Route path="/home" component={Home}></Route>
                                    <Route path="/ui/buttons" component={Login}></Route>
                                    <Route path="/city" component={City}></Route>
                                    <Route path="/order" component={Order}></Route>
                                    <Route path="/user" component={User}></Route>
                                    <Route path="/bikeMap" component={BikeMap}></Route>
                                    <Route path="/permission" component={permission}></Route>
                                    <Redirect to="/home"></Redirect>
                                    <Route component={Nofound}></Route>
                                </Switch>
                            </Admin>
                        }></Route>
                    </Switch>
                </App>
            </Router>
        )
    }
}