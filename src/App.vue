<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    console.log(user)
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
