<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
//引入仓库setting，使用其中fold数据
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()

let $route = useRoute()

const changeIcon = () => {
  LayOutSettingStore.changeIconAction()
}
</script>

<script>
export default {
  name: 'Breadcrumb',
}
</script>

<template>
  <el-icon style="margin-right: 20px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态生成面包屑 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon class="margin-top:25px;width:24px;height:24px;">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped></style>
