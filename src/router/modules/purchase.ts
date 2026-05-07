import type { RouteRecordRaw } from 'vue-router'
import {
  ROLE_PURCHASE_MANAGER,
  ROLE_PURCHASE_SPECIALIST,
} from '@/constants/role'

/**
 * 采购管理
 */
export const purchaseRoutes: RouteRecordRaw[] = [
  {
    path: 'purchase-receive',
    name: 'PurchaseReceive',
    component: () => import('@/views/purchase/purchaseReceiveView.vue'),
    meta: {
      title: '采购入库',
      roleCodes: [ROLE_PURCHASE_MANAGER, ROLE_PURCHASE_SPECIALIST],
      breadcrumb: [
        { title: '采购管理', path: '/purchase-receive' },
        { title: '采购入库' },
      ],
    },
  },
  {
    path: 'purchase-return',
    name: 'PurchaseReturn',
    component: () => import('@/views/purchase/purchaseReturnView.vue'),
    meta: {
      title: '采购退货',
      roleCodes: [ROLE_PURCHASE_MANAGER, ROLE_PURCHASE_SPECIALIST],
      breadcrumb: [
        { title: '采购管理', path: '/purchase-return' },
        { title: '采购退货' },
      ],
    },
  },
]
