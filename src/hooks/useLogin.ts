import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { LoginDto } from '@/type/user'

/**
 * 登录 Hook
 */
export function useLogin() {
  const router = useRouter()
  const userStore = useUserStore()
  const loading = ref(false)

  /**
   * 执行登录
   */
  const handleLogin = async (loginDto: LoginDto) => {
    loading.value = true
    try {
      const success = await userStore.login(loginDto)

      if (success) {
        ElMessage.success('登录成功')
        router.push('/')
        return true
      }
      ElMessage.error('登录失败，请稍后重试')
      return false
    } catch (error: unknown) {
      const msg =
        error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string'
          ? (error as { message: string }).message
          : '登录失败，请稍后重试'
      ElMessage.error(msg)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 退出登录
   */
  const handleLogout = async () => {
    try {
      await userStore.logout()
      ElMessage.success('退出登录成功')
      router.push('/login')
    } catch (error: any) {
      ElMessage.error(error.message || '退出登录失败')
    }
  }

  return {
    loading,
    handleLogin,
    handleLogout,
  }
}

