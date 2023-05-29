<template>
  <div class="body">
    <Category :isForbidden="scene" />

    <el-card class="bottom_card">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加平台属性
        </el-button>
        <el-table style="margin: 10px 0" border :data="attrArr">
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性名称" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #="{ row, $index }">
              <el-button
                type="warning"
                icon="Edit"
                size="small"
                @click="updateAttr"
              ></el-button>
              <el-button type="danger" icon="Delete" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称：">
            <el-input
              placeholder="请输入属性的名字"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button size="default" @click="cancel">取消</el-button>

        <el-table
          :data="attrParams.attrValueList"
          style="width: 100%; margin: 10px 0"
          border
        >
          <el-table-column label="序号" width="100" type="index" />
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称..."
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row, $index)"
              />
              <div v-else @click="toEdit(row)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import {
  reqAttr,
  reqAddOrUpdateAttr,
  AttrValue,
} from '@/api/product/attr/index.ts'
import { Attr, AttrResponseData } from '@/api/product/attr/types.ts'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()

let attrArr = ref<Attr[]>([])
let scene = ref<number>(1)
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [], //新增的属性值数组
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //三级分类
})

watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) {
      attrArr.value = []
      return
    }
    getCList()
  },
)

//输入和查看模式切换
const toLook = (row: AttrValue, $index: number) => {
  //非法情况1：输入不能为空
  if (row.valueName.trim() == '') {
    //将input输入为空的从数组中干掉
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '请输入属性值',
    })
    return
  }
  //非法情况2：输入不能重复
  let repeat: any = attrParams.attrValueList.find((item) => {
    //判断除了当前项以外的其他项
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '输入的属性值重复',
    })
    return
  }
  row.flag = false
}

const toEdit = (row: AttrValue) => {
  row.flag = true
}

//获取三级分类属性与属性值的数据
const getCList = async () => {
  let result: AttrResponseData = await reqAttr(
    categoryStore.c1Id,
    categoryStore.c2Id,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

//添加属性值按钮的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  })
}

//添加属性按钮的回调
const addAttr = () => {
  //每一次点击的时候先清空数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
  scene.value = 1
}

//修改已有属性按钮的回调
const updateAttr = () => {
  scene.value = 1
}

//取消按钮的回调
const cancel = () => {
  scene.value = 0
}

//保存按钮的回调
const save = async () => {
  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    getCList()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
</script>

<style lang="scss" scoped>
.bottom_card {
  margin-top: 10px;
}
</style>
