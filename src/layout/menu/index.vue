<template>
  <div class="menu">
    <template v-for="(item, index) in menuList" :key="item.path">
      <!-- 没有子路由 -->
      <template v-if="!item.children">
        <el-menu-item
          v-if="!item.meta.hidden"
          :index="item.path"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!-- 有子路由，但是只有一个子路由 -->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.children[0].meta.icon" />
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!-- 有子路由，且个数大于1 -->
      <el-sub-menu
        v-if="item.children && item.children.length > 1"
        :index="item.path"
      >
        <template #title>
          <el-icon>
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <!-- 递归组件嵌套 -->
        <Menu :menuList="item.children" />
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
let $router = useRouter()

defineProps(['menuList'])

const goRoute = (vc: any) => {
  //路由跳转
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style lang="scss" scoped>
// .menu{
//   background: $base-menu-background;
// }
</style>