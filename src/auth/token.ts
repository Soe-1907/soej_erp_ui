/**
 * Token 管理
 */

const TOKEN_KEY = 'ERP_TOKEN'

/**
 * 获取 token
 */
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY)
  // 过滤掉历史遗留的无效值（"null" / "undefined" 字符串）
  if (!token || token === 'null' || token === 'undefined') return null
  return token
}

/**
 * 设置 token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 移除 token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 检查是否已登录
 */
export const isLoggedIn = (): boolean => {
  return !!getToken()
}

export type TokenPayload = {
  userName?: string
  roleCode?: number
  exp?: number
  iat?: number
  sub?: string
}

export const parseTokenPayload = (token: string | null = getToken()): TokenPayload | null => {
  if (!token) return null
  const [, payload] = token.split('.')
  if (!payload) return null
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const json = decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    )
    const parsed = JSON.parse(json) as TokenPayload
    return {
      ...parsed,
      roleCode: typeof parsed.roleCode === 'number' ? parsed.roleCode : Number(parsed.roleCode),
    }
  } catch {
    return null
  }
}

export const getTokenRoleCode = (token: string | null = getToken()): number | undefined => {
  const roleCode = parseTokenPayload(token)?.roleCode
  return Number.isFinite(roleCode) ? roleCode : undefined
}

