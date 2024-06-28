import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkTheme = ref<boolean>(false)

  const loadTheme = () => {
    const storedTheme = localStorage.getItem('isDarkTheme')
    if (storedTheme !== null) {
      isDarkTheme.value = JSON.parse(storedTheme)
      document.body.classList.toggle('dark-theme', isDarkTheme.value)
    }
  }

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    document.body.classList.toggle('dark-theme', isDarkTheme.value)
    localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme.value))
  }

  return {
    isDarkTheme,
    toggleTheme,
    loadTheme
  }
})
