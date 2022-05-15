<template>
  <div ref="lineChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Progress',
  mounted() {
    const myChart = echarts.init(this.$refs.lineChart)
    myChart.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: {
        type: 'bar',
        data: [78],
        barWidth: 10,
        showBackground: true,
        backgroundStyle: {
          color: '#eee'
        },
        label: {
          show: true,
          formatter: '|',
          position: 'right'
        }
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
  color: rgb(132, 0, 255);
}
</style>
