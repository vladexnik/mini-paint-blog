<template>
  <header class="header">
    <h3 class="header__title">Welcome to mini-paint, {{ userEmail || '...' }}!</h3>
    <nav class="header__btns">
      <label class="toggle">
        <input
          class="toggle__checkbox"
          type="checkbox"
          v-model="isChecked"
          @change="handleToggle"
        />
        <div class="toggle__switch"></div>
        <span class="toggle__label"></span>
      </label>
      <button class="header__btn paint" @click="$router.push('/paint')">Go to Paint</button>
      <button class="header__btn" @click="Logout">{{ 'Logout' }}</button>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import { auth } from '../../firebase/config'
import { useThemeStore } from '../../stores/theme'
import type { User } from 'firebase/auth'

const router = useRouter()
const userStore = useUserStore()
const userEmail = ref<string | null>(null)
const isChecked = ref<boolean>(false)
const themeStore = useThemeStore()

const handleToggle = () => {
  themeStore.toggleTheme()
}

const Logout = (): void => {
  userStore.logout()
  router.push('/')
}

watch(
  () => themeStore.isDarkTheme,
  (newVal) => {
    isChecked.value = newVal
  }
)

onMounted(() => {
  isChecked.value = themeStore.isDarkTheme
  auth.onAuthStateChanged((user: User | null) => {
    if (user) {
      userEmail.value = user?.email
    }
  })
})
</script>

<style>
.header {
  background: var(--background-color);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 120px;
  z-index: 1;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
  align-items: center;
  margin-bottom: 50px;
}

.header__title {
  color: var(--dark-color);
}

.header__btn {
  padding: 8px 14px;
  font-size: 18px;
  font-weight: 600;
  background-color: var(--primary-color);
  color: var(--background-color);
  border-radius: 30px;
  border: 0;
  white-space: nowrap;
}

.paint {
  background-color: var(--secondary-color);
}

.header__btns {
  display: flex;
  align-items: center;
  gap: 25px;
}

.header__btn:hover {
  font-size: 18px;
  opacity: 0.7;
}

.toggle {
  cursor: pointer;
  display: inline-block;
}

.toggle__switch {
  display: inline-block;
  background: var(--color);
  border: 1px solid var(--color);
  border-radius: 16px;
  width: 58px;
  height: 32px;
  position: relative;
  vertical-align: middle;
  transition: background 0.25s;
}

.toggle__switch:before,
.toggle__switch:after {
  content: '';
}

.toggle__switch:before {
  display: block;
  background: linear-gradient(
    to bottom,
    var(--background-color) 100%,
    var(--primary-color-shade) 100%
  );
  border-radius: 50%;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 3px;
  left: 4px;
  transition: left 0.25s;
}

.toggle:hover .toggle__switch:before {
  background: linear-gradient(
    to bottom,
    var(--background-color) 0%,
    var(--primary-color-shade) 100%
  );
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
}

.toggle__checkbox:checked + .toggle__switch {
  background: var(--color);
}

.toggle__checkbox:checked + .toggle__switch:before {
  left: 30px;
}

.toggle__checkbox {
  position: absolute;
  visibility: hidden;
}

.toggle__label {
  margin-left: 5px;
  position: relative;
  top: 2px;
}

@media (max-width: 550px) {
  .header {
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
  }

  .header__btns {
    gap: 10px;
  }
}
</style>
