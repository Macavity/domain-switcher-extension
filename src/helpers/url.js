/**
 *
 * @param tabId
 * @param changeInfo
 * @param tab
 * @return {boolean}
 */
import { SETTINGS } from '../constants';
import { ProjectFactory } from '../models/ProjectFactory';

export function checkForRegisteredUrl(tabId, changeInfo, tab) {
    console.log('checkForRegisteredUrl', tabId, changeInfo, tab);

    const extensionSettings = localStorage[SETTINGS];

    if (!extensionSettings) {
        return false;
    }

    const projects = ProjectFactory.createListFromSettingsString(extensionSettings);

    const envs = getEnvsForCurrentUrl(projects, tab.url);

    if (envs) {
        global.browser.pageAction.show(tabId);
        global.browser.pageAction.setTitle({
            tabId: tab.id,
            title: 'url: ' + tab.url,
        });
        global.browser.pageAction.setPopup({ tabId: tab.id, popup: 'popup.html' });
    }
}

/**
 * @param projects
 * @param currentUrl
 * @return {Environment|boolean}
 */
export function getEnvsForCurrentUrl(projects, currentUrl) {
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
 * @param {string} pattern
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
