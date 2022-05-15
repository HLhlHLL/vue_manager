<template>
  <el-card>
    <div class="header">
      <el-tabs v-model="activeName">
        <el-tab-pane label="销售额" name="first" />
        <el-tab-pane label="访问量" name="second" />
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        />
      </div>
    </div>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="18">
          <div ref="echart" class="echart"></div>
        </el-col>
        <el-col :span="6">
          <span style="display: block; margin-bottom: 20px">销售额排名</span>
          <el-row v-for="item in rank" :key="item.no" :gutter="10">
            <el-col :span="4" :class="{ 'top-three': item.no <= 3 }">{{ item.no }}</el-col>
            <el-col :span="15">
              <span>{{ item.name }}</span>
            </el-col>
            <el-col :span="5">{{ item.money }}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'first',
      mycharts: {},
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'first' ? '销售额排名' : '访问量排名'
    },
    ...mapState({
      chartData: (state) => state.home.data
    }),
    rank() {
      return this.title === '销售额排名' ? this.chartData.orderRank : this.chartData.userRank
    }
  },
  watch: {
    title: {
      handler() {
        this.mycharts.setOption({
          title: {
            text: this.title
          },
          xAxis: {
            data: this.title === '销售额排名' ? this.chartData.orderFullYearAxis : this.chartData.userFullYearAxis
          },
          series: {
            data: this.title === '销售额排名' ? this.chartData.orderFullYear : this.chartData.userFullYear
          }
        })
      }
    },
    chartData: {
      handler() {
        this.mycharts.setOption({
          title: {
            text: this.title
          },
          xAxis: {
            data: this.title === '销售额排名' ? this.chartData.orderFullYearAxis : this.chartData.userFullYearAxis
          },
          series: {
            data: this.title === '销售额排名' ? this.chartData.orderFullYear : this.chartData.userFullYear
          }
        })
      }
    }
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.echart)
    this.mycharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    })
  },
  beforeDestroy() {
    this.$store.dispatch('clearData')
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('months').format('YYYY-MM-DD')
      const end = dayjs().endOf('months').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('years').format('YYYY-MM-DD')
      const end = dayjs().endOf('years').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  height: 60px;
}
.el-tabs {
  position: absolute;
  width: 100%;
  left: 0;

  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
}
.right {
  position: absolute;
  right: 0;

  span {
    margin-left: 20px;
  }

  span:hover {
    cursor: pointer;
  }

  .el-date-editor {
    width: 250px;
    margin: 0 20px;
  }
}
.main {
  width: 100%;
  .echart {
    width: 100%;
    height: 450px;
  }

  .el-row {
    margin-bottom: 10px;

    .el-col-4 {
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
    }

    span {
      padding-left: 20px;
    }
  }
}

.top-three {
  background-color: rgb(177, 0, 0);
  color: #fff;
}
</style>
