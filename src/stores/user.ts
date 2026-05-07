import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserVO, LoginDto } from '@/type/user'
import { loginApi, getUserInfoApi, logoutApi } from '@/api/product/user'
import { getTokenRoleCode, setToken, removeToken, getToken } from '@/auth'
import { setUserSnapshot, loadUserSnapshot, removeUserSnapshot } from '@/auth/userSnapshot'
import { resetBreadcrumbState } from '@/hooks/Brand/Breadcrumb/useBreadcrumb'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserVO | null>(null)
  const token = ref<string>('')

  /** 刷新后根据快照恢复 userInfo（再拉 GET /user 刷新） */
  const restoreFromSnapshot = () => {
    const snap = loadUserSnapshot()
    const t = getToken()
    if (!snap || !t) return
    const roleCode = getTokenRoleCode(t) ?? snap.roleCode
    userInfo.value = { ...snap, roleCode, token: t } as UserVO
    token.value = t
  }

  // 登录
  const login = async (loginDto: LoginDto) => {
    const res = await loginApi(loginDto)
    if (res.data) {
      const roleCode = getTokenRoleCode(res.data.token) ?? res.data.roleCode
      userInfo.value = { ...res.data, roleCode }
      token.value = res.data.token
      setToken(res.data.token)
      setUserSnapshot(userInfo.value)
      return true
    }
    return false
  }

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const res = await getUserInfoApi()
      if (res.data) {
        const roleCode = getTokenRoleCode(res.data.token) ?? getTokenRoleCode() ?? res.data.roleCode
        const menus = loadUserSnapshot()?.menus
        userInfo.value = { ...res.data, roleCode, menus: menus ?? userInfo.value?.menus }
        setUserSnapshot(userInfo.value)
        return true
      }
      userInfo.value = null
      return false
    } catch (error) {
      userInfo.value = null
      console.error('获取用户信息失败:', error)
      return false
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      // 无论接口是否成功，都清除本地状态
      userInfo.value = null
      token.value = ''
      removeToken()
      removeUserSnapshot()
      resetBreadcrumbState()
    }
  }

  // 清除用户信息（用于 token 失效时）
  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    removeToken()
    removeUserSnapshot()
    resetBreadcrumbState()
  }

  return {
    userInfo,
    token,
    login,
    restoreFromSnapshot,
    getUserInfo,
    logout,
    clearUserInfo,
  }
})

