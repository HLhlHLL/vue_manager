<template>
  <div class="card-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥88888">
            <template #chart>
              <span>周同比&nbsp;&nbsp;56.67%</span>
              <span>
                <svg
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
              </span>
              <span>日同比&nbsp;&nbsp;19.96%</span>
              <span>
                <svg
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
              </span>
            </template>
            <template #footer>
              <span>日销售额&nbsp;&nbsp;￥&nbsp;12342</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="999999">
            <template #chart>
              <LineChart />
            </template>
            <template #footer>
              <span>日销访问量&nbsp;&nbsp;23564</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88888">
            <template #chart>
              <BarChart />
            </template>
            <template #footer>
              <span>转化率&nbsp;&nbsp;69.85%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template #chart>
              <Progress />
            </template>
            <template #footer>
              <span>周同比&nbsp;&nbsp;12%</span>
              <span>
                <svg
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
              </span>
              <span>日同比&nbsp;&nbsp;11%</span>
              <span>
                <svg
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
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineChart from './LineChart'
import BarChart from './BarChart'
import Progress from './Progress'
export default {
  name: 'Card',
  components: {
    Detail,
    LineChart,
    BarChart,
    Progress
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  padding: 10px;
}
span {
  margin-left: 15px;
}
</style>
