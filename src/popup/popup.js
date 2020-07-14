import Vue from 'vue';
import Popup from './Popup.vue';
import store from '../store';
import router from './router';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(Popup),
});
