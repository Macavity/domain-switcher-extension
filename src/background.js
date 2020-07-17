import store from './store';
import { checkForRegisteredUrl } from './helpers/url';
import { onBackgroundMessage } from './helpers/browser';

global.browser = require('webextension-polyfill');

store.dispatch('initFromSettings');

if (typeof process.env.BUILD_VERSION !== 'undefined') {
    console.log('Version ' + process.env.BUILD_VERSION);
}

global.browser.tabs.onUpdated.addListener(checkForRegisteredUrl);

global.browser.runtime.onMessage.addListener(onBackgroundMessage);

// TODO Figure out to cache the project list in the store and use it from there
// Problem: How can updates be injected.
// global.browser.storage.onChanged.addListener((changes, storageName) => {})
