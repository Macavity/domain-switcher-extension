import { uuidv4 } from '../helpers/uuid';
import { Environment } from './Environment';

export class EnvironmentFactory {
    static createEmpty(projectId) {
        return new Environment(uuidv4(), projectId, 'https');
    }

    static createFromSettingsObject(object) {
        object.protocol = object.protocol || 'https';
        object.id = object.id || uuidv4();

        return EnvironmentFactory.clone(object);
    }

    static clone(env) {
        return new Environment(env.id, env.projectId, env.protocol, env.label, env.pattern, env.patternTarget, env.badgeColor, env.badgeText);
    }
}
