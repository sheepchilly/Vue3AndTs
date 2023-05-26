<template>
  <el-button type="" size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
  <el-button type="" size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-button type="" size="small" icon="Setting" circle></el-button>
  <img :src="userStore.avatar" class="right_img" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      <span>{{userStore.username}}</span>
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

<script setup>
import { useRouter,useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'

let layOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()

let $router = useRouter()
let $route = useRoute()

//刷新按钮点击的回调
const updateRefsh = ()=>{
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
//全屏按钮点击的回调
const fullScreen = ()=>{
  //document.fullscreenElement:DOM对象的一个属性，可以用来判断当前是不是全屏模式
  let full = document.fullscreenElement
  if(!full){
    //文档根节点的方法 requestFullscreen，实现全屏模式
    document.documentElement.requestFullscreen()
  }else{
    //退出全屏模式
    document.exitFullscreen()
  }
}

const logout = async ()=>{
  await userStore.userLogOut()
  $router.push({path:'/login',query:{redirect:$route.path}})
}

</script>

<script>
export default{
  name:'Setting'
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
