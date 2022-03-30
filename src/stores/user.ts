import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let token = $(ref(''))
  function setToken(name: string) {
    token = name
  }

  return {
    token,
    setToken,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
