<template>
  <div ref="pieChart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'PieChart',
  mounted() {
    const myChart = echarts.init(this.$refs.pieChart)
    myChart.setOption({
      title: {
        text: '搜索引擎',
        subtext: '300',
        top: 'center',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 1048, name: '视频广告' },
            { value: 735, name: '联盟广告' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '直接访问' },
            { value: 300, name: '搜索引擎' }
          ]
        }
      ]
    })

    myChart.on('mouseover', (params) => {
      const { name, value } = params.data
      myChart.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
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
