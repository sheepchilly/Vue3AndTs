<template>
    <!-- 路由组件出口的位置 - v-slot插槽，会把要显示的组件注入 -->
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染layout一级路由组件的子路由 -->
            <component :is="Component"></component>
        </transition>
    </router-view>

</template>

<script setup>
import {ref} from "vue"
</script>

<style lang="scss" scoped>
.fade-enter-from{
    opacity: 0;
}
.fade-enter-active{
    transition: all 0.5s;
}
.fade-enter-to{
    opacity: 1;
}
</style>
