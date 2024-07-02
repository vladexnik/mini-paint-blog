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

export interface IDataObjWithNullEmail {
  date: Date
  src: string
  timestamp: number
  userEmail: string | null
}

// export interface IDataObjNull extends IDataObj {
//   userEmail: string | null
// }

export interface IStsTokenManager {
  refreshToken: string
  accessToken: string
  expirationTime: number
}

export interface IProviderData {
  providerId: string
  uid: string
  displayName?: any
  email: string
  phoneNumber?: any
  photoURL?: any
}
