export class Environment {
    /**
     * @var {string}
     */
    id;

    /**
     * @var {string}
     */
    projectId;

    /**
     * @type {string}
     */
    protocol = 'https';

    /**
     * @var {string|null}
     */
    label = '';

    /**
     * Matching Pattern
     *
     * @var {string|null}
     */
    pattern = '';

    /**
     * Target Pattern (RegExp only)
     *
     * @var {string|null}
     */
    patternTarget = '';

    /**
     * @type {string}
     */
    targetURL = '';

    constructor(id, projectId, protocol = 'https', label = '', pattern = '', patternTarget = '') {
        this.id = id;
        this.projectId = projectId;
        this.protocol = protocol;
        this.label = label;
        this.pattern = pattern;
        this.patternTarget = patternTarget;
    }
}
