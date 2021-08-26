<template>
  <div class="Login">
    <div class="text-center text-4xl mt-5">Login</div>
    <form v-if="!loading" @submit.prevent="login()" class="text-center">
      <div class="mt-5">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          autocomplete="off"
          class="border-b focus:outline-none"
          style="width: 18%; font-size: 18px;"
        />
      </div>
      <div class="mt-5">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          autocomplete="off"
          class="border-b focus:outline-none"
          style="width: 18%; font-size: 18px;"
        />
      </div>
      <p class="text-red-600 mt-3">
        {{ errorMessage }}
      </p>
      <div>
        <input
          type="submit"
          value="Enter!"
          class="mt-5 p-2 pl-3 pr-3 rounded hover:opacity-75 focus:outline-none"
        />
      </div>
    </form>
    <img
      v-if="loading"
      src="../../../public/loadingAnimation.svg"
      alt=""
      class="loading"
      style="margin-top: 4em;"
    />
    <div v-if="!loading" class="text-center">
      <div class="mt-4">
        <a href="/register">Register?</a>
      </div>
      <!-- <div class="mt-3">
        <a href="/admin-login">Admin?</a>
      </div> -->
    </div>
  </div>
</template>

<script>
import validate from 'validate.js'; // validate user input on login
import axios from 'axios'; // AJAX

const constraints = {
  // user input constraints
  username: {
    presence: true,
    length: {
      maximum: 20,
      message: 'Invalid username / password!',
    },
  },
  password: {
    presence: true,
    length: {
      maximum: 30,
      message: 'Invalid username / password!',
    },
  },
};

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      const body = {
        // input from user
        username: this.username,
        password: this.password,
      };
      const validationError = validate(body, constraints); // validate the body against constraints
      if (validationError) {
        this.errorMessage = 'Username / Password is invalid.'; // if error return according error message
      } else {
        // everything went fine
        this.errorMessage = ''; // clear of all errors
        this.loading = true;
        const API_URL = process.env.VUE_APP_LOGIN;
        try {
          // fetch token
          const tokenData = await axios.post(API_URL, body);
          localStorage.token = tokenData.data.token;
          this.$router.push('/lobbies');
          this.loading = false;
        } catch (error) {
          // failed to fetch token
          this.loading = false;
          this.errorMessage = error.response.data;
        }
      }
    },
  },
};
</script>
