<template>
  <div class="trademark-container">
    <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
    <el-table :data="list" border stripe>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column label="品牌名称" prop="tmName" align="center" />
      <el-table-column label="品牌logo" align="center">
        <template #default="{ row }">
          <img :src="row.logoUrl" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template #default="{ row }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="editTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeTradeMark(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout=" prev, pager, next, sizes, ->, total, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加商品信息对话框 -->
    <el-dialog :title="!tmForm.id ? '添加品牌' : '修改品牌'" :visible.sync="dialogVisible" width="30%">
      <el-form ref="tmFormRef" :model="tmForm" :rules="tmFormRule" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="tmName">
          <el-input v-model="tmForm.tmName" />
        </el-form-item>
        <el-form-item label="品牌logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitTradeMark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogVisible: false,
      tmForm: {
        logoUrl: '',
        tmName: ''
      },
      tmFormRule: {
        tmName: [
          { required: true, message: '请输入品牌名称！', trigger: 'blue' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: { required: true, message: '请上传图片！' }
      }
    }
  },
  mounted() {
    this.getTradeMark()
  },
  methods: {
    async getTradeMark(pager = 1) {
      this.page = pager
      const res = await this.$http.trademark.reqTradeMark({ page: this.page, limit: this.limit })
      if (res.code === 200) {
        this.list = res.data.records
        this.total = res.data.total
      } else {
        this.$message.error('获取品牌列表失败！')
      }
    },
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getTradeMark()
    },
    handleCurrentChange(pageNum) {
      this.getTradeMark(pageNum)
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    cancelSubmit() {
      this.dialogVisible = false
      this.$refs.tmFormRef.resetFields()
    },
    submitTradeMark() {
      this.$refs.tmFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (res.code === 200) {
            if (!this.tmForm.id) {
              this.$message.success('上传成功！')
            } else {
              this.$message.success('修改成功！')
            }
            this.$refs.tmFormRef.resetFields()
            this.getTradeMark()
            this.dialogVisible = false
          } else {
            if (!this.tmForm.id) {
              this.$message.error('上传失败！')
            } else {
              this.$message.error('修改失败！')
            }
          }
        }
      })
    },
    async editTradeMark(row) {
      this.dialogVisible = true
      this.tmForm = { ...row }
    },
    removeTradeMark(id) {
      this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.trademark.reqRemoveTradeMark(id)
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.getTradeMark(this.list.length > 1 ? this.page : this.page - 1)
          } else {
            this.$message.error('删除失败！')
          }
        })
        .catch(() => this.$message.info('已取消删除！'))
    }
  }
}
</script>

<style lang="scss" scoped>
.trademark-container {
  padding: 10px 0;
}
.el-table {
  margin: 20px 0;
}
.el-table-column {
  text-align: center;
}
.el-pagination {
  text-align: center;
}
</style>
