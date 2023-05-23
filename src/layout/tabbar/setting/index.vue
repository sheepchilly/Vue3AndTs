<template>
        <el-button type="warm" size="small" icon="Refresh" circle></el-button>
      <el-button type="warm" size="small" icon="FullScreen" circle></el-button>
      <el-button type="warm" size="small" icon="Setting" circle></el-button>
      <img src="../../../../public/two.jpg" class="right_img" />
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          admian
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
  </template>
  
  <script setup>

  </script>
  
  <style lang="scss" scoped>
      .right_img{
      width: 24px;
      height: 24px;
      margin: 0 10px;
      border-radius: 50%;
    }
  </style>
  