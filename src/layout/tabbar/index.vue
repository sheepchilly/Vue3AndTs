<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb />
    </div>

    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script>
export default{
  name:"Tabbar"
}
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // background-image: linear-gradient(to right,white,black,white);
  border-bottom: 1px solid gray;
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-right: 10px;
  }
}
</style>
