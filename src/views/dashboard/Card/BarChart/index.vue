<template>
  <div ref="lineChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
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
        type: 'bar',
        data: [12, 34, 54, 25, 78, 23, 47, 87, 99]
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
