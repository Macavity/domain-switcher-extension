import { Project } from './Project';
import { uuidv4 } from '../helpers/uuid';
import { EnvironmentFactory } from './EnvironmentFactory';

export class ProjectFactory {
    static createEmpty() {
        return new Project(uuidv4(), 'New Project', []);
    }

    static createListFromSettingsString(settings) {
        if (typeof settings !== 'string') {
            throw Error('Unexpected settings type.');
        }

        const objects = JSON.parse(settings);
        const projects = [];

        if (!Array.isArray(objects)) {
            throw new Error('Settings object is expected to be an array.');
        }

        for (const obj of objects) {
            const project = ProjectFactory.createFromSettingsObject(obj);

            if (project !== null) {
                projects.push(project);
            }
        }

        return projects;
    }

    static createFromSettingsObject(projectObject) {
        const environments = [];

        projectObject.name = projectObject.name || '';
        projectObject.environments = projectObject.environments || [];

        if (!Array.isArray(projectObject.environments)) {
            throw new Error('environments is expected to be an array.');
        }

        if (projectObject.environments.length === 0 && projectObject.name.length === 0) {
            console.log('Empty Project skipped.', projectObject);
            return null;
        }

        projectObject.id = projectObject.id || uuidv4();
        for (const env of projectObject.environments) {
            env.projectId = projectObject.id;
            environments.push(EnvironmentFactory.createFromSettingsObject(env));
        }

        const name = projectObject.name;
        const id = projectObject.id;

        return new Project(id, name, environments);
    }

    static createFromProperties(id, name, environments = []) {
        return new Project(id, name, environments);
    }
}
