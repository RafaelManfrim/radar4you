import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import { env } from '@/env'

export interface AxiosErrorResponse {
  code?: string
  message?: string
  detail?: string
}

interface FailedRequest {
  onSuccess: (access: string) => void
  onFailure: (err: AxiosError<AxiosErrorResponse>) => void
}

let access = Cookies.get('the-brocks.access')
let refresh = Cookies.get('the-brocks.refresh')

let isRefreshing = false

let failedRequestsQueue: FailedRequest[] = []

export const api = axios.create({
  baseURL: env.VITE_BASE_URL,
})

if (access) {
  api.defaults.headers.common.Authorization = `Bearer ${access}`
} else {
  delete api.defaults.headers.common.Authorization
}

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<AxiosErrorResponse>) => {
    if (error?.response?.status === 401) {
      refresh = Cookies.get('the-brocks.refresh')
      const originalConfig = error.config
      if (!isRefreshing) {
        isRefreshing = true
        api
          .patch('/token/refresh', {
            refresh,
          })
          .then((response) => {
            access = response.data.access

            Cookies.set('the-brocks.access', access!, {
              expires: 1 / 24 / 2, // 30 minutes
              path: '/calculadora',
            })

            Cookies.set('the-brocks.refresh', response.data.refresh, {
              expires: 7, // 7 days
              path: '/calculadora',
            })

            api.defaults.headers.common.Authorization = `Bearer ${access}`
            failedRequestsQueue.forEach((request) => request.onSuccess(access!))
            failedRequestsQueue = []
          })
          .catch((err) => {
            failedRequestsQueue.forEach((request) => request.onFailure(err))
            failedRequestsQueue = []
            Cookies.remove('the-brocks.access')
            Cookies.remove('the-brocks.refresh')
            window.location.href = '/login'
          })
          .finally(() => {
            isRefreshing = false
          })
      }
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (access: string) => {
            originalConfig!.headers!.Authorization = `Bearer ${access}`
            resolve(api(originalConfig!))
          },
          onFailure: (err: AxiosError<AxiosErrorResponse>) => {
            reject(err)
          },
        })
      })
    } else {
      Cookies.remove('the-brocks.access')
      Cookies.remove('the-brocks.refresh')
      window.location.href = '/login'
      return Promise.reject(new Error())
    }
  },
)
