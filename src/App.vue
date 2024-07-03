<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter, useRoute } from 'vue-router'
import { useThemeStore } from './stores/theme'

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  useThemeStore().loadTheme()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user === null) {
      router.replace('/login')
    } else if (route.path == '/login' || route.path == '/signup') {
      router.replace('/')
    }
  })
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
