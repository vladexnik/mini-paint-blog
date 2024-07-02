import { defineStore } from 'pinia'
import { auth } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
  // onAuthStateChanged
} from 'firebase/auth'
import router from '../router'
import { showErrorMessageSignIn } from '../utils/errMessages'

export const useUserStore = defineStore('user', {
  state: (): { user: any; isLoggedIn: boolean } => ({
    user: null,
    isLoggedIn: false
  }),

  actions: {
    async signUp(email: string, password: string) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        this.isLoggedIn = true
        router.push({ path: '/' })
      } catch (error) {
        showErrorMessageSignIn(error)
        console.log(error)
      }
    },

    async login(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        this.isLoggedIn = true
        router.push({ path: '/' })
      } catch (error) {
        showErrorMessageSignIn(error)
        console.log(error)
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
        this.isLoggedIn = false
      } catch (error) {
        console.error(error)
      }
    },

    init() {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          this.user = currentUser
          this.isLoggedIn = true
        } else {
          this.user = null
          this.isLoggedIn = false
        }
      })
    }
  }
})
