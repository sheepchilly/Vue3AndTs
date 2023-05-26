<template>
  <div class="logo" v-if="setting.logoHiddebn">
    <img :src="setting.logo" class="logo_img" />
    <p v-show="!LayOutSettingStore.fold" style="color: white">
      {{ setting.title }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import setting from '../../setting'
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
</script>

<script>
export default {
  name: 'Logo',
}
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  // padding: 6px;
  .logo_img {
    width: 40px;
    height: 40px;
    color: white;
    margin-top: 5px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 20px;
  }
}
</style>
