import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/views/HomePage.vue'
import LogIn from '../components/auth/LogIn.vue'
import SignUp from '../components/auth/SignUp.vue'
import PaintPage from '../components/views/PaintPage.vue'
import AboutPage from '../components/views/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/paint',
      name: 'paint',
      component: PaintPage
      // meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },
    { path: '/login', name: 'LogIn', component: LogIn },
    { path: '/signup', name: 'SignUp', component: SignUp }
  ]
})

export default router
