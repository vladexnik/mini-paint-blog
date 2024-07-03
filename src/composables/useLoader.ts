import { ref } from 'vue'
import type { IUseLoader } from '@/models/models'

export function useLoader(): IUseLoader {
  const isLoading = ref<boolean>(false)

  function showLoader(): void {
    isLoading.value = true
  }

  function hideLoader(): void {
    isLoading.value = false
  }

  return {
    isLoading,
    showLoader,
    hideLoader
  }
}
