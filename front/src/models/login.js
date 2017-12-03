'use strict';

import { auth, fetchUser } from '../services/login';
import { createUser } from '../services/apiService';
import { routerRedux } from 'dva/router';
import { storageTokenKey } from '../utils/utils';
import { message } from 'antd';

export default {
  namespace: 'login',
  state: {
    isLogin: false,
    account: {
      username: null,
      ability: null,
      userId: null,
      email: null
    }
  },
  subscriptions: {},
  effects: {
    auth: function* ({ payload }, { call, put }) {
      const { username, password } = payload;
      const data = yield call(auth, { username, password });
      console.info(data)
      // succeed to login
      if (data.status === 'success') {
        const { user, access_token } = data;
        // save the token to the local storage.
        window.localStorage.setItem(storageTokenKey, access_token);
        yield put({
          type: 'authSuccess',
          payload: { account: user }
        });
        yield put(routerRedux.push('/'));
      } else {
        message.error('用户名或密码错误', 4);
      }
    },
    enterAuth: function* ({ payload }, { put, take }) {
      yield [put({ type: 'checkToken' }), put({ type: 'queryUser' })];
      yield [take('app/hasToken'), take('app/queryUserSuccess')];
      // onComplete();
    },
    checkToken: function* ({ payload }, { put, call, select }) {
      // get the token from local storage.
      const token = window.localStorage.getItem(storageTokenKey);
      if (token) {
        yield put({ type: 'hasToken' });
      } else {
        yield put({ type: 'authFail' });
      }
    },
    logout: function* ({ payload }, { put }) {
      yield put({ type: 'authFail' });
      window.localStorage.removeItem(storageTokenKey);
      yield put(routerRedux.push('/user/login'));
    },
    queryUser: function* ({ payload }, { put, call }) {
      const { data } = yield call(fetchUser);
      if (data) {
        yield put({
          type: 'queryUserSuccess',
          payload: { account: data }
        });
      }
    },
    register: function* ({ payload }, { put, call }) {
      const { username, email, password } = payload;
      const { data } = yield call(createUser, { username, email, password });
      if (data) {
        yield put({
          type: 'auth',
          payload: { username, password }
        });
      }
    },
    account: function* ({ }, { put, call }) {
      console.info("here")
      // const { data } = yield select(state.account);
      yield put(routerRedux.push('/account/info'));
    },
  },
  reducers: {
    authSuccess: function (state, { payload }) {
      const { account } = payload;
      return {
        ...state,
        account,
        isLogin: true
      };
    },
    hasToken: function (state) {
      return {
        ...state,
        isLogin: true
      };
    },
    queryUserSuccess: function (state, { payload }) {
      const { account } = payload;
      // console.info(account);
      return {
        ...state,
        account
      };
    },
    authFail: function (state) {
      return {
        ...state,
        isLogin: false,
        account: {
          username: null,
          ability: null,
          userId: null,
          email: null
        }
      };
    }
  }

}
