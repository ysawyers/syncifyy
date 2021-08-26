<template>
  <div>
    <div style="width: fit-content;">
      <div style="text-align: center; margin-top: 10px;">
        <h1>Admin Dashboard</h1>

        <h2>Manage Lobbies</h2>
        <li
          v-for="lobby in lobbies"
          :key="lobby.uuid"
          style="font-size: 18px; margin-top: 10px;"
        >
          {{ lobby.title }} - {{ lobby.private }} -
          {{ lobby.owner }}
          <button @click="showEditLobbyForm(lobby.uuid)">
            edit lobby
          </button>
          <button
            @click="adminDeleteLobby(lobby.uuid)"
            style="margin-left: 10px;"
          >
            delete lobby
          </button>
        </li>
      </div>
      <button @click="redirect()">
        Manage Users
      </button>
      <button @click="adminRefresh()" style="margin-left: 10px;">
        Refresh
      </button>
      <button
        @click="adminLogout()"
        style="margin-top: 10px; margin-left: 10px;"
      >
        Logout
      </button>
      <form v-if="editLobbyForm" @submit.prevent="adminEditLobby()">
        <h2 style="margin-top: 10px;">{{ currentLobbyName }}</h2>
        <input
          type="text"
          v-model="currentLobbyName"
          placeholder="Lobby Name"
          style="margin-top: 10px;"
        /><br />
        <input
          type="checkbox"
          v-model="currentLobbyPrivate"
          style="margin-top: 10px;"
        />
        private?<br />
        <input
          :type="showing"
          v-if="currentLobbyPrivate"
          v-model="currentLobbyPassword"
          placeholder="Lobby Password"
          style="margin-top: 10px;"
        /><br />
        <input
          type="submit"
          value="Confirm Changes"
          style="margin-top: 10px;"
        />
        <button
          type="button"
          @click="showing = 'text'"
          style="margin-left: 10px;"
        >
          Show
        </button>
        <button
          type="button"
          @click="showing = 'password'"
          style="margin-left: 10px;"
        >
          Hide
        </button>
        <button
          type="button"
          @click="editLobbyForm = false"
          style="margin-left: 10px;"
        >
          Cancel
        </button>
      </form>

      <p style="color: red; margin-top: 10px;">
        {{ errorMessage }}
      </p>
      <p style="color: green; margin-top: 10px;">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AdminDashboardLobbies',
  data() {
    return {
      lobbies: [],
      editLobbyForm: false,
      currentLobbyId: '',
      currentLobbyName: '',
      currentLobbyPrivate: false,
      currentLobbyPassword: '',
      showing: 'password',
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters(['allLobbiesAdmin']),
  },
  created() {
    this.fetchLobbiesAdmin().then(() => {
      this.lobbies = this.allLobbiesAdmin;
    });
  },
  methods: {
    ...mapActions(['fetchLobbiesAdmin']),

    redirect() {
      this.$router.push('/admin-dashboard');
    },
    showEditLobbyForm(lobby_id) {
      this.currentLobbyId = lobby_id;
      for (var i = 0; i < this.lobbies.length; i++) {
        if (this.lobbies[i].uuid == this.currentLobbyId) {
          this.currentLobbyName = this.lobbies[i].title;
          this.currentLobbyPrivate = this.lobbies[i].private;
          this.currentLobbyPassword = this.lobbies[i].password;
        }
      }

      this.errorMessage = '';
      this.successMessage = '';
      this.editLobbyForm = true;
    },
    async adminRefresh() {
      this.errorMessage = '';
      this.successMessage = '';
      this.currentLobbyPassword = '';
      this.currentLobbyPrivate = '';
      this.currentLobbyId = '';
      this.currentLobbyName = '';
      this.editLobbyForm = false;

      await this.fetchLobbiesAdmin();
      this.lobbies = this.allLobbiesAdmin;
    },
    adminLogout() {
      localStorage.token = '';
      this.$router.push('/');
    },
    async adminEditLobby() {
      try {
        const API_URL = process.env.VUE_APP_EDIT_LOBBY;
        const body = {
          lobbyId: this.currentLobbyId,
          lobbyName: this.currentLobbyName,
          isPrivate: this.currentLobbyPrivate,
          lobbyPassword: this.currentLobbyPassword,
        };
        const message = await axios.put(API_URL, body, {
          headers: { authorization: localStorage.token },
        });
        this.successMessage = message.data;
      } catch (error) {
        this.errorMessage = error.response.data;
      }
    },
    async adminDeleteLobby(lobby_id) {
      try {
        const API_URL = process.env.VUE_APP_DELETE_LOBBY;
        const message = await axios.delete(API_URL, {
          headers: { authorization: localStorage.token },
          data: {
            lobbyId: lobby_id,
          },
        });
        this.successMessage = message.data;
      } catch (error) {
        this.errorMessage = error.response.data;
      }
    },
  },
};
</script>
