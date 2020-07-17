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

        for (const obj of objects) {
            if (!obj.id) {
                obj.id = uuidv4();
            }

            projects.push(ProjectFactory.createFromSettingsObject(obj));
        }

        return projects;
    }

    static createFromSettingsObject(projectObject) {
        const environments = [];

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
