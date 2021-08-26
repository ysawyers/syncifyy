import Vue from 'vue';
import VueRouter from 'vue-router';

import Register from '../views/auth/Register.vue';
import Login from '../views/auth/Login.vue';
import Admin from '../views/auth/Admin.vue';

import AdminDashboard from '../views/admin/AdminDashboard.vue';
import AdminDashboardLobbies from '../views/admin/AdminDashboardLobbies.vue';

import Lobbies from '../views/lobbies/Lobbies.vue';
import Lobby from '../views/lobby/MainLobbyView.vue';

import ReportIssue from '../views/ReportIssue.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/register',
    name: 'Home',
    component: Register,
    beforeEnter: (to, from, next) => {
      if (localStorage.token) {
        next('/lobbies');
      } else {
        next();
      }
    },
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.token) {
        next('/lobbies');
      } else {
        next();
      }
    },
  },
  {
    path: '/lobbies',
    name: 'Lobby',
    component: Lobbies,
    beforeEnter: (to, from, next) => {
      if (localStorage.token) {
        next();
      } else {
        next('/');
      }
    },
  },
  {
    path: '/report-issue',
    name: 'ReportIssue',
    component: ReportIssue,
    beforeEnter: (to, from, next) => {
      if (localStorage.token) {
        next();
      } else {
        next('/');
      }
    },
  },
  {
    path: '/lobbies/:uuid',
    name: 'MainLobbyView',
    component: Lobby,
    beforeEnter: (to, from, next) => {
      if (localStorage.token) {
        next();
      } else {
        next('/login');
      }
    },
  },
  // {
  //   path: '/admin-login',
  //   name: 'Admin',
  //   component: Admin,
  //   beforeEnter: (to, from, next) => {
  //     if (localStorage.token == process.env.VUE_APP_ADMIN_TOKEN) {
  //       next('/admin-dashboard');
  //     } else {
  //       next();
  //     }
  //   },
  // },
  // {
  //   path: '/admin-dashboard',
  //   name: 'AdminDashboard',
  //   component: AdminDashboard,
  //   beforeEnter: (to, from, next) => {
  //     if (localStorage.token == process.env.VUE_APP_ADMIN_TOKEN) {
  //       next();
  //     } else {
  //       next('/admin-login');
  //     }
  //   },
  // },
  // {
  //   path: '/admin-dashboard/manage-lobbies',
  //   name: 'AdminDashboardLobbies',
  //   component: AdminDashboardLobbies,
  //   beforeEnter: (to, from, next) => {
  //     if (localStorage.token == process.env.VUE_APP_ADMIN_TOKEN) {
  //       next();
  //     } else {
  //       next('/admin-login');
  //     }
  //   },
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
