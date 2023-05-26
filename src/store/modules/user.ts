//用户信息小仓库

import { defineStore } from 'pinia'
//引入登录接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/types'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/routes'

//创建用户小仓库
let useUserStore = defineStore('User', {
  // 存储数据(state返回的类型是UserState类型)
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //路由对象
      username: '',
      avatar: '',
    }
  },
  // 异步|逻辑
  actions: {
    //data的类型是loginForm
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        this.token = result.data
        SET_TOKEN(result.data)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //获取用户信息
    async userInfo() {
      let result: userInfoReponseData = await reqUserInfo()
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogOut() {
      let result: any = await reqLogout()
      //目前没有退出登录的接口（通知服务器本地用户唯一标识失效）
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  //计算属性
  getters: {},
})

//对外暴露获取小仓库的方法
export default useUserStore
