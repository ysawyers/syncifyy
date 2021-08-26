<template>
  <div class="Register">
    <div class="text-center text-4xl mt-5">Register</div>
    <form v-if="!loading" @submit.prevent="register()" class="text-center">
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
      <div style="margin-top: 3em;">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          autocomplete="off"
          class="border-b focus:outline-none"
          style="width: 18%; font-size: 18px;"
        />
      </div>
      <div style="margin-top: 3em;">
        <input
          v-model="c_password"
          type="password"
          placeholder="Confirm Password"
          autocomplete="off"
          class="border-b focus:outline-none"
          style="width: 18%; font-size: 18px;"
        />
      </div>
      <p class="text-red-600 mt-3">
        {{ errorMessage }}
      </p>
      <input
        type="submit"
        value="Create!"
        class="mt-5 p-2 pl-3 pr-3 rounded hover:opacity-75 focus:outline-none"
      />
    </form>
    <img
      v-if="loading"
      src="../../../public/loadingAnimation.svg"
      alt=""
      class="loading"
      style="margin-top: 4em;"
    />
    <div v-if="!loading" class="text-center mt-4">
      <a href="/">Login?</a>
    </div>
  </div>
</template>

<script>
const validate = require('validate.js');
const axios = require('axios');

const constraints = {
  username: {
    presence: true,
    length: {
      maximum: 20,
      message: 'must be less than 20 characters!',
    },
  },
  password: {
    presence: true,
    length: {
      maximum: 30,
      message: 'must be less than 30 characters!',
    },
  },
};

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      c_password: '',
      errorMessage: '',
      loading: false,
    };
  },
  methods: {
    async register() {
      if (this.password == this.c_password) {
        // if both passwords are equal
        const body = {
          // take in the username and password
          username: this.username,
          password: this.password,
        };
        const validationError = validate(body, constraints); // validate the body
        if (validationError) {
          // if it failed
          if (validationError.username) {
            this.errorMessage = validationError.username[0]; // error for invalid username
          } else if (validationError.password) {
            this.errorMessage = validationError.password[0]; // error for invalid password
          }
        } else {
          this.errorMessage = ''; // error message
          this.loading = true;
          try {
            const API_URL = process.env.VUE_APP_REGISTER;
            await axios.post(API_URL, body); // fetch
            this.errorMessage = '';
            this.$router.push('/');
            this.loading = false;
          } catch (error) {
            // if something went wrong
            this.loading = false;
            this.errorMessage = error.response.data; // display error message
          }
        }
      } else {
        // if passwords didn't match
        this.errorMessage = 'Passwords do not match!';
      }
    },
  },
};
</script>
