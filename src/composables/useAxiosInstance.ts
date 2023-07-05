import axios from 'axios'
import { BASE_URL } from './fetch'
import { userStore } from '~/store/user'

export const useAxiosInstance = () => {
  const auth = userStore()
  return computed(() => axios.create({
    baseURL: BASE_URL,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    },
  }),
  )
}