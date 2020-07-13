import * as types from './mutation-types';
import { ProjectFactory } from '../models/ProjectFactory';

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

  [types.ADD_ENVIRONMENT](state, env) {
    state.projects = state.projects.map(p => {
      /** @var Project p */
      if (p.id === env.projectId) {
        p.addEnvironment(env);

        return p;
      }

      return p;
    });
  },

  [types.DELETE_ENVIRONMENT](state, { projectId, environmentId }) {
    state.projects = state.projects.map(p => {
      /** @var Project p */
      if (p.id === projectId) {
        p.removeEnvironmentById(environmentId);

        return p;
      }

      return p;
    });
  },
};
