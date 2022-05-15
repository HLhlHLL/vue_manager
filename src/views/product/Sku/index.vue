<template>
  <div class="sku-container">
    <el-table :data="skuList" style="width: 100%" border stripe>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" align="center" />
      <el-table-column prop="skuDesc" label="描述" width="width" align="center" />
      <el-table-column label="默认图片" width="width" align="center">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="width" align="center" />
      <el-table-column prop="price" label="价格" width="width" align="center" />
      <el-table-column label="操作" width="300" align="center">
        <template #default="{ row }">
          <el-button v-if="row.isSale === 0" type="success" icon="el-icon-sort-up" size="mini" @click="onSale(row)" />
          <el-button v-else type="success" icon="el-icon-sort-down" size="mini" @click="cancelSale(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message.info('开发中...')" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-popconfirm :title="`确定删除${row.skuName}吗？`" style="margin-left: 10px" @onConfirm="removeSkuById(row)">
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      :current-page="queryInfo.page"
      :page-sizes="[5, 7, 10]"
      :page-size="queryInfo.limit"
      layout="prev, pager, next, jumper, -> ,total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 商品详情 -->
    <el-drawer title="我是标题" :visible.sync="drawer" :before-close="handleClose" size="40%">
      <el-row :gutter="10">
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ sku.skuName }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ sku.skuDesc }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ sku.price }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag v-for="(tag, index) in sku.skuSaleAttrValueList" :key="index" type="success">{{ tag.saleAttrValueName }}</el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="500px" width="500px" trigger="click">
            <el-carousel-item v-for="(img, index) in sku.skuImageList" :key="index">
              <img :src="img.imgUrl" alt="" style="width: 500px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      skuList: [],
      queryInfo: {
        page: 1,
        limit: 5
      },
      total: 0,
      sku: {},
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList() {
      const res = await this.$http.sku.reqSkuList(this.queryInfo)
      if (res.code === 200) {
        this.skuList = res.data.records
        this.total = res.data.total
      } else this.$message.error('获取Sku列表失败！')
    },
    handleSizeChange(limit) {
      this.queryInfo.limit = limit
      this.getSkuList()
    },
    handleCurrentChange(page) {
      this.queryInfo.page = page
      this.getSkuList()
    },
    // 商品上架按钮的回调
    async onSale(row) {
      row.isSale = 1
      const res = await this.$http.sku.reqSale(row.id)
      if (res.code === 200) {
        this.$message.success('商品上架成功！')
      } else {
        this.$message.error('商品上架失败！')
      }
    },
    // 商品下架按钮的回调
    async cancelSale(row) {
      row.isSale = 0
      const res = await this.$http.sku.reqCancelSale(row.id)
      if (res.code === 200) {
        this.$message.success('商品下架成功！')
      } else {
        this.$message.error('商品下架失败！')
      }
    },
    // 获取Sku详情按钮的回调
    async getSkuInfo(row) {
      this.drawer = true
      const res = await this.$http.sku.reqSkuById(row.id)
      if (res.code === 200) {
        this.sku = res.data
      } else {
        this.$message.error('获取Sku失败！')
      }
    },
    // 关闭商品详情前的回调
    handleClose(done) {
      this.sku = {}
      done()
    },
    // 删除Sku信息
    async removeSkuById(row) {
      const res = await this.$http.sku.reqRemoveSkuById(row.id)
      if (res.code === 200) {
        this.$message.success('删除Sku信息成功！')
        if (this.skuList.length === 1) {
          this.queryInfo.page = this.queryInfo.page > 1 ? this.queryInfo.page - 1 : 1
        }
        this.getSkuList()
      } else {
        this.$message.error('删除Sku信息失败！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-col {
  margin: 10px 0;
}
.el-col-5 {
  height: 35px;
  line-height: 35px;
  font-size: 20px;
  font-weight: bold;
  text-align: right;
}
.el-col-16 {
  height: 35px;
  line-height: 35px;
}
</style>
<style>
.el-carousel__button {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: rgba(238, 99, 7, 0.616);
}
</style>
