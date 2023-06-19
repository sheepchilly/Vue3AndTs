<template>
  <el-table :data="PermissionArr" style="width: 100%;margin-bottom: 20px;" row-key="id" border >
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作" width="280">
      <template #="{row,$index}">
        <el-button type="primary" size="small" icon="Plus">添加菜单</el-button>
        <el-button type="primary" size="small" icon="Edit">编辑</el-button>
        <el-button type="primary" size="small" icon="Delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {reqAllPermission} from '@/api/acl/menu/index.ts'
import type {PermisstionResponseData,PermisstionList} from '@/api/acl/menu/type'

//全部菜单的数据
let PermissionArr = ref<PermisstionList>([])


onMounted(()=>{
  getMenu()
})
let getMenu = async () =>{
  let result:PermisstionResponseData = await reqAllPermission()
  if(result.code == 200){
    PermissionArr.value = result.data
  }
}

</script>

<style lang="scss" scoped></style>
