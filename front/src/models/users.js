import * as apiService from '../services/apiService';

export default {
  namespace: 'users',
  state: {
    list: [],
    loading: false,
    total: 0,
    currentPage: 0,
  },
  reducers: {
    query(state, action) {
      return {
        ...state, 
        list: action.payload == undefined ? [] : action.payload,
        loading: action.loading,
        total: action.total,
        currentPage: action.currentPage,
      };
    } 
  },
  effects: {
    *fetch( {query: {currentPage}}, { call, put }) {
      yield put({
        type: 'query',
        loading: true,
      });
      const response = yield call(apiService.userList, {});

      const total = response.data.length;
      console.info(total)
      yield put({
        type: 'query', 
        payload: response.data.splice((currentPage-1) * 10, 10),
        loading: false,
        total: total,
        currentPage: currentPage
      })
    }
  },
  subscriptions: {},
};
