/**
 *
 * @param tabId
 * @param changeInfo
 * @param tab
 * @return {boolean}
 */
import { PAGE_POPUP, SETTINGS } from '../constants';
import { ProjectFactory } from '../models/ProjectFactory';

export function checkForRegisteredUrl(tabId, changeInfo, tab) {
    // console.debug('checkForRegisteredUrl', tabId, changeInfo, tab);

    if (typeof tab.url === 'undefined') {
        return false;
    }

    const extensionSettings = localStorage[SETTINGS];

    if (!extensionSettings) {
        return false;
    }

    const projects = ProjectFactory.createListFromSettingsString(extensionSettings);

    const envs = getMatchingEnvironmentForUrl(projects, tab.url);

    if (envs) {
        console.debug('Environment matches => Activate Domain Switcher Popup');
        global.browser.pageAction.show(tabId);
        global.browser.pageAction.setTitle({
            tabId: tab.id,
            title: 'url: ' + tab.url,
        });
        global.browser.pageAction.setPopup({
            tabId: tab.id,
            popup: PAGE_POPUP,
        });

        // TODO Add dynamic Badge showing current Environment
        // global.browser.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
        // global.browser.browserAction.setBadgeText({text:"?"});
    }
}

/**
 * @param projects
 * @param currentUrl
 * @return {Environment|boolean}
 */
export function getMatchingEnvironmentForUrl(projects, currentUrl) {
    const tabURL = new URL(currentUrl);

    for (const project of projects) {
        for (const env of project.environments) {
            const matchResult = project.isRegExp ? urlMatchesRegEx(env.pattern, tabURL) : urlMatches(env.pattern, tabURL);

            if (matchResult) {
                return env;
            }
        }
    }

    return false;
}

/**
 * @param {string} rawPattern
 * @param {URL} currentUrl
 * @return {boolean}
 */
export function urlMatches(rawPattern, currentUrl) {
    //console.debug('Checking currentURL.host "' + currentUrl.host + '" against pattern "' + rawPattern + '"');

    if (!currentUrl.host) {
        return false; // if blank url
    }

    let pattern = rawPattern;

    if (rawPattern.indexOf('://') === -1) {
        pattern = addProtocol(pattern);
    }
    const patternUrl = new URL(pattern);

    //console.log(patternUrl.host);

    let match = currentUrl.host.indexOf(patternUrl.host) === 0;
    //console.debug('1st', match);

    if (match) {
        return match;
    }

    match = currentUrl.host.indexOf('www.' + rawPattern) === 0;
    //console.log('2nd', match);

    return match;
}

/**
 * @param {string} pattern
 * @param {URL} currentUrl
 * @return {boolean}
 */
export function urlMatchesRegEx(pattern, currentUrl) {
    //console.debug('Checking currentURL.host "' + currentUrl.host + '" against regex pattern "' + pattern + '"');
    if (typeof pattern !== 'string') {
        throw new Error('Pattern needs to be a string.');
    }

    if (!currentUrl.host) {
        // console.error('URL has no host')
        return false; // if blank url
    }

    const regExp = new RegExp(pattern);

    const test = regExp.test(currentUrl.host);
    // console.debug('test',test);

    return test;
}

export function addProtocol(url) {
    if (url.indexOf('://') === -1) {
        return 'https://' + url;
    } else {
        return url;
    }
}

/**
 * @param {string} urlString
 * @param {Environment} targetEnv
 * @return {string}
 */
export function getNewUrl(urlString, targetEnv) {
    const targetEnvUrl = targetEnv.protocol + '://' + targetEnv.pattern;
    const targetUrl = new URL(targetEnvUrl);
    const currentUrl = new URL(urlString);

    targetUrl.pathname = currentUrl.pathname;
    targetUrl.search = currentUrl.search;

    return targetUrl.toString();
}

/**
 * @param {string} currentUrlString
 * @param {Environment} targetEnv
 * @param {Environment|null} currentEnv
 * @return {string}
 */
export function getNewUrlForRegExp(currentUrlString, targetEnv, currentEnv = null) {
    const currentUrl = new URL(currentUrlString);
    const targetHost = currentUrl.host.replace(new RegExp(currentEnv.pattern), targetEnv.patternTarget);
    // console.log('currentUrl.host', currentUrl.host);
    // console.log('currentEnv.pattern', currentEnv.pattern);
    // console.log('targetEnv.patternTarget', targetEnv.patternTarget);
    // console.log('=> targetHost', targetHost);

    const targetEnvUrl = targetEnv.protocol + '://' + targetHost;
    const targetUrl = new URL(targetEnvUrl);

    targetUrl.pathname = currentUrl.pathname;
    targetUrl.search = currentUrl.search;

    return targetUrl.toString();
}
