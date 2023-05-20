<script setup lang="ts">
import { onMounted } from 'vue';
import { reqLogin } from './api/user';

onMounted(()=>{
  reqLogin({username:'admin',password:'111111'}).then(res=>{
    console.log(res.data)
  })
})
</script>

<template>
  <div>
    <h1>测试axios二次封装</h1>
  </div>
</template>

<style lang="scss" scoped>

</style>
