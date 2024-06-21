<script setup lang="ts">
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const Logout = (): void => {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <main>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/paint">Paint</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/signup">Signup</RouterLink>
        </nav>
      </div>
    </header>
    <button @click="Logout()">logout</button>
    <h1>Home Page with info how i cool</h1>
  </main>
</template>
