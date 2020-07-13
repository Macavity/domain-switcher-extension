import { Project } from './Project';

export class ProjectFactory {
  static createEmpty() {
    // Create ID on save.
    return new Project(null, 'New Project', []);
  }

  static createFromSettingsObject(object) {
    return new Project(object._id, object._name, object._environments);
  }

  static createFromProperties(id, name, environments = []) {
    return new Project(id, name, environments);
  }
}
