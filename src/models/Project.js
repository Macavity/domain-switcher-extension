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
    isRegExp;

    constructor(id, name, environments = [], isRegExp = false) {
        this.id = id;
        this.name = name;
        this.environments = environments;
        this.isRegExp = isRegExp;
    }

    addEnvironment(env) {
        this.environments.push(env);
    }

    removeEnvironmentById(envId) {
        this.environments = this.environments.filter(item => item.id !== envId);
    }
}
