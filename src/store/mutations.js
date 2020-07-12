import * as types from './mutation-types';

export default {
  [types.UPDATE_PROJECTS](state, payload) {
    state.projects = [...payload];
  },
};
