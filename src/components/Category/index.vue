<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          @change="handler"
          placeholder="请选择"
          :disabled="isForbidden == 0 ? false : true"
        >
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryStore.c2Id"
          @change="handlerC2"
          :disabled="isForbidden == 0 ? false : true"
        >
          <el-option
            :label="c2.name"
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryStore.c3Id"
          :disabled="isForbidden == 0 ? false : true"
        >
          <el-option
            :label="c3.name"
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'

defineProps(['isForbidden'])

let categoryStore = useCategoryStore()

onMounted(() => {
  getC1()
})
//通知仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}
//一级分类下拉菜单选中值得时候会触发，可以保证一级分类的ID有了
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
const handlerC2 = () => {
  categoryStore.getC3()
}
</script>

<style lang="scss" scoped></style>
