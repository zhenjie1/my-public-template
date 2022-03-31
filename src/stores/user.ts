import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let token = $(ref(''))
  function setToken(name: string) {
    token = name
  }

  let info = $(ref<string>(''))
  function saveInfo(data: string) {
    info = data
  }

  return {
    token,
    setToken,
    info,
    saveInfo,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
