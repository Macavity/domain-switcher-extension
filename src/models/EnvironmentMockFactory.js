import { Environment } from './Environment';

let n = 0;

export class EnvironmentMockFactory {
    static createRegExpMock(pattern, patternTarget, protocol = 'https') {
        n++;
        return new Environment(String('e' + n), '', protocol, '', pattern, patternTarget);
    }

    static createMock(pattern) {
        n++;
        return new Environment(String(n), '', 'https', '', pattern);
    }
}
