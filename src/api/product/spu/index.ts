import request from '@/utils/request'
import {
  SpuData,
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SkuInfoData,
  SkuData,
} from './types'

enum API {
  //获取已有的SPI数据，需要携带三个参数
  HASSPU_URL = '/admin/product/',
  //获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //某个Spu下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某一个SPU下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  UPDATESALEATTR_URL = '/admin/product/updateSpuInfo',
  ADDSALEATTR_URL = '/admin/product/saveSpuInfo',
  //追加一个新的sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除SPU
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

export const reqGetSPU = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
export const reqAllTrademark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
export const reqImage = (id: number | string) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + id)
//已有的销售属性
export const reqSpuHasSale = (id: number | string) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + id)
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

//添加|更新SPU属性
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post(API.UPDATESALEATTR_URL, data)
  } else {
    return request.post(API.ADDSALEATTR_URL, data)
  }
}
//添加sku的请求的方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)
export const reqSkuList = (spuid: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuid)
export const reqDeleteSpu = (spuid: number | string) =>
  request.delete<any, any>(API.DELETESPU_URL + spuid)
