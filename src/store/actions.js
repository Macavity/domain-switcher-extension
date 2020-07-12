import * as types from './mutation-types';
import { Project } from '../models/project';

const SETTINGS = 'domain-switcher';

export const addProject = ({ commit }) => {
  const project = new Project('', []);
};

export const initFromSettings = ({ commit }) => {
  const settings = localStorage[SETTINGS];

  if (typeof data !== 'undefined' && data !== null) {
    console.debug('Loaded existing settings.');
    commit(types.UPDATE_PROJECTS, JSON.parse(settings));
  } else {
    commit(types.UPDATE_PROJECTS, []);
  }
};

export const saveSettings = ({ commit, state }) => {
  localStorage[SETTINGS] = JSON.stringify(state.projects);
  console.debug(SETTINGS + ' saved.');
  console.debug(localStorage[SETTINGS]);
};
