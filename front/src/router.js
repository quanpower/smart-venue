import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';

import Login from './routes/User/Login';

function RouterConfig({ history, app }) {

  // 用户认证
  const AuthRoute = ({ component: Component, ...rest }) => {
    app._store.dispatch({
      type: 'login/enterAuth',
      payload: {},
    });
    const state = app._store.getState();
    return (
      <Route {...rest} render={props => (
        state.login.isLogin ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/user/login',
            state: { from: props.location }
          }}/>
        )
      )}/>
    )
  
  }

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <AuthRoute path="/" component={BasicLayout} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
