<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu background-color="#787785" text-color="white" :default-active="$route.path"> 
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">
      <Tabbar />

    </div>
    <!-- 内容展示区 -->
    <div class="layout_main">
      <Main />
    </div>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'
import Logo from '@/layout/logo/index.vue'
import Menu from '@/layout/menu/index.vue'
import Main from '@/layout/main/index.vue'
import Tabbar from '@/layout/tabbar/index.vue'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
const $route = useRoute()
console.log($route.path)


</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  // background: pink;
  display: flex;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: skyblue;
    background: $base-menu-background;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    width: calc(100vw - $base-menu-width);
    height: $base-tabbar-height;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    color:black;
  }
  .layout_main {
    position: relative;
    width: calc(100% - $base-menu-width);
    height: calc(100% - $base-tabbar-height);
    position: fixed;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    background: pink;
  }
}
</style>
