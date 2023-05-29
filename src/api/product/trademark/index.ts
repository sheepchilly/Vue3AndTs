//商品属性管理

import request from "@/utils/request";
import {TradeMarkResponseData,TradeMark} from './types.ts'

enum API{
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}

export const reqHasTrademark = (page:number,limit:number)=>request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)
//新增和修改品牌类型 - 如果data中携带id字段就是修改，否则就是新增
export const reqAddOrUpdateTrademark = (data:TradeMark)=>{
    if(data.id){
        return request.put<any,any>(API.UPDATETRADEMARK_URL,data)
    }else{
        return request.post<any,any>(API.ADDTRADEMARK_URL,data)
    }
}
export const reqDeleteTrademark = (id:number) => request.delete<any,any>(API.DELETETRADEMARK_URL+`${id}`)