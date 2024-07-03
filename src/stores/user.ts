import { defineStore } from 'pinia'
import { auth } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import router from '../router'
import { showErrorMessageSignIn } from '../utils/errMessages'
import type { User } from 'firebase/auth'

export const useUserStore = defineStore('user', {
  state: (): { user: User | null; isLoggedIn: boolean } => ({
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
        console.error(error)
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
        console.error(error)
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
        this.isLoggedIn = false
      } catch (error) {
        showErrorMessageSignIn(error)
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
