// 用户相关接口

import request from '@/utils/request'
import type { loginForm, loginResponseData } from './types'

//统一管理接口，使用enum枚举
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
}

//对外暴露请求函数

//登录接口 {username,password}
export const reqLogin = (data: loginForm) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息接口方法
export const reqUserInfo = () => request.get(API.USERINFO_URL)
