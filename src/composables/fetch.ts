import { createFetch } from '@vueuse/core'
import { userStore } from '~/store/user'

export const BASE_URL = import.meta.env.VITE_BASE_URL

export const useBaseFetch = createFetch({
  baseUrl: BASE_URL,
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
})