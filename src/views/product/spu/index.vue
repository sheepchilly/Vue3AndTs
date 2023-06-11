<template>
  <div class="">
    <Category :isForbidden="scene" />

    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          icon="Plus"
          size="default"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加SPU
        </el-button>

        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column
            label="序号"
            width="100"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button
                icon="Plus"
                type="primary"
                size="small"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                icon="Edit"
                type="warning"
                size="small"
                @click="updateSpu(row)"
                title="修改SPU"
              ></el-button>
              <el-button
                icon="View"
                type="info"
                size="small"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}吗?`"
                @confirm="deleteSpu(row)"
                width="200px"
              >
                <template #reference>
                  <el-button
                    icon="Delete"
                    type="danger"
                    size="small"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :page-count="totalPage"
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuData"
          @size-change="changeSize"
          prev-text="上一页"
          next-text="下一页"
        />
      </div>

      <!-- 添加 | 修改已有的Spu结构 -->
      <SpuForm ref="spuForm" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加Sku的子组件 -->
      <SkuForm v-show="scene == 2" ref="skuForm" @changeScene="changeScene" />

      <el-dialog v-model="show" title="SKU列表" width="70%">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU总量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片" width="250">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqGetSPU, reqSkuList, reqDeleteSpu } from '@/api/product/spu/index.ts'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/types.ts'
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
let scene = ref<number>(0)
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let records = ref<Records>([])
let spuForm = ref<any>(null)
let skuForm = ref<any>(null)
//全部的Sku数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

watch(
  () => categoryStore.c3Id,
  () => {
    //有三级分类ID才发请求，没有就不发
    if (!categoryStore.c3Id) {
      return
    }
    getSpuData()
  },
)

// 路由组件销毁前清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset
})

//删除SPU
const deleteSpu = async (row: any) => {
  let result: any = await reqDeleteSpu(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
    getSpuData()
  }
}

//查看Sku列表的数据
const findSku = async (row: any) => {
  let result: SkuInfoData = await reqSkuList(row.id)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}

//给已有的SPU追加售卖的SKU
const addSku = (row: SpuData) => {
  scene.value = 2
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//获取SPU数据
const getSpuData = async (page = 1) => {
  pageNo.value = page
  let result: HasSpuResponseData = await reqGetSPU(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

//子组件绑定的自定义事件，让子组件通知父组件切换场景
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    getSpuData(pageNo.value)
  } else {
    getSpuData()
  }
}

//添加新的SPU
const addSpu = () => {
  scene.value = 1
  spuForm.value.initAddSpu(categoryStore.c3Id)
}

//修改已有的SPU按钮的回调
const updateSpu = async (row: SpuData) => {
  scene.value = 1
  //调用子组件实例方法获取完整的已有的SPU的数据
  spuForm.value.initHasSpuData(row)
}

//分页器的下拉菜单发生变化时触发
const changeSize = () => {
  getSpuData()
}

const totalPage = computed(() => {
  if (total.value % pageSize.value == 0) {
    return Math.floor(total.value / pageSize.value)
  } else {
    return Math.ceil(total.value / pageSize.value)
  }
})
</script>

<style lang="scss" scoped></style>
