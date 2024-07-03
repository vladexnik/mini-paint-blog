import { type Ref } from 'vue'

export interface IUseLoader {
  isLoading: Ref<boolean>
  showLoader: () => void
  hideLoader: () => void
}

export interface IDataObj {
  date: Date
  src: string
  timestamp: number
  userEmail: string
}
