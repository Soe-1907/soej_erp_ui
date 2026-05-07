import type { RouteRecordRaw } from 'vue-router'
import {
  ROLE_ADMIN,
  ROLE_SETTLEMENT_MANAGER,
  ROLE_SETTLEMENT_SPECIALIST,
} from '@/constants/role'

/**
 * 结算管理
 */
export const settlementRoutes: RouteRecordRaw[] = [
  {
    path: 'income-settlement',
    name: 'IncomeSettlement',
    component: () => import('@/views/settleManagement/incomeSettlementView.vue'),
    meta: {
      title: '收入结算',
      roleCodes: [ROLE_ADMIN, ROLE_SETTLEMENT_MANAGER, ROLE_SETTLEMENT_SPECIALIST],
      breadcrumb: [
        { title: '结算管理', path: '/income-settlement' },
        { title: '收入结算' },
      ],
    },
  },
  {
    path: 'expenditure-settlement',
    name: 'ExpenditureSettlement',
    component: () => import('@/views/settleManagement/expenditureSettlementView.vue'),
    meta: {
      title: '支出结算',
      roleCodes: [ROLE_ADMIN, ROLE_SETTLEMENT_MANAGER, ROLE_SETTLEMENT_SPECIALIST],
      breadcrumb: [
        { title: '结算管理', path: '/expenditure-settlement' },
        { title: '支出结算' },
      ],
    },
  },
]
