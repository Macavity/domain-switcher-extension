export class Project {
    /**
     * @var {string|null}
     */
    id;

    /**
     * @var {string}
     */
    name;

    /**
     * @var {Environment[]}
     */
    environments;

    /**
     * @var {boolean}
     */
    useRegExp;

    /**
     * @var {boolean}
     */
    useBadges;

    constructor(id, name, environments = [], useRegExp = false, useBadges = false) {
        this.id = id;
        this.name = name;
        this.environments = environments;
        this.useRegExp = useRegExp;
        this.useBadges = useBadges;
    }

    addEnvironment(env) {
        this.environments.push(env);
    }

    removeEnvironmentById(envId) {
        this.environments = this.environments.filter(item => item.id !== envId);
    }
}
