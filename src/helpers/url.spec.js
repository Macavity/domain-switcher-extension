import { beforeEach, describe, expect, it } from '@jest/globals';
import { getMatchingEnvironmentForUrl, getNewUrl, urlMatches } from './url';
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
    const env1 = new Environment('e1', 'p1', 'http', 'domain.test', 'Test');
    const env2 = new Environment('e2', 'p1', 'http', 'domain.org', 'Org');
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

describe('getNewUrl', () => {
    let currentUrl;

    beforeEach(() => {
        currentUrl = 'http://domain.test';
    });

    it('should return the new url', function() {
        let targetEnv = new Environment('e', 'p', 'http', 'domain.org');

        let newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.org/');
    });

    it('should return the new url with different protocol', function() {
        let targetEnv = new Environment('e', 'p', 'https', 'domain.org');

        let newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('https://domain.org/');

        currentUrl = 'https://domain.org';
        targetEnv = new Environment('e', 'p', 'http', 'domain.dev');
        newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.dev/');
    });

    it('should allow port switching', function() {
        let targetEnv = new Environment('e', 'p', 'http', 'domain.org:8001');

        let newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.org:8001/');

        currentUrl = 'http://domain.test:8000';
        targetEnv.pattern = 'domain.test:9000';

        newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.test:9000/');
    });

    it('should keep the current page on the new url', function() {
        let currentUrl = 'http://domain.test/some/page.html';
        let targetEnv = new Environment('e', 'p', 'http', 'domain.org');
        let newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org/some/page.html');
    });

    it('should keep the search parameters on the new url', function() {
        let currentUrl = 'http://domain.test/?a=1&_b=2';
        let targetEnv = new Environment('e', 'p', 'http', 'domain.org');
        let newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org/?a=1&_b=2');

        currentUrl = 'http://domain.test/page.html?query=alphabet&b=1';
        targetEnv.pattern = 'domain.org:9000';
        newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org:9000/page.html?query=alphabet&b=1');
    });
});
