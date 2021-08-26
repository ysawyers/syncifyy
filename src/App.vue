<template>
  <div id="app">
    <head>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
    </head>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="danger">
        <b-navbar-brand href="/" style="font-family: 'Roboto', sans-serif; font-size: 20px;">
          <div class="flex items-center">
            <img src="../public/logo.png" alt="" width="40" height="40" />
            <p class="text-2xl ml-2">Syncifyy</p>
          </div>
        </b-navbar-brand>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'App',
};
</script>

<style>
@import './css/tailwind.css';

* {
  margin: 0px;
  padding: 0px;
}

html,
body {
  height: 100%;
}

.loading {
  width: 5em;
  margin: 0 auto;
}
</style>
