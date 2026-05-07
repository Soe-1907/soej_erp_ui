import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/auth'
import { resetBreadcrumbState } from '@/hooks/Brand/Breadcrumb/useBreadcrumb'

//创建axios实例对象
const request = axios.create({
  baseURL: '/api',
  timeout: 600000
})

const MESSAGE_DEDUPE_WINDOW = 1200
const lastMessageMap = new Map<string, number>()
let redirectingToLogin = false

const shouldShowMessage = (key: string) => {
  const now = Date.now()
  const last = lastMessageMap.get(key) || 0
  if (now - last < MESSAGE_DEDUPE_WINDOW) {
    return false
  }
  lastMessageMap.set(key, now)
  return true
}

const showErrorOnce = (message: string) => {
  const text = message || '请求失败'
  if (shouldShowMessage(`error:${text}`)) {
    ElMessage.error(text)
  }
}

const isApiResponse = (data: unknown): data is { code: string | number; message?: string } => {
  return !!data && typeof data === 'object' && 'code' in data
}

const redirectToLoginOnce = () => {
  if (redirectingToLogin) {
    return
  }
  redirectingToLogin = true
  removeToken()
  resetBreadcrumbState()
  window.location.href = '/login'
}

// axios的请求拦截器 - 添加 token
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    const responseData = response.data
    if (isApiResponse(responseData) && String(responseData.code) !== '200') {
      showErrorOnce(responseData.message || '请求失败')
      return Promise.reject(responseData)
    }
    return responseData
  },
  (error) => { //失败回调
    const status = error.response?.status
    const responseMessage = error.response?.data?.message

    if (status === 401) {
      showErrorOnce('登录已过期，请重新登录')
      redirectToLoginOnce()
    } else if (status === 403) {
      showErrorOnce(responseMessage || '无访问权限')
    } else {
      showErrorOnce(responseMessage || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request