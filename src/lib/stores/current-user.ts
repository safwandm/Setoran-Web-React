import { create } from 'zustand'
import { Pengguna } from '../api-client'

interface currentUserState {
  currentUser?: Pengguna
  set: (user: Pengguna) => void
}

export const useCurrentUserStore = create<currentUserState>((set) => ({
  currentUser: undefined,
  set: (user: Pengguna) => set(() => ({ currentUser: user }))
}))
