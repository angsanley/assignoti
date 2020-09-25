import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from "firebase";

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
        },
        doSocialSignIn: ({commit}, using) => {
            return new Promise(((resolve, reject) => {
                let provider

                if (using === 'google') provider = new firebase.auth.GoogleAuthProvider()
                if (using === 'github') provider = new firebase.auth.GithubAuthProvider()

                firebase.auth().signInWithPopup(provider).then((result) => {
                    commit('SET_USER', result.user)
                    resolve(result.user)

                }).catch(e => {
                    console.log(e.message)
                    reject(e)
                })
            }))
        }
    },
    modules: {}
})
