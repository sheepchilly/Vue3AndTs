<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0">占位的位置</el-col>
      <el-col :span="12" :xs="24">
        <el-form
          :model="loginForm"
          class="login_form"
          ref="ruleFormRef"
          :rules="rules"
        >
          <h1>Hello</h1>
          <h2>欢迎来到万甄集团</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="isLoading"
              @click="login"
              type="primary"
              size="default"
              class="login_btn"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { getTime } from '@/utils/time'

let $router = useRouter()
let $route = useRoute()
let useStore = useUserStore()

//自定义校验规则
// const validatorUserName = (_: any, value: any, callback: any) => {
//rule为数组的校验规则对象,value为表单校验的文本内容,callback是一个函数，如果符合条件callBack会放行
// if (/^\d{4,10}$/.test(value)) {
//   callback()
// } else {
//   callback(new Error('账号长度至少五位'))
// }
// }

let isLoading = ref(false) //登录按钮的loading
const ruleFormRef = ref(null)
const rules = reactive({
  username: [
    //validator:自定义校验规则
    // { require:true,trigger: 'blur', validator: validatorUserName },
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: { required: true, message: '请输入密码', trigger: 'blur' },
})

let loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})

const login = async () => {
  await (ruleFormRef.value as any).validate()
  isLoading.value = true
  try {
    isLoading.value = false
    //登陆成功
    await useStore.userLogin(loginForm)
    //编程式路由导航跳转到对应数据页
    let redirect: any = $route.query.redirect
    console.log(redirect)
    $router.push({ path: redirect || '/' })

    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    })
  } catch (error) {
    isLoading.value = false
    //登陆失败
    ElMessage({
      type: 'error',
      message: (error as Error).message, //(xx as xx)是类型断言
    })
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    margin: 0 auto;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
