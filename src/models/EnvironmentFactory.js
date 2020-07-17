import { uuidv4 } from '../helpers/uuid';
import { Environment } from './Environment';

export class EnvironmentFactory {
    static createEmpty(projectId) {
        return new Environment(uuidv4(), projectId, '', '');
    }

    static createFromSettingsObject(object) {
        const protocol = object.protocol || 'https://';
        const id = object.id || uuidv4();
        const projectId = object.projectId;
        const pattern = object.pattern;
        const label = object.label;

        return new Environment(id, projectId, protocol, pattern, label);
    }

    static clone(env) {
        return new Environment(env.id, env.projectId, env.protocol, env.pattern, env.label);
    }
}
