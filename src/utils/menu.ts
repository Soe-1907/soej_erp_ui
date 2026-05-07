import type { MenuItemVO } from '@/type/user'
import { landingPathByRole } from '@/constants/role'

/**
 * 按后端 LoginMenuFactory 菜单树顺序，深度优先取第一个带 path 的叶子（有 children 时先遍历子节点）。
 */
export function firstLeafPathFromMenus(menus: MenuItemVO[] | undefined | null): string | undefined {
  if (!menus?.length) {
    return undefined
  }
  for (const item of menus) {
    if (item.children?.length) {
      const sub = firstLeafPathFromMenus(item.children)
      if (sub) {
        return sub
      }
    }
    const path = item.path?.trim()
    if (path) {
      return path
    }
  }
  return undefined
}

/** 登录后首屏：优先登录返回 menus 的首项，否则回退 landingPathByRole */
export function landingPathForUser(
  user: { menus?: MenuItemVO[]; roleCode?: number } | null | undefined
): string {
  const fromMenu = firstLeafPathFromMenus(user?.menus)
  return fromMenu ?? landingPathByRole(user?.roleCode)
}
