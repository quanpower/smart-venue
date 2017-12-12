import * as apiService from '../services/apiService';

export default {
  namespace: 'roles',
  state: {
    list: [],
    total: 0,
    currentPage: 0,
  },
  reducers: {
    query(state, action) {
      return {
        ...state, 
        list: action.payload == undefined ? [] : action.payload,
        total: action.total,
        currentPage: action.currentPage,
      };
    }
  },
  effects: {
    *fetch( {currentPage}, { call, put }) {
      const response = yield call(apiService.roleList, {});
      const total = response.data.length;

      yield put({
        type: 'query', 
        payload: response.data.splice((currentPage-1) * 10, 10),
        total: total,
        currentPage: currentPage
      })
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/system/roles') {
          dispatch({
            type: 'fetch',
            currentPage: 1,
          });
        }
      });
    }
  },
};
