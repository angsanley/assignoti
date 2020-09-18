import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/functions'
import 'firebase/storage'
import 'firebase/analytics'
import 'firebase/performance'

export const initializeApp = () => {
    return new Promise ((resolve, reject) => {
        axios.get('/__/firebase/init.json').then(response => {
            firebase.initializeApp(response.data)
            resolve(firebase)
        }).catch(e => {
            reject(e)
        });
    })
}
