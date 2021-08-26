import axios from 'axios';

const state = {
  users: [],
};

const getters = {
  allUsersAdmin: (state) => state.users,
};

const actions = {
  async fetchUsersAdmin({ commit }) {
    const API_URL = process.env.VUE_APP_LIST_USERS;
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: localStorage.token,
      },
    });
    commit('setUsersAdmin', response.data);
  },
};

const mutations = {
  setUsersAdmin: (state, users) => (state.users = users),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
