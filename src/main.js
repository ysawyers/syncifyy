import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueWindowSize from 'vue-window-size';

import VueYoutube from 'vue-youtube';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

Vue.use(VueYoutube);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueWindowSize);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
