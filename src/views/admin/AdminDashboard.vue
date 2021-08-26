<template>
  <div>
    <div style="width: fit-content;">
      <div style="text-align: center; margin-top: 10px;">
        <h1>Admin Dashboard</h1>

        <h2>Manage Users</h2>
        <li
          v-for="user in users"
          :key="user.id"
          style="font-size: 18px; margin-top: 10px;"
        >
          {{ user.username }}
          <button @click="passwordForm(user.id)">
            change password
          </button>
          <button
            @click="adminDeleteAccount(user.id)"
            style="margin-left: 10px;"
          >
            delete account
          </button>
        </li>
      </div>
      <button @click="redirect()">
        Manage Lobbies
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

      <form
        v-if="showPasswordForm"
        @submit.prevent="adminChangePassword()"
        style="margin-top: 10px;"
      >
        <h2>{{ currentUsername }}</h2>
        <input
          v-model="newPassword"
          :type="showing"
          placeholder="New Password"
          style="margin-bottom: 10px; margin-top: 10px;"
        /><br />
        <input type="submit" value="Confirm" />
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
        <button type="button" @click="reset()" style="margin-left: 10px;">
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
const axios = require('axios');
const validate = require('validate.js');

import { mapGetters, mapActions } from 'vuex';

const constraints = {
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters!',
    },
  },
};

export default {
  name: 'AdminDashboard',
  data() {
    return {
      users: [],
      currentUserId: '',
      currentUsername: '',
      showPasswordForm: false,
      showing: 'password',
      newPassword: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters(['allUsersAdmin']), // getters from vuex (all users)
  },
  created() {
    // calling function to send AJAX request and fetch data
    this.fetchUsersAdmin().then(() => {
      this.users = this.allUsersAdmin;
    });
  },
  methods: {
    ...mapActions(['fetchUsersAdmin']), // actions from vuex (fetches data)
    passwordForm(user_id) {
      // when editing password display the user that is recieving changes
      // user_id is the id of the user being edited
      this.currentUserId = user_id;
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].id == this.currentUserId) {
          this.currentUsername = this.users[i].username;
        }
      }
      this.successMessage = '';
      this.errorMessage = '';
      this.newPassword = '';
      this.showPasswordForm = true;
    },
    reset() {
      // cancel button to close out of any forms or clear error messages
      this.showPasswordForm = false;
      this.errorMessage = '';
      this.successMessage = '';
      this.newPassword = '';
    },
    redirect() {
      // push router to other panel (manage lobbies)
      this.$router.push('/admin-dashboard/manage-lobbies');
    },
    adminLogout() {
      // log out of admin
      localStorage.token = '';
      this.$router.push('/');
    },
    async adminRefresh() {
      // refresh data to see any new updates
      await this.fetchUsersAdmin();
      this.users = this.allUsersAdmin;
    },
    async adminChangePassword() {
      const validationError = validate(
        // validating new password against constraints
        { password: this.newPassword },
        constraints
      );
      if (validationError) {
        // if it was an invalid password display error
        this.errorMessage = validationError.password[0];
      } else {
        // the password was valid
        this.errorMessage = '';
        try {
          // send AJAX request to edit in database
          const API_URL = process.env.VUE_APP_CHANGE_PASSWORD;
          const body = {
            userId: this.currentUserId,
            newPassword: this.newPassword,
          };
          const message = await axios.put(API_URL, body, {
            headers: {
              authorization: localStorage.token,
            },
          });
          this.successMessage = message.data;
        } catch (error) {
          // if something went wrong display error
          this.errorMessage = error.response.data;
        }
      }
    },
    async adminDeleteAccount(user_id) {
      // for the current user ID delete account
      try {
        const API_URL = process.env.VUE_APP_REMOVE_USER;
        const message = await axios.delete(API_URL, {
          headers: { Authorization: localStorage.token },
          data: { userId: user_id },
        });
        this.successMessage = message.data;
      } catch (error) {
        // if something went wrong display error
        this.errorMessage = error.response.data;
      }
    },
  },
};
</script>
