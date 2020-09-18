import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'

// setup tailwind css
import './assets/css/tailwind.css'
import './assets/css/main.css'

// setup font faces
require("typeface-inter");
require("typeface-quicksand");

// setup plugins
Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
