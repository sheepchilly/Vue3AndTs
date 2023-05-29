//商品属性相关的数据类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//分类的ts类型
export interface CategoryObj {
  id: number | string //id虽然返回的是字符串类型，但是仓库当中存的是number类型
  name: string
  category1Id?: number
  category2Id?: number
  category3Id?: number
}

//相应的分类接口返回数据的类型 - 继承公共属性ResponseData,里面额外有CategoryObj类型的数组数据
export interface CategoryResponse extends ResponseData {
  data: CategoryObj[]
}

//以下是 属性与属性值的ts类型

//属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
//存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
//属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}
//存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
//属性接口返回的数据的ts类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
