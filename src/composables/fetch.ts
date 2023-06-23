import { createFetch } from '@vueuse/core'

export const BASE_URL = import.meta.env.VITE_BASE_URL

export const useBaseFetch = createFetch({
  baseUrl: BASE_URL,
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
})