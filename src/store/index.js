import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        projects: [],
        isSaving: false,
    },
    getters,
    mutations,
    actions,
    plugins: [createLogger()],
});
