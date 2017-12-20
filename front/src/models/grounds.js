import * as apiService from '../services/apiService';

export default {
  namespace: 'grounds',
  state: {
    list: [],
    total: 0,
    currentPage: 0,
    currentGroundPrice: [],
  },
  reducers: {
    query(state, action) {
      return {
        ...state, 
        list: action.payload == undefined ? [] : action.payload,
        total: action.total,
        currentPage: action.currentPage,
      };
    },
    getCurrentGroundPrice(state, action) {
      return {
        ...state,
        currentGroundPrice: action.payload,
      };
    }
  },
  effects: {
    *fetch( {currentPage}, { call, put }) {
      const response = yield call(apiService.groundList, {});
      const total = response.data.length;

      yield put({
        type: 'query', 
        payload: response.data.splice((currentPage-1) * 10, 10),
        total: total,
        currentPage: currentPage
      })
    },
    *getPrice( {groundId}, { call, put }) {
      const response = yield call(apiService.getPrice, groundId);
      yield put({
        type: 'getCurrentGroundPrice', 
        payload: response,
      })
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/business/grounds') {
          dispatch({
            type: 'fetch',
            currentPage: 1,
          });
        }
      });
    }
  },
};
