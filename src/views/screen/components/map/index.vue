<template>
    <div class="box4" ref="map">
        地图
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import * as echarts from "echarts";
import chinaJSON from '@/views/screen/components/map/china.json'

let map = ref(null)
//注册中国地图
echarts.registerMap('china', chinaJSON)
onMounted(() => {
    let mychart = echarts.init(map.value)
    mychart.setOption({
        //地图组件
        geo: {
            map: 'china',//中国地图
            roam: true, //鼠标缩放的效果
            left: 50,
            top: 50,
            right: 50,
            bottom: 50,
            label: { //地图上文字的设置
                show: true
            },
            itemStyle: {
                //每一个多边形的样式
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'red' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                opacity: .8
            },
            //地图高亮的效果
            emphasis: {
                itemStyle: {
                    color: 'red'
                },
                label: {
                    fontSize: 40
                }
            },
        },
        //布局位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        //系列
        series: [
            {
                type:'lines',
                data:[
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [119.306239, 26.075302]   // 终点

                        ],  
                        // 统一的样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5
                        }
                    },
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [114.298572,30.584355]   // 终点

                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'yellow',
                            width: 5
                        }
                    }
                ],
                //开启动画特效
                effect: {
                    show: true,
                    symbol: 'arrow',
                    color: 'black',
                    symbolSize: 10
                }
            }

    ]
    })
})
</script>

<style lang="scss" scoped></style>
