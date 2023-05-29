//定义小仓库state的数据类型

import { RouteRecordRaw } from 'vue-router'
import type {CategoryObj} from '@/api/product/attr/types'

export interface UserState {
  //还没有登录的时候是null，登录成功后是string，所以用联合类型 |
  token: null | string
  menuRoutes: RouteRecordRaw[] //路由数组
  username: string
  avatar: string
}

//定义分类仓库state对象的ts类型
export interface categoryState{
  c1Id:string|number,
  c1Arr:CategoryObj[],
  c2Id:string|number,
  c2Arr:CategoryObj[],
  c3Id:string|number,
  c3Arr:CategoryObj[],
}
