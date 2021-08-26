import Vuex from 'vuex';
import Vue from 'vue';

import lobbies from './modules/lobbies';
import users from './modules/users';

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    lobbies,
    users,
  },
});
