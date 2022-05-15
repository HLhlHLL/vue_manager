<template>
  <div class="spuForm-container">
    <el-form ref="spuFormRef" :model="spu" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm, index) in tradeMarkList" :key="index" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU品牌描述">
        <el-input v-model="spu.description" type="textarea" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndName" :placeholder="placeholder" :disabled="unSelectedSaleAttr.length === 0">
          <el-option
            v-for="(unSelectAttr, index) in unSelectedSaleAttr"
            :key="index"
            :label="unSelectAttr.name"
            :value="`${unSelectAttr.id}:${unSelectAttr.name}`"
          />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px" :disabled="!attrIdAndName" @click="addSaleAttr">
          添加销售属性
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="spu.spuSaleAttrList" style="width: 100%" border stripe>
      <el-table-column type="index" align="center" label="序号" width="80" />
      <el-table-column prop="saleAttrName" align="center" label="属性名" width="width" />
      <el-table-column align="center" label="属性值名称列表" width="width">
        <template #default="{ row }">
          <el-tag
            v-for="(tag, index) in row.spuSaleAttrValueList"
            :key="index"
            closable
            :disable-transitions="false"
            @close="handleClose(row, index)"
          >
            {{ tag.saleAttrValueName }}
          </el-tag>
          <el-input
            v-if="row.inputVisible"
            ref="saveTagInput"
            v-model="row.inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(row)"
            @blur="handleInputConfirm(row)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ 添加</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template #default="{ $index }">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr($index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" :disabled="!(spu.spuName && spu.description)" @click="submitSpuInfo">保存</el-button>
    <el-button @click="cancelSubmit">取消</el-button>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: []
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndName: ''
    }
  },
  computed: {
    // 未选中的属性列表
    unSelectedSaleAttr() {
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => item.name !== item1.saleAttrName)
      })
    },
    placeholder() {
      return this.unSelectedSaleAttr.length > 0 ? `还有${this.unSelectedSaleAttr.length}项未选中` : '没有未选中属性'
    }
  },
  methods: {
    // 初始化修改表单中的数据
    async initSpuData(spu) {
      const res1 = await this.$http.spu.reqSpu(spu.id)
      if (res1.code === 200) this.spu = res1.data

      const res2 = await this.$http.spu.reqTradeMarkList()
      if (res2.code === 200) this.tradeMarkList = res2.data

      const res3 = await this.$http.spu.reqSpuImageList(spu.id)
      if (res3.code === 200) {
        const imgList = res3.data
        imgList.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = imgList
      }

      const res4 = await this.$http.spu.reqBaseSaleAttrList()
      if (res4.code === 200) this.saleAttrList = res4.data
    },
    // 添加Spu信息的回调
    async initBaseSpuData(category3Id) {
      this.spu.category3Id = category3Id
      const res1 = await this.$http.spu.reqTradeMarkList()
      if (res1.code === 200) this.tradeMarkList = res1.data
      const res2 = await this.$http.spu.reqBaseSaleAttrList()
      if (res2.code === 200) this.saleAttrList = res2.data
    },
    // 图片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    // 删除图片的回调
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 删除标签时的回调
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 点击添加标签按钮的回调
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 当文本框失去焦点或按下回车后的回调
    handleInputConfirm(row) {
      row.inputValue = row.inputValue.trim()
      if (row.inputValue === '') return this.$message.warning('属性名称不能为空!')
      const isRepeat = row.spuSaleAttrValueList.some((item) => row.inputValue === item.saleAttrValueName)
      if (isRepeat) {
        row.inputVisible = false
        row.inputValue = ''
        return this.$message.warning('属性名不能重复!')
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.inputValue
      })
      row.inputVisible = false
    },
    // 添加属性按钮的回调
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(':')
      const newAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newAttr)
      this.attrIdAndName = ''
    },
    // 删除属性按钮的回调
    removeAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1)
    },
    // 提交Spu信息
    async submitSpuInfo() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          // 已经存在的图片列表和新上传的图片都有name属性
          imgName: item.name,
          // 已经存在的图片列表和新上传的图片都有url属性,但是新上传的图片的是本地地址,而真实的服务器地址在response的data属性中
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      const res = await this.$http.spu.reqAddOrUpdateSpuAttr(this.spu)
      if (res.code === 200) {
        this.$message.success('保存成功!')
        this.$emit('changeScene', 0)
      }
      // 清空表单中的数据
      // _data Vue实例中的响应式数据, $options.data() Vue中的data结构
      Object.assign(this._data, this.$options.data())
    },
    // 取消提交的回调
    cancelSubmit() {
      this.$emit('changeScene', 0)
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
