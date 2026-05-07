/**
 * 侧边菜单（与后端 LoginVo.menus 对齐）
 */
export interface MenuItemVO {
  path?: string
  title: string
  children?: MenuItemVO[]
}

/**
 * 用户信息 VO（登录接口返回 LoginVo，字段兼容 UserVO + token + menus）
 */
export interface UserVO {
  /** 用户ID */
  id: number

  /** 用户名 */
  userName: string

  /** 姓名（展示；可选） */
  realName?: string

  /** 联系电话（可选） */
  mobile?: string

  /** 角色权限编码 */
  roleCode: number

  /** 角色权限名称 */
  roleName: string

  /** 创建时间 */
  createAt: string

  /** 登录 token */
  token: string

  /** 登录返回的菜单树（可选，仅存快照时不含 token） */
  menus?: MenuItemVO[]
}

/**
 * 登录 DTO
 * 对应后端：UserDto（登录用）
 */
export interface LoginDto {
  /** 用户名 */
  userName: string

  /** 密码
   * ⚠️ 字段名必须和后端 UserDto 一致
   * 如果后端是 passWord，这里也必须是 passWord
   */
  passWord: string
}

/**
 * 修改密码 DTO
 * 对应后端：ChangePasswordDto
 */
export interface ChangePasswordDto {
  /** 原密码 */
  oldPassword: string

  /** 新密码 */
  newPassword: string

  /** 确认新密码 */
  confirmPassword: string
}
