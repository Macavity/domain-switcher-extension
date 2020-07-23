import { TargetEnvironment } from './TargetEnvironment';
import { getNewUrl, getNewUrlForRegExp } from '../helpers/url';
import col from 'element-ui/packages/col/src/col';

export class TargetEnvironmentFactory {
    /**
     * @param {string} currentUrl
     * @param {Environment} targetEnv
     *
     * @return {TargetEnvironment}
     */
    static create(currentUrl, targetEnv) {
        const targetUrl = getNewUrl(currentUrl, targetEnv);

        return new TargetEnvironment(env);
    }

    /**
     * @param {Project} project
     * @param {string} currentUrl
     * @param {Environment} currentEnv
     * @param {Environment} targetEnv
     *
     * @return {TargetEnvironment}
     */
    static createForRegExp(project, currentUrl, currentEnv, targetEnv) {
        const targetUrl = getNewUrlForRegExp(currentUrl, targetEnv, currentEnv);

        return new TargetEnvironment(targetEnv, targetUrl);
    }

    /**
     * @param {Project} project
     * @param {string} currentUrl
     * @param {Environment} currentEnv
     *
     * @return {TargetEnvironment[]}
     */
    static createCollection(project, currentUrl, currentEnv) {
        let collection = [];

        for (const targetEnv of project.environments) {
            if (project.isRegExp) {
                collection.push(TargetEnvironmentFactory.createForRegExp(project, currentUrl, currentEnv, targetEnv));
            } else {
                collection.push(TargetEnvironmentFactory.create(currentUrl, targetEnv));
            }
        }

        return collection;
    }
}
