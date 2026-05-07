import type { RouteRecordRaw } from 'vue-router'
import { ROLE_SALES_MANAGER, ROLE_SALES_SPECIALIST } from '@/constants/role'

/**
 * 销售管理
 */
export const salesRoutes: RouteRecordRaw[] = [
  {
    path: 'sales-outbound',
    name: 'SalesOutbound',
    component: () => import('@/views/salesManagement/salesOutboundView.vue'),
    meta: {
      title: '销售出库',
      roleCodes: [ROLE_SALES_MANAGER, ROLE_SALES_SPECIALIST],
      breadcrumb: [
        { title: '销售管理', path: '/sales-outbound' },
        { title: '销售出库' },
      ],
    },
  },
  {
    path: 'sales-return',
    name: 'SalesReturn',
    component: () => import('@/views/salesManagement/salesReturnView.vue'),
    meta: {
      title: '销售退货',
      roleCodes: [ROLE_SALES_MANAGER, ROLE_SALES_SPECIALIST],
      breadcrumb: [
        { title: '销售管理', path: '/sales-return' },
        { title: '销售退货' },
      ],
    },
  },
]
