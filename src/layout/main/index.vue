<template>
  <!-- 路由组件出口的位置 - v-slot插槽，会把要显示的组件注入 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
let layOutSettingStore = useLayOutSettingStore()

//控制当前组件是否销毁重建
let flag = ref(true)

//监听仓库内部数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(
  () => layOutSettingStore.refsh,
  () => {
    //点击刷新按钮：路由组件需要销毁
    flag.value = false
    //DOM更新后再让flag变回true
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script>
export default {
  name: 'Main',
}
</script>

<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
