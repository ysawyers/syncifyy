<template>
  <div>
    <h1 class="text-center text-4xl mt-5">Admin Login</h1>
    <form v-if="!loading" @submit.prevent="adminLogin()" class="text-center">
      <div class="mt-5">
        <input
          v-model="username"
          type="text"
          class="border-b focus:outline-none"
          style="width: 18%; font-size: 18px;"
          placeholder="Username"
        /><br />
      </div>
      <div class="mt-5">
        <input
          v-model="password"
          type="password"
          class="border-b focus:outline-none"
          style="width: 18%; font-size: 18px;"
          placeholder="Password"
        /><br />
      </div>
      <p class="text-red-600 mt-3">
        {{ errorMessage }}
      </p>
      <input
        type="submit"
        value="Login"
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
      <a href="/">User Login?</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      errorMessage: '',
      username: '',
      password: '',
      loading: false,
    };
  },
  methods: {
    adminLogin() {
      this.loading = true;
      if (this.username == process.env.VUE_APP_ADMIN_USERNAME) {
        // if username == to admin username
        if (this.password == process.env.VUE_APP_ADMIN_PASSWORD) {
          // if password == to admin password
          localStorage.token = process.env.VUE_APP_ADMIN_TOKEN; // assign the admin token
          this.$router.push('/admin-dashboard'); // push to admin dashboard
          this.loading = false;
        } else {
          this.loading = false;
          this.errorMessage = 'Username / Password is invalid.'; // wrong credentials
        }
      } else {
        this.loading = false;
        this.errorMessage = 'Username / Password is invalid.'; // wrong credentials
      }
    },
  },
};
</script>
