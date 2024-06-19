import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/views/HomeView.vue'
import LogIn from '../components/auth/LogIn.vue'
import SignUp from '../components/auth/SignUp.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../components/views/AboutView.vue')
    },
    { path: '/login', name: 'LogIn', component: LogIn },
    { path: '/signup', name: 'SignUp', component: SignUp }
  ]
})

export default router
