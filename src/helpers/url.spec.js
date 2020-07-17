import { describe, fdescribe, it } from '@jest/globals';
import { getMatchingEnvironmentForUrl, urlMatches } from './url';
import { ProjectFactory } from '../models/ProjectFactory';
import { Environment } from '../models/Environment';

describe('urlMatches', () => {
    it('should match for static urls', () => {
        expect(urlMatches('domain.test', new URL('http://domain.test'))).toBe(true);
        expect(urlMatches('domain.test', new URL('https://domain.test'))).toBe(true);
        expect(urlMatches('domain.test', new URL('https://domain.test/'))).toBe(true);
    });

    it('matches for urls ignoring path and query parameters', () => {
        expect(urlMatches('domain.test', new URL('https://domain.test/?query=1'))).toBe(true);
        expect(urlMatches('domain.test', new URL('https://domain.test/page.html'))).toBe(true);
    });

    it('matches for urls ignoring path missing or added trailling slashes', () => {
        expect(urlMatches('domain.test/', new URL('http://domain.test'))).toBe(true);
        expect(urlMatches('domain.test/', new URL('https://domain.test'))).toBe(true);
        expect(urlMatches('domain.test/', new URL('https://domain.test/'))).toBe(true);
        expect(urlMatches('domain.test/', new URL('https://domain.test/?query=1'))).toBe(true);
        expect(urlMatches('domain.test/', new URL('https://domain.test/page.html'))).toBe(true);
    });

    it('matches for www.{pattern} as well', () => {
        expect(urlMatches('domain.test', new URL('http://www.domain.test'))).toBe(true);
        expect(urlMatches('domain.test', new URL('https://www.domain.test'))).toBe(true);

        expect(urlMatches('sub.domain.test', new URL('https://www.sub.domain.test/'))).toBe(true);
        expect(urlMatches('sub.domain.test', new URL('https://www.sub.domain.test/?query=1'))).toBe(true);
        expect(urlMatches('sub.domain.test', new URL('https://www.sub.domain.test/page.html'))).toBe(true);
    });

    it('does not match if the subdomain does not match', () => {
        expect(urlMatches('sub.domain.test', new URL('http://domain.test'))).toBe(false);
        expect(urlMatches('sub.domain.test', new URL('https://domain.test'))).toBe(false);
        expect(urlMatches('sub.domain.test', new URL('https://domain.test/'))).toBe(false);
        expect(urlMatches('sub.domain.test', new URL('https://domain.test/?query=1'))).toBe(false);
        expect(urlMatches('sub.domain.test', new URL('https://domain.test/page.html'))).toBe(false);
    });

    it('should not match if the pattern is somewhere else in the path', function() {
        expect(urlMatches('domain.test', new URL('https://other-domain.test/page.domain.test.html'))).toBe(false);
    });
});

describe('getMatchingEnvironmentForUrl', () => {
    const env1 = new Environment('e1', 'p1', 'domain.test', 'Test');
    const env2 = new Environment('e2', 'p1', 'domain.org', 'Org');
    const projectWithoutEnvs = ProjectFactory.createFromProperties('p0', 'A', []);
    const projectWith1Env = ProjectFactory.createFromProperties('p1', 'A', [env1]);
    const projectWith2Envs = ProjectFactory.createFromProperties('p1', 'A', [env1, env2]);

    it('should be false if there are no projects', function() {
        const currentUrl = 'http://domain.test';

        expect(getMatchingEnvironmentForUrl([], currentUrl)).toBe(false);
    });

    it('should be false if the project has no environments', function() {
        const currentUrl = 'http://domain.test';

        expect(getMatchingEnvironmentForUrl([projectWithoutEnvs], currentUrl)).toBe(false);
    });

    it('should return the matching environment if the url matches', function() {
        const currentUrl = 'http://domain.test';

        expect(getMatchingEnvironmentForUrl([projectWith1Env], currentUrl)).toBeInstanceOf(Environment);
        expect(getMatchingEnvironmentForUrl([projectWith1Env], currentUrl).id).toBe('e1');
    });

    it('should return the the matching environment in case a project has more than one environment', function() {
        const currentUrl = 'http://domain.org';

        expect(getMatchingEnvironmentForUrl([projectWith2Envs], currentUrl).id).toBe('e2');
    });

    it('should return false if the url does not match', function() {
        const currentUrl = 'http://not-here.test';

        expect(getMatchingEnvironmentForUrl([projectWith1Env, projectWith2Envs], currentUrl)).toBe(false);
    });

    it('should return the first result if more than one would match', function() {
        const currentUrl = 'http://domain.test';

        expect(getMatchingEnvironmentForUrl([projectWith1Env, projectWith2Envs], currentUrl).id).toBe('e1');
    });
});
