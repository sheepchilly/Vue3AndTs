<template>
  <div class="">
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>

      <el-table style="width: 100%;margin: 10px 0;" border>
        <el-table-column prop="date" label="序号" width="80" />
        <el-table-column prop="name" label="品牌名称"  />
        <el-table-column prop="address" label="品牌LOGO" />
        <el-table-column prop="address" label="操作" />
      </el-table>

      <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="limit"
      :page-sizes="[3,5,7,9]"
      :background="true"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let currentPage = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(100)

const handleSizeChange = ()=>{

}
const handleCurrentChange = ()=>{

}
</script>

<style lang="scss" scoped></style>
