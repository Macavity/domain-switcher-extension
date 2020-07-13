import * as types from './mutation-types';
import { ProjectFactory } from '../models/ProjectFactory';
import { uuidv4 } from '../helpers/uuid';

const SETTINGS = 'domain-switcher';

export const addProject = ({ commit }) => {
  const project = ProjectFactory.createEmpty();

  commit(types.ADD_PROJECT, project);
};

export const updateProject = ({ commit }, projectPayload) => {
  commit(types.UPDATE_PROJECT, projectPayload);
};

export const initFromSettings = ({ commit }) => {
  const settings = window.localStorage[SETTINGS];
  console.log('settings', settings);

  if (typeof settings !== 'undefined' && settings !== null) {
    console.debug('Load existing settings.');

    const objects = JSON.parse(settings);
    const projects = [];

    for (const obj of objects) {
      if (!obj._id) {
        obj._id = uuidv4();
      }

      projects.push(ProjectFactory.createFromSettingsObject(obj));
    }

    commit(types.UPDATE_PROJECTS, projects);
  } else {
    commit(types.UPDATE_PROJECTS, []);
  }
};

export const saveSettings = ({ commit, state }) => {
  localStorage[SETTINGS] = JSON.stringify(state.projects);
  console.debug(SETTINGS + ' saved.');
  console.debug(localStorage[SETTINGS]);
};
