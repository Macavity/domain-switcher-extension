import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

const plugins = [];

if (process.env.NODE_ENV !== 'production') {
    plugins.push(createLogger());
}

export default new Vuex.Store({
    state: {
        projects: [],
        isSaving: false,
        importDialogOpen: false,
    },
    getters,
    mutations,
    actions,
    plugins,
});
