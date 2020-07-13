import * as types from './mutation-types';

export default {
  [types.UPDATE_PROJECTS](state, payload) {
    state.projects = [...payload];
  },

  [types.UPDATE_PROJECT](state, project) {
    state.projects = state.projects.map(p => {
      if (p.id === project.id) {
        return project;
      }

      return p;
    });
  },

  [types.ADD_PROJECT](state, payload) {
    state.projects = [...state.projects, payload];
  },
};
