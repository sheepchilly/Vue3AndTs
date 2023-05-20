<template>
  <!-- svg:图标外层容器结点，内部标签需要与use标签结合使用 -->
  <svg :style="{width,height}">
    <!-- xlink:href 指定用哪一个图标，
          属性值必须是#icon-图标名字，
          fill=“red”：图标填充的颜色 -->
    <use :xlink:href="prefix+name" :fill="color"></use>
  </svg>
</template>

<script setup>
defineProps({
  //xlink:href属性值的前缀，注意，:xlink必须要加:，不然就是普通的字符串
  prefix:{
    type:String,
    default:'#icon-'
  },
  //图标的名字
  name:String,
  //图标的颜色
  color:{
    type:String,
    default:''
  },
  //接收父组件传递过来的图标的宽度
  width:{
    type:String,
    default:'16px'
  },
  //接收父组件传递过来的图标的高度
  height:{
    type:String,
    default:'16px'
  },
})
</script>

<style>
</style>