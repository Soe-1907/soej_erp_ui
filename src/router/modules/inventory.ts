import type { RouteRecordRaw } from 'vue-router'
import { ROLE_WAREHOUSE_MANAGER, ROLE_WAREHOUSE_SPECIALIST } from '@/constants/role'

/**
 * 库存管理
 */
export const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: 'inventory-transfer',
    name: 'InventoryTransfer',
    component: () => import('@/views/inventoryManager/inventoryTransferView.vue'),
    meta: {
      title: '库存调拨',
      roleCodes: [ROLE_WAREHOUSE_MANAGER],
      breadcrumb: [
        { title: '库存管理', path: '/inventory-transfer' },
        { title: '库存调拨' },
      ],
    },
  },
  {
    path: 'inventory-distribution',
    name: 'InventoryDistribution',
    component: () => import('@/views/inventoryManager/inventoryDistributionView.vue'),
    meta: {
      title: '库存分布',
      roleCodes: [ROLE_WAREHOUSE_MANAGER],
      breadcrumb: [
        { title: '库存管理', path: '/inventory-distribution' },
        { title: '库存分布' },
      ],
    },
  },
  {
    path: 'inventory-verification',
    name: 'InventoryVerification',
    component: () => import('@/views/inventoryManager/inventoryVerificationView.vue'),
    meta: {
      title: '出库审核',
      roleCodes: [ROLE_WAREHOUSE_MANAGER, ROLE_WAREHOUSE_SPECIALIST],
      breadcrumb: [
        { title: '库存管理', path: '/inventory-verification' },
        { title: '出库审核' },
      ],
    },
  },
  {
    path: 'inventory-audit',
    name: 'InventoryAudit',
    component: () => import('@/views/inventoryManager/inventoryAuditView.vue'),
    meta: {
      title: '入库审核',
      roleCodes: [ROLE_WAREHOUSE_MANAGER, ROLE_WAREHOUSE_SPECIALIST],
      breadcrumb: [
        { title: '库存管理', path: '/inventory-audit' },
        { title: '入库审核' },
      ],
    },
  },
]
