<template>
  <el-card>
    <div slot="header" class="header">
      <span>销售额类别占比</span>
      <el-button-group>
        <el-button type="primary" size="mini">全部渠道</el-button>
        <el-button size="mini">线上</el-button>
        <el-button size="mini">门店</el-button>
      </el-button-group>
    </div>
    <div class="chart">
      <PieChart />
    </div>
  </el-card>
</template>

<script>
import PieChart from './PieChart'
export default {
  name: 'Category',
  components: {
    PieChart
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
.chart {
  width: 100%;
  height: 360px;
}
</style>
