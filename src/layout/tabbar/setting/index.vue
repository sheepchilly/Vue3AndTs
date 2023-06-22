<template>
  <el-button type="" size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button type="" size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <!-- 气泡确认框 -->
  <el-popover placement="bottom" title="主体设置" :width="280" trigger="click">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" />
      </el-form-item> 
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" v-model="dark" :inline-prompt="true" size="large" active-icon="Moon"
          inactive-icon="Sunny" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button type="" size="small" icon="Setting" circle></el-button>

    </template>
  </el-popover>

  <img :src="userStore.avatar" class="right_img" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      <span>{{ userStore.username }}</span>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'

let layOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()

let $router = useRouter()
let $route = useRoute()
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//收集开关的数据
let dark = ref<boolean>(false)

//主题颜色的设置
const setColor = () =>{
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary',color.value)
}

//切换暗黑模式
const changeDark = () => {
  let html = document.documentElement;
  dark.value ? html.className = 'dark' : html.className = ''
}

//刷新按钮点击的回调
const updateRefsh = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
//全屏按钮点击的回调
const fullScreen = () => {
  //document.fullscreenElement:DOM对象的一个属性，可以用来判断当前是不是全屏模式
  let full = document.fullscreenElement
  if (!full) {
    //文档根节点的方法 requestFullscreen，实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏模式
    document.exitFullscreen()
  }
}

const logout = async () => {
  await userStore.userLogOut()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>


<style lang="scss" scoped>
.right_img {
  width: 24px;
  height: 24px;
  margin: 0 10px;
  border-radius: 50%;
}
</style>
