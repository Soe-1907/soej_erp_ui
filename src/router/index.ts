import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/auth'
import { hasRoleIn } from '@/constants/role'
import { landingPathForUser } from '@/utils/menu'
import { baseInfoRoutes } from '@/router/modules/baseInfo'
import { inventoryRoutes } from '@/router/modules/inventory'
import { purchaseRoutes } from '@/router/modules/purchase'
import { salesRoutes } from '@/router/modules/sales'
import { settlementRoutes } from '@/router/modules/settlement'
import { userRoutes } from '@/router/modules/user'
import { systemRoutes } from '@/router/modules/system'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoginView from '@/views/productInfo/login/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        ...baseInfoRoutes,
        ...inventoryRoutes,
        ...purchaseRoutes,
        ...salesRoutes,
        ...settlementRoutes,
        ...userRoutes,
        ...systemRoutes,
      ],
    },
  ],
})

/** 从子到父取首个配置了 roleCodes 的节点 */
function getRequiredRoleCodes(to: RouteLocationNormalized): number[] | undefined {
  for (let i = to.matched.length - 1; i >= 0; i--) {
    const record = to.matched[i]
    if (!record) {
      continue
    }
    const codes = record.meta.roleCodes
    if (Array.isArray(codes) && codes.length > 0) {
      return codes
    }
  }
  return undefined
}

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = getToken()
  const isLoggedIn = !!token || !!userStore.userInfo

  if (to.path === '/login') {
    if (isLoggedIn) {
      next(landingPathForUser(userStore.userInfo))
    } else {
      next()
    }
    return
  }

  if (!isLoggedIn) {
    ElMessage.warning('请先登录')
    next('/login')
    return
  }

  if (!userStore.userInfo && token) {
    userStore.restoreFromSnapshot()
    try {
      const ok = await userStore.getUserInfo()
      if (!ok) {
        userStore.clearUserInfo()
        next('/login')
        return
      }
    } catch {
      userStore.clearUserInfo()
      next('/login')
      return
    }
  }

  if (to.path === '/') {
    next(landingPathForUser(userStore.userInfo))
    return
  }

  const required = getRequiredRoleCodes(to)
  if (required) {
    const roleCode = userStore.userInfo?.roleCode
    if (!hasRoleIn(roleCode, required)) {
      ElMessage.warning('无访问权限')
      next(landingPathForUser(userStore.userInfo))
      return
    }
  }

  next()
})

export default router
