import { type Ref } from 'vue'

export interface IUser {
  uid: string
  email: string
  emailVerified: boolean
  isAnonymous: boolean
  providerData: IProviderData
  stsTokenManager: IStsTokenManager
  createdAt: string
  lastLoginAt: string
  apiKey: string
  appName: string
}

export interface IUseLoader {
  isLoading: Ref<boolean>
  showLoader: () => void
  hideLoader: () => void
}

export type DataObjT = {
  name: string
  timestamp: number
  url: string
}

export type DataObjT2 = {
  date: Date
  src: string
  timestamp: number
  userEmail: string
}

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
