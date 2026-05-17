/**
 * 与后端/登录约定一致的角色码
 * 0 系统管理员
 * 1 仓库管理员 / 2 仓库专员
 * 3 采购专员 / 4 采购管理员
 * 5 销售管理员 / 6 销售专员
 * 7 结算专员 / 8 结算管理员（需求文档「结算主管」对应此角色码）
 */
export const ROLE_ADMIN = 0
/** 超级管理员：系统维护与数据清理 */
export const ROLE_SUPER_ADMIN = 999
export const ROLE_WAREHOUSE_MANAGER = 1
export const ROLE_WAREHOUSE_SPECIALIST = 2
export const ROLE_PURCHASE_SPECIALIST = 3
export const ROLE_PURCHASE_MANAGER = 4
export const ROLE_SALES_MANAGER = 5
export const ROLE_SALES_SPECIALIST = 6
export const ROLE_SETTLEMENT_SPECIALIST = 7
export const ROLE_SETTLEMENT_MANAGER = 8

export function landingPathByRole(roleCode?: number): string {
  if (roleCode === ROLE_SUPER_ADMIN) {
    return '/data-cleanup'
  }
  if (roleCode === ROLE_WAREHOUSE_MANAGER) {
    return '/inventory-distribution'
  }
  if (roleCode === ROLE_SETTLEMENT_MANAGER || roleCode === ROLE_SETTLEMENT_SPECIALIST) {
    return '/income-settlement'
  }
  if (roleCode === ROLE_SALES_MANAGER || roleCode === ROLE_SALES_SPECIALIST) {
    return '/sales-outbound'
  }
  if (roleCode === ROLE_PURCHASE_MANAGER || roleCode === ROLE_PURCHASE_SPECIALIST) {
    return '/purchase-receive'
  }
  if (roleCode === ROLE_WAREHOUSE_SPECIALIST) {
    return '/inventory-verification'
  }
  return '/manager'
}

export function hasRoleIn(roleCode: number | undefined, allowed: number[]): boolean {
  return roleCode !== undefined && allowed.includes(roleCode)
}
