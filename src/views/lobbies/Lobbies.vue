<template>
  <div>
    <div class="flex">
      <button
        @click="logout()"
        class="text-xl bg-blue-600 p-2 rounded-br text-white focus:outline-none hover:bg-blue-500"
      >
        Logout
      </button>

      <div class="ml-auto flex">
        <p class="text-xl text-white p-2 bg-green-600 rounded-bl">Welcome back, {{ username }}!</p>
      </div>
    </div>

    <div class="flex justify-center mt-4 items-center">
      <div class="mr-3 text-xl">
        <button
          @click="showCreateForm()"
          class="bg-red-600 pl-2 pr-2 pt-1 pb-1 text-white focus:outline-none rounded hover:bg-red-500"
        >
          <i class="fa fa-plus" style="font-size:20px"></i>
        </button>
      </div>
      <div class="text-5xl">
        Lobbies
      </div>
      <div class="ml-3 text-xl">
        <button
          @click="refresh()"
          class="bg-red-600 pl-2 pr-2 pt-1 pb-1 text-white focus:outline-none rounded hover:bg-red-500"
        >
          <i class="fa fa-refresh" style="font-size:20px"></i>
        </button>
      </div>
    </div>

    <div v-if="!create">
      <Table v-if="!loading" :lobbies="allLobbies" />
    </div>

    <img v-if="loading" src="../../../public/loadingAnimation.svg" alt="" class="loading" />

    <div v-if="create" class="text-center mt-16">
      <form @submit.prevent="createLobby()">
        <input
          v-model="lobbyName"
          type="text"
          placeholder="Lobby Name"
          autocomplete="off"
          class="border-b focus:outline-none"
          style="width: 18%; font-size: 18px;"
        /><br />

        <b-form-checkbox v-model="isPrivate" class="mt-5" switch>Private?</b-form-checkbox>

        <div v-if="isPrivate">
          <input
            v-model="lobbyPassword"
            type="password"
            placeholder="Lobby Password"
            class="border-b focus:outline-none mt-4"
            style="width: 18%; font-size: 18px;"
          /><br />
        </div>
        <input
          type="submit"
          value="Create"
          class="mt-5 p-2 pl-3 pr-3 rounded focus:outline-none hover:opacity-75"
        />
        <input
          type="button"
          value="Cancel"
          @click="showCreateForm()"
          class="mt-5 p-2 pl-3 pr-3 rounded focus:outline-none hover:opacity-75 ml-5"
        />
      </form>
      <p class="mt-3 text-red-600">
        *I recommend making your lobby private to prevent any trolls until I add in management
        features*
      </p>
    </div>
    <div class="text-center">
      <p class="mt-5">vers. 12.5.20</p>
      <p class="mt-2">
        This project is getting more attention so I've come out with a new update!
      </p>
      <p class="mb-2">
        The discord link is working finally so make sure to join that as well.
      </p>

      <a href="https://discord.gg/v4tHeaY" target="_blank">https://discord.gg/B5nT446Y</a>
      🌸<br />
    </div>
    <p class="text-center text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script>
import Table from './Table';
import { mapGetters, mapActions } from 'vuex';

import axios from 'axios';
import validate from 'validate.js';

export default {
  name: 'Lobby',
  components: {
    Table,
  },
  data() {
    return {
      username: '',
      create: false,
      lobbyName: '',
      isPrivate: false,
      lobbyPassword: '',
      errorMessage: '',
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['allLobbies']), // getters from vuex (all lobbies)
  },
  created() {
    const API_URL = process.env.VUE_APP_USER_LOBBY;
    const S_API_URL = process.env.VUE_APP_USERNAME;
    this.loading = true;

    axios
      .get(API_URL, { headers: { authorization: localStorage.token } })
      .then((response) => {
        if (response.data.lobby != '') {
          this.$router.push(`/lobbies/${response.data.lobby}`);
          this.loading = false;
        }
      })
      .catch((error) => {
        this.loading = false;
        this.errorMessage = error.response.data;
      });

    axios
      .get(S_API_URL, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .then((username) => {
        this.username = username.data;
      });

    this.fetchLobbies().then(() => {
      // fetch lobby data
      this.loading = false;
    });
  },
  methods: {
    ...mapActions(['fetchLobbies']), // actions from vuex (send request to get lobby data)

    async createLobby() {
      // take user input and insert new lobby in database
      const API_URL = process.env.VUE_APP_NEW_LOBBY;

      const body = {
        lobbyName: this.lobbyName,
        isPrivate: this.isPrivate,
        lobbyPassword: this.lobbyPassword,
      };
      try {
        // send request to server
        await axios.post(API_URL, body, {
          headers: { authorization: localStorage.token },
        });
        window.location.reload(); // after it updated in the database refresh window
      } catch (error) {
        // if for some reason there was a bug
        this.errorMessage = error.response.data; // display error
      }
    },
    logout() {
      // go back to login page
      localStorage.token = '';
      this.$router.push('/');
    },
    refresh() {
      // refresh to get new updates
      this.loading = true;
      this.fetchLobbies().then(() => {
        // re-fetch data
        this.loading = false;
      });
    },
    showCreateForm() {
      this.lobbyName = '';
      this.isPrivate = false;
      this.lobbyPassword = '';
      this.errorMessage = '';
      this.create = !this.create;
    },
  },
};
</script>
