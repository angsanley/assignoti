import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { rtdbPlugin } from 'vuefire'

// setup font faces
import "typeface-inter"
import "typeface-quicksand"

// setup tailwind css
import './assets/css/tailwind.css'
import './assets/css/main.css'

// setup plugins
Vue.use(rtdbPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
