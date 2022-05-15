<template>
  <div class="chart-cont">
    <div class="header">
      <span>{{ title }}</span>
      <svg t="1645085306431" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2102" width="16" height="16">
        <path
          d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0zM512 928c-229.75 0-416-186.25-416-416S282.25 96 512 96s416 186.25 416 416S741.75 928 512 928z"
          p-id="2103"
          fill="#8a8a8a"
        />
        <path
          d="M537.64 343.452c47.074 0 83.266-37.528 83.266-78.072 0-32.46-20.832-60.878-62.496-60.878-54.816 0-82.178 44.618-82.178 77.11C475.144 320.132 498.152 343.452 537.64 343.452z"
          p-id="2104"
          fill="#8a8a8a"
        />
        <path
          d="M533.162 728.934c-7.648 0-10.914-10.136-3.264-39.55l43.25-166.406c16.386-60.848 10.944-100.398-21.92-100.398-39.456 0-131.458 39.83-211.458 107.798l16.416 27.392c25.246-17.256 67.906-34.762 77.792-34.762 7.648 0 6.56 10.168 0 35.508l-37.746 158.292c-23.008 89.266 1.088 109.538 33.984 109.538 32.864 0 117.808-30.47 195.57-109.632l-18.656-25.34C575.354 716.714 543.05 728.934 533.162 728.934z"
          p-id="2105"
          fill="#8a8a8a"
        />
      </svg>
    </div>
    <div class="count">
      <span>{{ count }}</span>
      <svg
        v-if="upOrDown === 0"
        t="1645086272272"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2013"
        width="16"
        height="16"
      >
        <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="2014" />
      </svg>
      <svg
        v-else
        t="1645086318818"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2862"
        width="16"
        height="16"
      >
        <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="2863" />
      </svg>
    </div>
    <div ref="lineChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
  props: {
    title: { type: String, default: '' },
    count: { type: String, default: '' },
    percent: { type: String, default: '' },
    upOrDown: { type: Number, default: 1 }
  },
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
        data: [12, 39, 54, 43, 54, 23, 47, 87, 99],
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
.header {
  display: flex;
  justify-content: space-between;
  height: 20px;
  margin: 20px 0;
  padding: 0 20px;
}
.count {
  padding: 0 20px;

  span {
    font-size: 20px;
    font-weight: bold;
    margin-right: 10px;
  }
}
</style>
