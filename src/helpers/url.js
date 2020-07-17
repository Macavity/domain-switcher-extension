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
    console.debug('checkForRegisteredUrl', tabId, changeInfo, tab);

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
            const urlPattern = addProtocol(env.pattern);

            if (urlMatches(urlPattern, tabURL)) {
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
    //console.debug('Checking host ' + currentUrl.host + ' against pattern ' + rawPattern);

    if (!currentUrl.host) {
        return false; // if blank url
    }

    let pattern = rawPattern;

    if (rawPattern.indexOf('://') === -1) {
        pattern = 'https://' + pattern;
    }

    const patternUrl = new URL(pattern);

    let match = currentUrl.host.indexOf(patternUrl.host) === 0;
    //console.debug('1st', match);

    if (match) {
        return match;
    }

    match = currentUrl.host.indexOf('www.' + rawPattern) === 0;
    //console.log('2nd', match);

    return match;
}

export function addProtocol(url) {
    if (url.indexOf('://') === -1) {
        return '//' + url;
    } else {
        return url;
    }
}
