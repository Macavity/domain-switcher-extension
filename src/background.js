import store from './store';
import { checkForRegisteredUrl } from './helpers/url';
//import { Window as chrome } from 'web-ext-types';

global.browser = require('webextension-polyfill');

store.dispatch('initFromSettings');

global.browser.tabs.onUpdated.addListener(checkForRegisteredUrl);
