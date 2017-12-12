import * as apiService from '../services/apiService';

export default {
  namespace: 'menus',
  state: {
    list: [],
    roleMenus: [],
  },
  reducers: {
    query(state, action) {
      return {
        ...state, 
        list: action.payload == undefined ? [] : action.payload,
      };
    },
    queryByRole(state, action) {
      return {
        ...state, 
        roleMenus: action.payload == undefined ? [] : action.payload,
      };
    }
  },
  effects: {
    *fetch( {}, { call, put }) {
      const data = yield call(apiService.menuList, {});
      yield put({
        type: 'query', 
        payload: data,
      })
    },
    *fetchByRole( {roleId}, { call, put }) {
      const data = yield call(apiService.fetchByRole, roleId);
      yield put({
        type: 'queryByRole', 
        payload: data,
      })
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/system/menus') {
          dispatch({
            type: 'fetch',
          });
        }
      });
    }
  },
};
