import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '../store';
import DomainSwitcherOptions from './DomainSwitcherOptions';

global.browser = require('webextension-polyfill');

Vue.use(ElementUI);

store.dispatch('initFromSettings');

new Vue({
  el: '#options',
  store,
  render: h => h(DomainSwitcherOptions),
});
