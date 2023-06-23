<template>
  <div class="box5">
      <div class="title">
          <p>未来七天游客数量趋势图</p>
          <img src="../../images/dataScreen-title.png" alt="">
      </div>
      <div class="charts" ref='line'></div>
  </div>
</template>
  
  <script setup>
  import {ref,onMounted} from "vue"
  import * as echarts from 'echarts'

  let line= ref(null)

  onMounted(()=>{
    let mycharts = echarts.init(line.value)
    mycharts.setOption({
      title:{
        // text:'游客访问量趋势图',

      },
      xAxis:{
        //去掉折线图的分割线
        splitLine: {
                show: false
            },
        type:'category',
        boundaryGap:false,//两侧不留白
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            //轴线的设置
            axisLine: {
                show: true
            },
            //轴线的设置
            axisLine: {
                show: true
            },
            //刻度
            axisTick: {
                show: true
            }
      },
      yAxis:{
        //分割线不要
        splitLine: {
                show: false
            },
      },
      grid:{
        left:40,
        right:0,
        bottom:20,
        top:0
      },
      series:[
        {
          type:'line',
          data:[120,1240,2626,882,321,890,1200],
          //平滑曲线的设置
          smooth:true,
          //区域填充样式
          areaStyle: {
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
                    }
                }
        }
      ]
    })
  })
  </script>
  
  <style lang="scss" scoped>
  .box5 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 0px 20px;

    .title {
        margin-left: 10px;

        p {
            color: white;
            font-size: 18px;
        }
    }

    .charts {
        height: calc(100% - 40px);
    }

}
  </style>
  