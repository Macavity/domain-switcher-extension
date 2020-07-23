import { Environment } from './Environment';

export class TargetEnvironment extends Environment {
    /**
     * @type {string}
     */
    targetUrl = '';

    /**
     * @param {Environment} env
     * @param targetUrl
     */
    constructor(env, targetUrl) {
        super(env.id, env.projectId, env.protocol, env.label, env.pattern, env.patternTarget);
        this.targetUrl = targetUrl;
    }
}
