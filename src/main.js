import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'

// setup font faces
import "typeface-inter"
import "typeface-quicksand"

// setup tailwind css
import './assets/css/tailwind.css'
import './assets/css/main.css'
import router from './router'

// setup plugins
Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
