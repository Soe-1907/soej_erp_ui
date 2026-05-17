import request from '@/utils/request'
import type { LoginDto, UserVO, ChangePasswordDto } from '@/type/user'

/** 登录：POST /prod-api/auth/login（返回 LoginVo，字段兼容 UserVO） */
export const loginApi = (data: LoginDto) => {
  return request.post<UserVO>('/auth/login', data)
}

/** 获取当前用户信息：GET /prod-api/user */
export const getUserInfoApi = () => {
  return request.get<UserVO>('/user')
}

/** 修改密码：PUT /prod-api/user */
export const changePasswordApi = (data: ChangePasswordDto) => {
  return request.put<string>('/user', data)
}

/** 退出登录：DELETE /prod-api/user */
export const logoutApi = () => {
  return request.delete<string>('/user')
}
