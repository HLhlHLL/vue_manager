<template>
  <div class="spu-container">
    <!-- 三级联动 -->
    <el-card>
      <CategorySelect :is-show-table="scene === 0" @getCategoryId="getCategoryId" />
    </el-card>
    <!-- Spu列表 -->
    <el-card>
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!queryInfo.category3Id" @click="addSpu">添加SPU</el-button>
        <el-table :data="spuList" border stripe>
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="spuName" label="spu名称" align="center" />
          <el-table-column prop="description" label="spu描述" align="center" />
          <el-table-column prop="" label="操作" width="300" align="center">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" content="添加SKU" placement="top" :enterable="false">
                <el-button type="success" icon="el-icon-plus" size="mini" @click="addSku(row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改SPU" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="editSpu(row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看当前SPU全部SKU列表" placement="top" :enterable="false">
                <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuList(row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除SPU" placement="top" :enterable="false" style="margin-left: 10px">
                <el-popconfirm :title="`确定删除${row.spuName}吗?`" @onConfirm="removeSpu(row.id)">
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="queryInfo.page"
          :page-sizes="[3, 5, 7]"
          :page-size="queryInfo.limit"
          layout="prev, pager, next, jumper, -> ,total, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <SpuForm v-show="scene === 1" ref="spuRef" @changeScene="changeScene" />
      <SkuForm v-show="scene === 2" ref="skuRef" @changeScene1="changeScene1" />
    </el-card>

    <!-- Sku列表对话框 -->
    <el-dialog :title="`${spu.spuName}的Sku列表`" :visible.sync="dialogVisible" width="30%" :before-close="beforeDialogClose">
      <el-table v-loading="loading" :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="width" align="center" />
        <el-table-column prop="price" label="价格" width="width" align="center" />
        <el-table-column prop="weight" label="重量" width="width" align="center" />
        <el-table-column label="默认图片" width="width" align="center">
          <template #default="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name: 'Spu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      spuForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      queryInfo: {
        page: 1,
        limit: 3,
        category3Id: ''
      },
      total: 0,
      spuList: [],
      scene: 0, // 0: 默认显示spu列表 1: 显示添加/修改spu 2: 显示添加sku
      dialogVisible: false,
      skuList: [],
      spu: {},
      loading: true
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.spuForm.category1Id = categoryId
        this.spuForm.category2Id = ''
        this.spuForm.category3Id = ''
      } else if (level === 2) {
        this.spuForm.category2Id = categoryId
        this.spuForm.category3Id = ''
      } else {
        this.spuForm.category3Id = categoryId
        this.queryInfo.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList() {
      const res = await this.$http.spu.reqSpuList(this.queryInfo)
      if (res.code === 200) {
        this.spuList = res.data.records
        this.total = res.data.total
      } else this.$message.error('获取Spu数据失败！')
    },
    handleSizeChange(limit) {
      this.queryInfo.limit = limit
      this.getSpuList()
    },
    handleCurrentChange(page) {
      this.queryInfo.page = page
      this.getSpuList()
    },
    // 添加Spu按钮的回调
    addSpu() {
      this.scene = 1
      this.$refs.spuRef.initBaseSpuData(this.queryInfo.category3Id)
    },
    // 编辑Spu按钮的回调
    editSpu(row) {
      this.scene = 1
      this.$refs.spuRef.initSpuData(row)
    },
    changeScene(scene) {
      this.scene = scene
      this.getSpuList()
    },
    changeScene1(scene) {
      this.scene = scene
    },
    // 删除按钮的回调
    async removeSpu(id) {
      const res = await this.$http.spu.reqRemoveSpu(id)
      if (res.code === 200) this.$message.success('删除成功!')
      else this.$message.error('删除失败!')
      // 当前页面没有数据则获取前一页数据
      this.spuList.length === 1 && (this.queryInfo.page > 1 ? this.queryInfo.page-- : (this.queryInfo.page = 1))
      this.getSpuList()
    },
    // 添加Sku
    addSku(row) {
      this.scene = 2
      this.$refs.skuRef.initSkuData(row, this.spuForm)
    },
    // 获取Sku信息按钮的回调
    async getSkuList(row) {
      this.dialogVisible = true
      this.spu = row
      const res = await this.$http.spu.reqSkuById(row.id)
      if (res.code === 200) {
        this.skuList = res.data
        this.loading = false
      } else this.$message.error('获取Sku列表失败！')
    },
    beforeDialogClose(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>

<style lang="scss" scoped></style>
