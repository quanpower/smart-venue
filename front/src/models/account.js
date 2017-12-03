import { queryCurrent } from '../services/apiService';

export default {
  namespace: 'account',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch({ userId }, { call, put }) {
      const user = yield call(queryCurrent, userId);
      // console.info(user);
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
