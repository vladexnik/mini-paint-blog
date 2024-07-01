import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouterPlugin } from './plugins/router'
import App from './App.vue'
import router from './router/index'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useUserStore } from '@/stores/user'
const app = createApp(App)

createPinia().use(createRouterPlugin(router))

app.use(createPinia())
useUserStore().init()
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 2000,
  position: 'top-right'
} as ToastContainerOptions)
app.mount('#app')
