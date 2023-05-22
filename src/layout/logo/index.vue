<template>
  <div class="logo" v-if="setting.logoHiddebn">
    <img :src="setting.logo" class="logo_img">
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup>
import {ref} from "vue"
import setting from '../../setting'
</script>

<style lang="scss" scoped>
.logo{
    width: 100%;
    height: $base-menu-logo-height;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo_img{
        width: 40px;
        height: 40px;
        color: white;
        margin-top: 5px;
    }
    p{
        font-size: $base-logo-title-fontSize;
        margin-left: 20px;
    }
}
</style>
