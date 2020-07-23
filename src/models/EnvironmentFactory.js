import { uuidv4 } from '../helpers/uuid';
import { Environment } from './Environment';

export class EnvironmentFactory {
    static createEmpty(projectId) {
        return new Environment(uuidv4(), projectId, 'https');
    }

    static createFromSettingsObject(object) {
        const protocol = object.protocol || 'https';
        const id = object.id || uuidv4();
        const projectId = object.projectId;
        const pattern = object.pattern;
        const label = object.label;
        const patternTarget = object.patternTarget;

        return new Environment(id, projectId, protocol, label, pattern, patternTarget);
    }

    static clone(env) {
        return new Environment(env.id, env.projectId, env.protocol, env.label, env.pattern, env.patternTarget);
    }
}
