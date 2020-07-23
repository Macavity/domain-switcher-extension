import { Project } from './Project';
import { uuidv4 } from '../helpers/uuid';
import { EnvironmentFactory } from './EnvironmentFactory';

let n = 0;

export class ProjectMockFactory {
    static createMock(environments = []) {
        n++;
        return new Project('p' + n, 'P' + n, environments, false);
    }
    static createRegExpMock(environments = []) {
        n++;
        return new Project('p' + n, 'P' + n, environments, true);
    }
}
