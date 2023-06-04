//服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//SPU数据的ts类型 - 是一个个的对象
export interface SpuData {
    id?: number,
    spuName: string,
    tmId: number | string,
    description: string,
    spuImageList: null|SpuImg[], //照片墙的数据要么是null要么是SpuImg[]数组的联合类型
    category3Id: number | string,
    spuSaleAttrList: null | SaleAttr[] //要么是null要么是销售属性数组的联合类型
}

//数组：包含上面的已有的SPU类型
export type Records = SpuData[]

//定义获取已有的SPU接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    },
}

//已有品牌数据的TS类型
export interface Trademark {
    id: number,
    tmName: string,
    logoUrl: string
}
//已有品牌接口返回的数据类型
export interface AllTradeMark extends ResponseData {
    data: Trademark[]
}

//已有的商品的照片的数据类型
export interface SpuImg {
    id?: number
    imgName?: string
    imgUrl?: string
    createTime?: string
    updateTime?: string
    spuId?: number
    name?: string
    url?: string
  }
//已有的spu照片接口返回的数据类型
export interface SpuHasImg extends SpuImg {
    data: SpuImg[]
}

//已有的销售属性值的Ts类型
export interface SaleAttrValue {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}
//存储已有的销售属性值数组类型
export type spuSaleAttrValeuList = SaleAttrValue[]
//销售属性对象的ts类型
export interface SaleAttr {
    id?: number,
    flag?:boolean,
    saleAttrValue?:string
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: spuSaleAttrValeuList
}
//Spu已有的销售属性接口返回的ts数据类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

//获取全部的销售属性的ts类型
export interface HasSaleAttr {
    id: number,
    name: string,
}
export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}

export interface Attr {
    attrId: number | string //平台属性的ID
    valueId: number | string //属性值的ID
  }

export interface saleArr {
    saleAttrId: number | string //属性ID
    saleAttrValueId: number | string //属性值的ID
  }


export interface SkuData {
    category3Id: string | number //三级分类的ID
    spuId: string | number //已有的SPU的ID
    tmId: string | number //SPU品牌的ID
    skuName: string //sku名字
    price: string | number //sku价格
    weight: string | number //sku重量
    skuDesc: string //sku的描述
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleArr[]
    skuDefaultImg: string //sku图片地址
  }
  
  //获取SKU数据接口的ts类型
  export interface SkuInfoData extends ResponseData {
    data: SkuData[]
  }
  