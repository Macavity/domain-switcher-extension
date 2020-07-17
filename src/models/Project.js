export class Project {
    /**
     * @var string|null
     */
    id;

    /**
     * @var string
     */
    name;

    /**
     * @var Environment[]
     */
    environments;

    constructor(id, name, environments = []) {
        this.id = id;
        this.name = name;
        this.environments = environments;
    }

    addEnvironment(env) {
        this.environments.push(env);
    }

    removeEnvironmentById(envId) {
        this.environments = this.environments.filter(item => item.id !== envId);
    }
}
