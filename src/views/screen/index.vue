<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">左侧</div>
        <div class="center">中间</div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import Top from './components/Top.vue'

//获取数据大屏展示内容盒子的DOM元素
let screen = ref<any>(null)

onMounted(()=>{
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

//定义大屏缩放比例
function getScale(w=1920,h=1080){
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww<wh? ww:wh;
}
//监听视口变化
window.onresize = () => {
  //放大或缩小相应的倍数
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

</script>

<style lang="scss" scoped>
  .container{
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat;
    background-size: cover; //跟盒子一样大小
    .screen{
      position: fixed;
      left: 50%;
      top: 50%;
      width: 1920px;
      height: 1080px;
      // 设置基点
      transform-origin: left top;
    }
    .top{
      width: 100%;
      height: 40px;
    }
    .bottom{
      display: flex;
      .right{
        flex: 1;
      }
      .left{
        flex: 1;
      }
      .center{
        flex:2;
      }
    }
  }
</style>
