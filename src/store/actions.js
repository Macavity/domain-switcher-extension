import * as types from './mutation-types';
import { ProjectFactory } from '../models/ProjectFactory';
import { EnvironmentFactory } from '../models/EnvironmentFactory';
import { SETTINGS } from '../constants';

export const addProject = ({ commit }) => {
    const project = ProjectFactory.createEmpty();

    commit(types.ADD_PROJECT, project);
};

export const addEnvironment = ({ commit }, { projectId }) => {
    const env = EnvironmentFactory.createEmpty(projectId);

    commit(types.ADD_ENVIRONMENT, env);
};

export const deleteEnvironment = ({ commit }, { projectId, environmentId }) => {
    commit(types.DELETE_ENVIRONMENT, { projectId, environmentId });
};

export const updateEnvironment = ({ commit }, environment) => {
    commit(types.UPDATE_ENVIRONMENT, environment);
};

export const updateProject = ({ commit }, projectPayload) => {
    commit(types.UPDATE_PROJECT, projectPayload);
};

export const showImportDialog = ({ commit }) => {
    commit(types.SHOW_IMPORT_DIALOG);
};

export const hideImportDialog = ({ commit }) => {
    commit(types.HIDE_IMPORT_DIALOG);
};

export const importSettings = ({ commit }, jsonString) => {
    return new Promise((resolve, reject) => {
        try {
            const projects = ProjectFactory.createListFromSettingsString(jsonString);
            if (projects.length) {
                commit(types.UPDATE_PROJECTS, projects);
                return resolve(true);
            }

            return resolve(false);
        } catch (e) {
            return reject(e);
        }
    });
};

export const initFromSettings = ({ commit }) => {
    const settings = window.localStorage[SETTINGS];
    console.log('settings', settings);

    if (typeof settings !== 'undefined' && settings !== null) {
        console.debug('Load existing settings.');

        const projects = ProjectFactory.createListFromSettingsString(settings);

        commit(types.UPDATE_PROJECTS, projects);
    } else {
        commit(types.UPDATE_PROJECTS, []);
    }
};

export const saveSettings = ({ commit, state }) => {
    commit(types.START_SAVING);
    localStorage[SETTINGS] = JSON.stringify(state.projects);
    console.debug(SETTINGS + ' saved.');
    console.debug(localStorage[SETTINGS]);
    commit(types.SAVING_DONE);
};
