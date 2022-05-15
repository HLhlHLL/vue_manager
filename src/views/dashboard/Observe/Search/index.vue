<template>
  <el-card>
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <i class="el-icon-more"></i>
    </div>
    <div class="charts">
      <div class="chart-left">
        <LineChart title="搜索用户数" count="9999" percent="17.1%" :up-or-down="0" />
      </div>
      <div class="chart-right">
        <LineChart title="人均搜索次数" count="888" percent="26.2%" :up-or-down="1" />
      </div>
    </div>
    <div class="table">
      <el-table style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column align="center" prop="prop" label="搜索关键字" width="width" />
        <el-table-column align="center" prop="prop" label="用户数" width="width" />
        <el-table-column align="center" prop="prop" label="周涨幅" width="width" />
      </el-table>
    </div>
    <el-pagination style="text-align: right" layout="prev, pager, next" :total="50" />
  </el-card>
</template>

<script>
import LineChart from './LineChart'
export default {
  name: 'Search',
  components: {
    LineChart
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
}
.charts {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 200px;

  .chart-left {
    width: 50%;
    height: 50px;
  }
  .chart-right {
    width: 50%;
    height: 50px;
  }
}
</style>
