<template>
  <div ref="lineChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
  mounted() {
    const myChart = echarts.init(this.$refs.lineChart)
    myChart.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: {
        type: 'line',
        data: [12, 34, 54, 25, 78, 23, 47, 87, 99],
        itemStyle: {
          opacity: 0
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'skyblue' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'white' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        smooth: true
      },
      grid: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    })
  }
}
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
