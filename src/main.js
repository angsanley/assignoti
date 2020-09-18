import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { rtdbPlugin } from 'vuefire'
import { initializeApp } from './plugins/firebase'
import { AuthGuard } from "vue-firebase-auth-plugins"

// setup font faces
import "typeface-inter"
import "typeface-quicksand"

// setup tailwind css
import './assets/css/tailwind.css'
import './assets/css/main.css'
import store from './store'

Vue.config.productionTip = false

const init = async () => {
  const firebase = await initializeApp()

  // firebase analytics and performance
  if (process.env.NODE_ENV !== 'development') {
    const performance = firebase.performance()
    const analytics = firebase.analytics()
    Vue.prototype.$performance = performance
    Vue.prototype.$analytics = analytics
  }

  Vue.prototype.$firebase = firebase

  // setup plugins
  Vue.use(rtdbPlugin)
  Vue.use(AuthGuard, { auth: firebase.auth(), router, options: {postAuthPath: "/", assumeIfUndefined: "public" }});
}

init().then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
