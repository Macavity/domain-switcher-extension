import { beforeEach, describe, expect, it } from '@jest/globals';
import { checkForRegisteredUrl, getMatchingEnvironmentForUrl, getNewUrl, getNewUrlForRegExp, urlMatches, urlMatchesRegEx } from './url';
import { ProjectFactory } from '../models/ProjectFactory';
import { Environment } from '../models/Environment';
import { ProjectMockFactory } from '../models/ProjectMockFactory';
import { EnvironmentMockFactory } from '../models/EnvironmentMockFactory';
import { SETTINGS } from '../constants';

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

describe('urlMatchesRegEx with regular expression', function() {
    it('should match for regex', function() {
        let currentUrl = new URL('https://project-subproject.subdomain.domain.org');
        let regExp = 'project-([^.]+).subdomain.domain.org';

        expect(urlMatchesRegEx(regExp, currentUrl)).toBe(true);

        currentUrl = new URL('https://project.domain.test');
        regExp = '([a-z]+).domain.test';
        expect(urlMatchesRegEx(regExp, currentUrl)).toBe(true);
    });
});

describe('getMatchingEnvironmentForUrl', () => {
    const env1 = EnvironmentMockFactory.createMock('domain.test');
    const env2 = new Environment('e2', 'p1', 'http', 'Org', 'domain.org');
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
        expect(getMatchingEnvironmentForUrl([projectWith1Env], currentUrl).id).toBe(env1.id);
    });

    it('should return the the matching environment in case a project has more than one environment', function() {
        const currentUrl = 'http://domain.org';

        expect(getMatchingEnvironmentForUrl([projectWith2Envs], currentUrl).id).toBe(env2.id);
    });

    it('should return false if the url does not match', function() {
        const currentUrl = 'http://not-here.test';

        expect(getMatchingEnvironmentForUrl([projectWith1Env, projectWith2Envs], currentUrl)).toBe(false);
    });

    it('should return the first result if more than one would match', function() {
        const currentUrl = 'http://domain.test';

        expect(getMatchingEnvironmentForUrl([projectWith1Env, projectWith2Envs], currentUrl).id).toBe(env1.id);
    });

    describe('with regular expressions', function() {
        const currentUrl = 'https://project.domain.test';
        const regexEnv = EnvironmentMockFactory.createRegExpMock('([a-z]+).domain.test', '$1.domain.test');
        const project = ProjectMockFactory.createRegExpMock([regexEnv]);

        it('should match for a regular expression', function() {
            expect(getMatchingEnvironmentForUrl([project], currentUrl)).toBeInstanceOf(Environment);
            expect(getMatchingEnvironmentForUrl([project], currentUrl).id).toBe(regexEnv.id);
        });
    });
});

describe('getNewUrl', () => {
    let currentUrl;

    beforeEach(() => {
        currentUrl = 'http://domain.test';
    });

    it('should return the new url', function() {
        let targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.org');

        let newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.org/');
    });

    it('should return the new url with different protocol', function() {
        let targetEnv = new Environment('e', 'p', 'https', 'E', 'domain.org');

        let newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('https://domain.org/');

        currentUrl = 'https://domain.org';
        targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.dev');
        newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.dev/');
    });

    it('should allow port switching', function() {
        let targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.org:8001');

        let newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.org:8001/');

        currentUrl = 'http://domain.test:8000';
        targetEnv.pattern = 'domain.test:9000';

        newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.test:9000/');
    });

    it('should keep the current page on the new url', function() {
        let currentUrl = 'http://domain.test/some/page.html';
        let targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.org');
        let newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org/some/page.html');
    });

    it('should keep the search parameters on the new url', function() {
        let currentUrl = 'http://domain.test/?a=1&_b=2';
        let targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.org');
        let newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org/?a=1&_b=2');

        currentUrl = 'http://domain.test/page.html?query=alphabet&b=1';
        targetEnv.pattern = 'domain.org:9000';
        newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org:9000/page.html?query=alphabet&b=1');
    });
});

describe('getNewUrlForRegExp', function() {
    it('should return the new url for regular expressions', function() {
        let currentUrl = 'http://project.domain.test';
        let currentEnv = EnvironmentMockFactory.createRegExpMock('([a-z]+).domain.test', '$1.domain.test');
        let targetEnv = EnvironmentMockFactory.createRegExpMock('([a-z]+).domain.org', '$1.domain.org', 'https');

        let newUrl = getNewUrlForRegExp(currentUrl, targetEnv, currentEnv);
        expect(newUrl).toBe('https://project.domain.org/');

        targetEnv = EnvironmentMockFactory.createRegExpMock('([a-z]+).domain.org', '$1.domain.org', 'http');
        newUrl = getNewUrlForRegExp(currentUrl, targetEnv, currentEnv);
        expect(newUrl).toBe('http://project.domain.org/');
    });

    xit('should allow port switching', function() {
        let targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.org:8001');

        let newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.org:8001/');

        currentUrl = 'http://domain.test:8000';
        targetEnv.pattern = 'domain.test:9000';

        newUrl = getNewUrl(currentUrl, targetEnv);
        expect(newUrl).toBe('http://domain.test:9000/');
    });

    xit('should keep the current page on the new url', function() {
        let currentUrl = 'http://domain.test/some/page.html';
        let targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.org');
        let newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org/some/page.html');
    });

    xit('should keep the search parameters on the new url', function() {
        let currentUrl = 'http://domain.test/?a=1&_b=2';
        let targetEnv = new Environment('e', 'p', 'http', 'E', 'domain.org');
        let newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org/?a=1&_b=2');

        currentUrl = 'http://domain.test/page.html?query=alphabet&b=1';
        targetEnv.pattern = 'domain.org:9000';
        newUrl = getNewUrl(currentUrl, targetEnv);

        expect(newUrl).toBe('http://domain.org:9000/page.html?query=alphabet&b=1');
    });
});

describe('checkForRegisteredUrl', function() {
    const urlEvent = { url: 'http://project.domain.test' };

    it('should be false if the event does not contain a url', function() {
        expect(checkForRegisteredUrl(1, {}, { something: 5 })).toBe(false);
    });

    it('should be false if the there are not projects saved yet', function() {
        expect(checkForRegisteredUrl(1, {}, urlEvent)).toBe(false);
    });

    describe('with registered projects', function() {
        let projects;
        let p1 = ProjectMockFactory.createMock();
        let env1 = EnvironmentMockFactory.createMock('project.domain.test');

        beforeEach(function() {
            p1.environments = [env1];
            localStorage[SETTINGS] = JSON.stringify([p1]);
        });
    });

    // TODO Figure out how we can test this
    xit('should trigger the pageAction.setPopup if it matches a registered url', function() {
        const setPopupSpy = spyOn(global.browser.pageAction, 'setPopup');
        checkForRegisteredUrl(1, {}, urlEvent);
        expect(setPopupSpy).toHaveBeenCalled();
    });
});
