import { PAGE_OPTIONS } from '../constants';
import { addProtocol } from './url';
import { EnvironmentFactory } from '../models/EnvironmentFactory';

global.browser = require('webextension-polyfill');

const MESSAGE_TYPE_SWITCH_DOMAIN = 'SWITCH_DOMAIN';

export async function queryCurrentTabURL() {
    return global.browser.tabs.query({ active: true, lastFocusedWindow: true });
}

export function getExtensionPageURL(page) {
    global.browser.extension.getURL(page);
}

export function goToOptionsPage() {
    global.browser.tabs.create({
        url: getExtensionPageURL(PAGE_OPTIONS),
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
 *
 * @param {URL} currentUrl
 * @param {Environment} targetEnv
 * @param {boolean} openInNewTab
 */
export function switchDomain(currentUrl, targetEnv, openInNewTab) {
    console.log('browser.switchDomain', currentUrl, targetEnv);

    if (typeof targetEnv.id === 'undefined') {
        targetEnv = EnvironmentFactory.createFromSettingsObject(targetEnv);
    }

    global.browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        const currentTab = tabs[0];
        console.log('currentTab', currentTab);
        console.log('targetEnv', targetEnv);

        const targetEnvUrl = addProtocol(targetEnv.pattern);
        console.log('targetEnvUrl', targetEnvUrl);
        const targetUrl = new URL(addProtocol(targetEnvUrl));

        targetUrl.port = currentUrl.port;

        console.log('new', targetUrl);

        // // update current URL to use host, domain, port, start of path of the selected environment.
        // var uri = new Uri(tabs[0].url);
        // var requestUrl = addHttpIfNoProtocol(request.url);
        // var newUri = new Uri(requestUrl);
        // var currUriEntry = getCurrentUrlEntry(tabs[0].url);
        //
        // // update uri to use host, port, protocol of selected ENV
        // uri.host(newUri.host());
        // uri.port(newUri.port());
        // uri.protocol(newUri.protocol());
        //
        //
        // // update uri to use start of path of selected ENV - if path in ENV url
        // var currentPath = uri.path();
        // if(currUriEntry.path() !== '') {
        //     currentPath = uri.path().replace(currUriEntry.path(), '');
        // }
        // uri.path(newUri.path() + currentPath);
        // console.log('updating to', uri.toString(), tabs);

        if (openInNewTab) {
            global.browser.tabs.create({
                url: targetUrl,
            });
        } else {
            global.browser.tabs.update(currentTab.id, {
                url: targetUrl,
            });
        }
    });
}
