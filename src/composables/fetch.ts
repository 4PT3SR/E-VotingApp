import { createFetch } from '@vueuse/core'
import { userStore } from '~/store/user'

export const BASE_URL = import.meta.env.VITE_BASE_URL

export const useBaseFetch = createFetch({
  baseUrl: BASE_URL,
  options: {
    // beforeFetch in pre-configured instance will only run when the newly spawned instance do not pass beforeFetch
    async beforeFetch({ options }) {
      const user = userStore()
      const myToken = user.token
      options.headers!.Authorization = `Bearer ${myToken}`
      return { options }
    },
  },
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
})