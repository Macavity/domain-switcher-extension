import { PAGE_OPTIONS } from '../constants';
import { addProtocol, getNewUrl } from './url';
import { EnvironmentFactory } from '../models/EnvironmentFactory';

global.browser = require('webextension-polyfill');

const MESSAGE_TYPE_SWITCH_DOMAIN = 'SWITCH_DOMAIN';

export async function queryCurrentTabURL() {
    return global.browser.tabs.query({ active: true, lastFocusedWindow: true });
}

export function getExtensionPageURL(page) {
    return global.browser.extension.getURL(page);
}

export function goToOptionsPage() {
    const optionsPage = getExtensionPageURL(PAGE_OPTIONS);

    global.browser.tabs.create({
        url: optionsPage,
    });
}

/**
 * Sent from the Popup to the background listener
 *
 * @param {URL} currentUrl
 * @param {Environment} targetEnv
 * @param {boolean} openInNewTab
 */
export function sendMessageSwitchDomain(currentUrl, targetEnv, openInNewTab = false) {
    global.browser.runtime.sendMessage({
        type: MESSAGE_TYPE_SWITCH_DOMAIN,
        currentUrl,
        targetEnv,
        openInNewTab,
    });
}

/**
 *
 * @param messageEvent
 */
export function onBackgroundMessage(messageEvent) {
    if (typeof messageEvent.type === 'undefined') {
        return;
    }

    if (messageEvent.type === MESSAGE_TYPE_SWITCH_DOMAIN) {
        const { currentUrl, targetEnv, openInNewTab } = messageEvent;
        switchDomain(currentUrl, targetEnv, openInNewTab);
    }
}

/**
 * @param {string} urlString
 * @param {object} targetEnv
 * @param {boolean} openInNewTab
 */
export function switchDomain(urlString, targetEnv, openInNewTab) {
    console.group('switchDomain');
    console.log('browser.switchDomain');
    console.log(urlString);
    console.log(targetEnv);

    targetEnv = EnvironmentFactory.createFromSettingsObject(targetEnv);

    global.browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        const currentTab = tabs[0];
        console.log('currentTab', currentTab);
        console.log('currentUrl', urlString);
        console.log('targetEnv', targetEnv);

        const newUrl = getNewUrl(urlString, targetEnv);

        if (openInNewTab) {
            global.browser.tabs.create({
                url: newUrl,
            });
        } else {
            global.browser.tabs.update(currentTab.id, {
                url: newUrl,
            });
        }

        console.groupEnd();
    });
}
