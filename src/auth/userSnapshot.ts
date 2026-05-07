/**
 * 登录用户快照（不含 token），与 token 配合用于刷新后恢复侧边栏/角色等。
 */
import type { MenuItemVO, UserVO } from '@/type/user'

const USER_SNAPSHOT_KEY = 'ERP_USER_SNAPSHOT'

export type UserSnapshot = Omit<UserVO, 'token'> & { menus?: MenuItemVO[] }

export const setUserSnapshot = (data: UserVO): void => {
  const { token: _t, ...rest } = data
  localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(rest))
}

export const loadUserSnapshot = (): UserSnapshot | null => {
  const raw = localStorage.getItem(USER_SNAPSHOT_KEY)
  if (!raw || raw === 'null') return null
  try {
    return JSON.parse(raw) as UserSnapshot
  } catch {
    return null
  }
}

export const removeUserSnapshot = (): void => {
  localStorage.removeItem(USER_SNAPSHOT_KEY)
}
