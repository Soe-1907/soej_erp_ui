import type { RouteRecordRaw } from 'vue-router'
import { ROLE_SUPER_ADMIN } from '@/constants/role'

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: 'data-cleanup',
    name: 'DataCleanup',
    component: () => import('@/views/system/DataCleanupView.vue'),
    meta: {
      title: '数据清理',
      roleCodes: [ROLE_SUPER_ADMIN],
      breadcrumb: [
        { title: '系统维护', path: '/data-cleanup' },
        { title: '数据清理' },
      ],
    },
  },
]
