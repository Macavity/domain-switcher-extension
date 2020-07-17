export class Environment {
    /**
     * @var string
     */
    id;

    /**
     * @var string
     */
    projectId;

    /**
     * @type {string}
     */
    protocol = 'https';

    /**
     * @var string|null
     */
    label = '';

    /**
     * @var string|null
     */
    pattern = '';

    constructor(id, projectId, protocol = 'https', pattern = '', label = '') {
        this.id = id;
        this.projectId = projectId;
        this.protocol = protocol;
        this.pattern = pattern;
        this.label = label;
    }
}
