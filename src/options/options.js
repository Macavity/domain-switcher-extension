import Vue from 'vue';
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Dialog,
    Footer,
    Form,
    FormItem,
    Header,
    Input,
    Loading,
    Main,
    Message,
    MessageBox,
    Option,
    Row,
    Select,
    Table,
    TableColumn,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '../store';
import DomainSwitcherOptions from './DomainSwitcherOptions';

global.browser = require('webextension-polyfill');

Vue.use(Alert);
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Option);
Vue.use(Row);
Vue.use(Card);
Vue.use(Col);
Vue.use(Dialog);
Vue.use(Footer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Table);
Vue.use(TableColumn);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;

store.dispatch('initFromSettings');

new Vue({
    el: '#options',
    store,
    render: h => h(DomainSwitcherOptions),
});
