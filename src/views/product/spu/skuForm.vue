<template>
  <el-form label-width="100px">
    <el-form-item label="sku名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input type="textarea" placeholder="SKU描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId">
            <el-option v-for="val in item.attrValueList" :key="val.id" :label="val.valueName"
              :value="`${item.id}:${val.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId">
            <el-option v-for="val in item.spuSaleAttrValueList" :key="val.id" :label="val.saleAttrName"
              :value="`${item.id}:${val.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center" />
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" style="width:100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="warning" size="default" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from "vue"
import { reqAttr } from '@/api/product/attr/index.ts'
import { reqSpuHasSale, reqImage, reqAddSku } from '@/api/product/spu/index.ts'
import type { SkuData } from '@/api/product/spu/types.ts'
import { ElMessage } from "element-plus";

let $emit = defineEmits(['changeScene'])
let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
let table = ref<any>(null)
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: "",//三级分类的ID
  spuId: "",//已有的SPU的ID
  tmId: "",//SPU品牌的ID
  //v-model收集
  skuName: "",//sku名字
  price: "",//sku价格
  weight: "",//sku重量
  skuDesc: "",//sku的描述

  skuAttrValueList: [//平台属性的收集
  ],
  skuSaleAttrValueList: [//销售属性
  ],
  skuDefaultImg: "",//sku图片地址
})

//保存按钮
const save = async () => {
  //整理数据
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev
  }, [])
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [attrId, valueId] = next.saleIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev
  }, [])
  //发请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功！'
    })
  }else{
    ElMessage({
      type:'error',
      message:'添加失败！'
    })
  }
  $emit('changeScene', { flag: 0, params: '' })
}

const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
  attrArr.value = []
  saleArr.value = []
  imgArr.value = []
}

//设置默认图片的回调方法
const handler = (row: any) => {
  //复选框选中(排他思想)
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  });
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

//子组件对外暴露的方法
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  let c1 = c1Id
  let c2 = c2Id
  //获取平台属性
  let result: any = await reqAttr(c1, c2, spu.category3Id)
  //获取对应的销售属性
  let result1: any = await reqSpuHasSale(spu.id)
  //获取照片墙数据
  let result2: any = await reqImage(spu.id)

  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}

defineExpose({ initSkuData })
</script>

<style lang="scss" scoped></style>

