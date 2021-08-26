<template>
  <div>
    <p
      style="color: red; margin-bottom: -40px;"
      class="text-center mt-1 text-xl"
    >
      {{ errorMessage }}
    </p>

    <table v-if="!validatePassword" class="mt-5">
      <thead>
        <tr>
          <th>Lobby</th>
          <th>Owner</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="page in lobbies[currentPage]"
          :key="page.uuid"
          class="lobby-rows"
          @click="checkIfPrivate(page.private, page.password, page.uuid)"
        >
          <td>{{ page.title }}</td>
          <td>{{ page.owner }}</td>
          <td v-if="page.private == 1">
            <i class="fa fa-lock" style="font-size:24px"></i>
          </td>
          <td v-if="page.private == 0">
            <i class="fa fa-unlock-alt" style="font-size:24px"></i>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!validatePassword" class="flex justify-center items-center mt-5">
      <button
        class="mr-3 p-2 pl-3 pr-3 bg-red-600 rounded text-white focus:outline-none hover:bg-red-500"
        @click="goLeft()"
      >
        <i class="fa fa-long-arrow-left" style="font-size:24px"></i>
      </button>
      <div>page {{ currentPage + 1 }} / {{ lobbies.length }}</div>
      <button
        class="ml-3 p-2 pl-3 pr-3 bg-red-600 rounded text-white focus:outline-none hover:bg-red-500"
        @click="goRight()"
      >
        <i class="fa fa-long-arrow-right" style="font-size:24px"></i>
      </button>
    </div>
    <div class="text-center">
      <form
        v-if="validatePassword"
        @submit.prevent="redirectIfCorrect()"
        class="mt-5"
      >
        <input
          type="password"
          v-model="passwordInput"
          placeholder="Enter Password"
          class="border-b focus:outline-none mt-4"
          style="width: 18%; font-size: 18px;"
        /><br />
        <input
          type="Submit"
          value="Submit"
          class="mt-5 p-2 pl-3 pr-3 rounded focus:outline-none hover:opacity-75"
        />
        <input
          type="button"
          @click="cancel()"
          value="Cancel"
          class="mt-5 p-2 pl-3 pr-3 rounded focus:outline-none ml-5 hover:opacity-75"
        />
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Table',
  props: {
    lobbies: Array,
  },
  data() {
    return {
      validatePassword: false,
      password: '',
      lobbyId: '',
      passwordInput: '',
      errorMessage: '',
      currentPage: 0,
    };
  },
  methods: {
    async checkIfPrivate(privateLobby, password, lobbyId) {
      // checks if the lobby is private
      if (privateLobby == 1) {
        this.validatePassword = true;
        this.password = password;
        this.lobbyId = lobbyId;
      } else {
        this.password = '';
        this.validatePassword = false;
        this.$router.push(`/lobbies/${lobbyId}`);
      }
    },
    async redirectIfCorrect() {
      // if the password inserted was correct..
      if (this.passwordInput == this.password) {
        this.errorMessage = '';
        this.$router.push(`/lobbies/${this.lobbyId}`); // send to lobby
      } else {
        this.errorMessage = 'Invalid Password!'; // invalid password
      }
    },
    cancel() {
      // clear out of form, reset data
      this.password = '';
      this.lobbyId = '';
      this.passwordInput = '';
      this.errorMessage = '';
      this.validatePassword = false;
    },
    goRight() {
      let newPage = this.currentPage + 1;
      if (newPage == this.lobbies.length) {
        this.currentPage = 0;
      } else {
        this.currentPage = newPage;
      }
    },
    goLeft() {
      let newPage = this.currentPage - 1;
      if (newPage < 0) {
        this.currentPage = this.lobbies.length - 1;
      } else {
        this.currentPage = newPage;
      }
    },
  },
};
</script>

<style>
table {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  border-collapse: separate;
  border-spacing: 0 15px;
}

.lobby-rows:hover {
  cursor: pointer;
  opacity: 0.5;
}
</style>
