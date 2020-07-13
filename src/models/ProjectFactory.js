import { Project } from './Project';
import { uuidv4 } from '../helpers/uuid';
import { EnvironmentFactory } from './EnvironmentFactory';

export class ProjectFactory {
  static createEmpty() {
    return new Project(uuidv4(), 'New Project', []);
  }

  static createFromSettingsObject(object) {
    const environments = [];
    for (const env of object._environments) {
      console.log('- Add Environment', env);
      environments.push(EnvironmentFactory.createFromSettingsObject(env));
    }

    return new Project(object._id, object._name, environments);
  }

  static createFromProperties(id, name, environments = []) {
    return new Project(id, name, environments);
  }
}
