import * as apiService from '../services/apiService';

export default {
  namespace: 'menus',
  state: {
    loading: false,
    list: [],
    roleMenus: [],
  },
  reducers: {
    query(state, action) {
      return {
        ...state, 
        list: action.payload == undefined ? [] : action.payload,
        loading: action.loading,
      };
    },
    queryByRole(state, action) {
      return {
        ...state, 
        roleMenus: action.payload == undefined ? [] : action.payload,
        loading: action.loading,
      };
    }
  },
  effects: {
    *fetch( {}, { call, put }) {
      yield put({
        type: 'query',
        loading: true,
      });
      const data = yield call(apiService.menuList, {});

      yield put({
        type: 'query', 
        payload: data,
        loading: false,
      })
    },
    *fetchByRole( {roleId}, { call, put }) {
      yield put({
        type: 'queryByRole',
        loading: true,
      });
      const data = yield call(apiService.fetchByRole, roleId);

      yield put({
        type: 'queryByRole', 
        payload: data,
        loading: false,
      })
    }
  },
  subscriptions: {},
};
