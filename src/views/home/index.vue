<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好呀{{ userStore.username }}</h3>
        <p class="subtitle">万甄集团运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="svgBottom">
    <svg-icon name="welcome" width="350" height="350"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';

let userStore = useUserStore()

</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom{
    margin-left: 20px;
    .title{
    font-size: 30px;
    margin-bottom: 20px;
    font-weight: 900;
  }
  .subtitle{
    color: gray;
  }
  }
}
.svgBottom{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
