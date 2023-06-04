//商品属性相关的文件
import request from '@/utils/request'
import type { CategoryResponse, AttrResponseData, Attr } from './types'

enum API {
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  //分类下已有的属性与属性值
  ATTR_URL = '/admin/product/attrInfoList/',
  //添加或修改已有属性的接口
  ADDUPDATE_URL = '/admin/product/saveAttrInfo',
  DELETE_URL = '/admin/product/deleteAttr/'
}

export const reqGetC1 = () => request.get<any, CategoryResponse>(API.C1_URL)
export const reqGetC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponse>(API.C2_URL + category1Id)
export const reqGetC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponse>(API.C2_URL + category2Id)
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDUPDATE_URL, data)
export const reqDeleteAttr = (id:number|string) => request.delete<any,any>(API.DELETE_URL+id)
