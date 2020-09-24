import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER: (state, newValue) => {
      state.user = newValue
    },
  },
  actions: {
    getAuthenticatedUser: ({commit}) => {
      return new Promise((resolve) => {
        const user = firebase.auth().currentUser
        commit('SET_USER', user)
        resolve(user)
      })
    }
  },
  modules: {
  }
})
