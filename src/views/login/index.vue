<template>
  <div class="login_container">
   <el-row>
    <el-col :span="12" :xs="0">占位的位置</el-col>
    <el-col :span="12" :xs="24">
      <el-form class="login_form">
        <h1>Hello</h1>
        <h2>欢迎来到万甄集团</h2>
        <el-form-item >
            <el-input :prefix-icon="User" v-model="loginForm.username">

            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password>

            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="login" type="primary" size="default" class="login_btn">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  </div>
</template>

<script setup lang="ts">
import {reactive,onMounted} from 'vue';
import { User,Lock } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()

onMounted(()=>{
  console.log(useStore.num)
})

let loginForm = reactive({
    username:"admin",
    password:"123456"
})

const login = ()=>{
  console.log(loginForm.username,loginForm.password)
}
</script>

<style scoped lang="scss">
.login_container{
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form{
    position: relative;
    margin: 0 auto;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1{
      color: white;
      font-size: 40px;
    }
    h2{
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn{
      width: 100%;
    }
  }
}
</style>