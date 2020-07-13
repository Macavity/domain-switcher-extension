import { uuidv4 } from '../helpers/uuid';
import { Environment } from './Environment';

export class EnvironmentFactory {
  static createEmpty(projectId) {
    return new Environment(uuidv4(), projectId, '', '');
  }

  static createFromSettingsObject(object) {
    return new Environment(object._id, object._projectId, object._pattern, object._label);
  }

  static createFromProperties(id, projectId, pattern, label) {
    return new Environment(id, projectId, pattern, label);
  }
}
