<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="count"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Top from './components/top/Top.vue'
//引入左侧三个子组件
import Tourist from './components/tourist/index.vue';
import Sex from './components/sex/index.vue';
import Age from './components/age/index.vue'

//引入中间两个子组件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'

//引入右侧三个子组件
import Rank from './components/rank/index.vue';
import Year from './components/year/index.vue';
import Counter from './components/couter/index.vue'

//获取数据大屏展示内容盒子的DOM元素
let screen = ref<any>(null)

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}
//监听视口变化
window.onresize = () => {
  //放大或缩小相应的倍数
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover; //跟盒子一样大小

  .screen {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1080px;
    // 设置基点
    transform-origin: left top;
  }

  .top {
    width: 100%;
    height: 40px;
  }

  .bottom {
    display: flex;

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 40px;

      .rank {
        flex: 1.5;
      }

      .year {
        flex: 1;

      }

      .count {
        flex: 1;
      }
    }

    .left {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 1040px;

      .tourist {
        flex: 1.2;
      }

      .sex {
        flex: 1;

      }

      .age {
        flex: 1;
      }
    }

    .center {
      flex: 1.7;
      display: flex;
      flex-direction: column;

      .map {
        flex: 4;
      }

      .line {
        flex: 1;
      }
    }
  }
}
</style>
