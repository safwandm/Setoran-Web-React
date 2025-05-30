import { create } from 'zustand'
import { Pengguna } from '../api-client'
import ApiService from '../api-client/wrapper'

interface currentUserState {
  currentUser?: Pengguna
  set: (user: Pengguna) => void
  refresh: () => void
}

export const useCurrentUserStore = create<currentUserState>((set) => ({
  currentUser: undefined,
  set: (user: Pengguna) => set(() => ({ currentUser: user })),
  refresh: () => ApiService.getInstance().penggunaApi.penggunaCurrentPenggunaGet().then(res => set(() => ({ currentUser: res })))
}))
