import axios from 'axios';

const state = {
  lobbies: [],
  lobbiesAdmin: [],
};

const getters = {
  allLobbies: (state) => state.lobbies,
  allLobbiesAdmin: (state) => state.lobbiesAdmin,
};

const actions = {
  async fetchLobbies({ commit }) {
    const API_URL = process.env.VUE_APP_ALL_LOBBIES;
    const response = await axios.get(API_URL, {
      headers: { Authorization: localStorage.token },
    });

    let tableStructure = [];
    let tablePage = [];

    for (var i = 0; i < response.data.length; i++) {
      tablePage.push(response.data[i]);

      if (tablePage.length >= 8) {
        tableStructure.push(tablePage);
        tablePage = [];
      }
    }

    if (tablePage.length > 0) {
      tableStructure.push(tablePage);
    }
    commit('setLobbies', tableStructure);
  },
  async fetchLobbiesAdmin({ commit }) {
    const API_URL = process.env.VUE_APP_LIST_LOBBIES;
    const response = await axios.get(API_URL, {
      headers: { Authorization: localStorage.token },
    });
    commit('setLobbiesAdmin', response.data);
  },
};

const mutations = {
  setLobbies: (state, lobbies) => (state.lobbies = lobbies),
  setLobbiesAdmin: (state, lobbiesAdmin) => (state.lobbiesAdmin = lobbiesAdmin),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
