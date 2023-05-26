<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" >
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="LayOutSettingStore.fold?true:false"
          background-color="$base-menu-background"
          text-color="white"
          :default-active="$route.path"
        >
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Tabbar />
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Main />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Logo from '@/layout/logo/index.vue'
import Menu from '@/layout/menu/index.vue'
import Main from '@/layout/main/index.vue'
import Tabbar from '@/layout/tabbar/index.vue'
//获取小仓库
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'

let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()

const $route = useRoute()

</script>

<script>
export default{
  name:"Layout"
}
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
    transition: width .3s ease;
    &.fold{
      width: $base-menu-min-width;
    }
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
        background: $base-menu-background;
      }
    }
  }
  .layout_tabbar {
    background: $base-tabbar-backgorundColor;
    width: calc(100vw - $base-menu-width);
    height: $base-tabbar-height;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    color: black;
    transition: all .3s ease;
    &.fold{
      width: calc(100vw - $base-menu-min-width);
      left:$base-menu-min-width;
    }
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
    background:$base-main-backgroundColor;
    transition: all .3s ease;
    &.fold{
      width: calc(100vw - $base-menu-min-width);
      left:$base-menu-min-width;
    }
  }
}
</style>
