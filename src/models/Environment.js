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

    /**
     * @type {string|null}
     */
    badgeColor;

    /**
     * @type {string}
     */
    badgeText;

    constructor(id, projectId, protocol = 'https', label = '', pattern = '', patternTarget = '', badgeColor = null, badgeText = '') {
        this.id = id;
        this.projectId = projectId;
        this.protocol = protocol;
        this.label = label;
        this.pattern = pattern;
        this.patternTarget = patternTarget;
        this.badgeColor = badgeColor;
        this.badgeText = badgeText;
    }
}
