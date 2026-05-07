import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: 'user',
    name: 'UserCentre',
    component: () => import('@/views/user/UserCentreView.vue'),
    meta: {
      title: '个人中心',
      breadcrumb: [{ title: '个人中心' }],
    },
  },
]
