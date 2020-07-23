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
 * @param {string} currentUrl
 * @param {string} targetUrl
 * @param {boolean} openInNewTab
 */
export function sendMessageSwitchDomain(currentUrl, targetUrl, openInNewTab = false) {
    global.browser.runtime.sendMessage({
        type: MESSAGE_TYPE_SWITCH_DOMAIN,
        currentUrl,
        targetUrl,
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
        const { currentUrl, targetUrl, openInNewTab } = messageEvent;
        switchDomain(currentUrl, targetUrl, openInNewTab);
    }
}

/**
 * @param {string} currentUrl
 * @param {string} targetUrl
 * @param {boolean} openInNewTab
 */
export function switchDomain(currentUrl, targetUrl, openInNewTab) {
    console.group('switchDomain');
    console.log('browser.switchDomain');
    console.log(currentUrl);
    console.log(targetUrl);

    global.browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        const currentTab = tabs[0];
        console.log('currentTab', currentTab);

        if (openInNewTab) {
            global.browser.tabs.create({
                url: targetUrl,
            });
        } else {
            global.browser.tabs.update(currentTab.id, {
                url: targetUrl,
            });
        }

        console.groupEnd();
    });
}

/**
 * @param {object} settings
 */
export function exportSettings(settings) {
    const result = JSON.stringify(settings);
    const url = 'data:application/json;base64,' + btoa(result);

    return global.browser.downloads.download({
        url: url,
        filename: 'domain-switcher-settings.json',
    });
}
