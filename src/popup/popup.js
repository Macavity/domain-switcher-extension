import Vue from 'vue';
import { Menu, MenuItem, Button, Col, Footer, Row } from 'element-ui';
import Popup from './Popup.vue';
import store from '../store';
import 'element-ui/lib/theme-chalk/index.css';
import { queryCurrentTabURL } from '../helpers/browser';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(MenuItem);

store.dispatch('initFromSettings');

queryCurrentTabURL().then(tabs => {
    console.log('Query Result: ', tabs);
    if (tabs.length === 0 || typeof tabs[0].url === 'undefined') {
        return false;
    }

    new Vue({
        el: '#app',
        store,
        render: h =>
            h(Popup, {
                props: {
                    currentTabURL: tabs[0].url,
                },
            }),
    });
});
