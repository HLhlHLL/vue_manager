<template>
  <div class="skuForm-container">
    <el-form ref="skuFormRef" :model="skuForm" label-width="80px" style="width: 80%">
      <el-form-item label="SPU名称">
        <el-input v-model="spuName" disabled placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuForm.price" placeholder="价格(元)" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number v-model="skuForm.weight" :min="1" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuForm.skuDesc" type="textarea" placeholder="规格描述" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form label-width="80px" inline>
          <el-form-item v-for="(attr, index) in spuAttrInfoList" :key="index" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="(attrValue, index1) in attr.attrValueList"
                :key="index1"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form label-width="80px" inline>
          <el-form-item v-for="(saleAttr, index) in spuSaleAttrList" :key="index" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="(saleAttrValue, index1) in saleAttr.spuSaleAttrValueList"
                :key="index1"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table ref="multipleTable" :data="spuImageList" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" align="center" />
          <el-table-column label="图片" width="width" align="center">
            <template #default="{ row }">
              <img style="width: 100px" :src="row.imgUrl" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button v-show="row.isDefault === 0" type="primary" size="mini" @click="setDefault(row)">设为默认</el-button>
              <el-button v-show="row.isDefault === 1" type="success" size="mini">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <el-button type="primary" @click="submitSkuInfo">保存</el-button>
          <el-button @click="cancelSubmit">取消</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      skuForm: {
        category3Id: 0,
        spuId: 0,
        tmId: '',
        price: 0,
        skuName: '',
        skuDefaultImg: '',
        skuDesc: '',
        weight: '',
        skuImageList: [],
        skuAttrValueList: [],
        skuSaleAttrValueList: []
      },
      spuName: '',
      spuImageList: [],
      spuAttrInfoList: [],
      spuSaleAttrList: [],
      imageList: []
    }
  },
  methods: {
    async initSkuData(spu, categoryId) {
      this.spuName = spu.spuName
      this.skuForm.category3Id = spu.category3Id
      this.skuForm.spuId = spu.id
      this.skuForm.tmId = spu.tmId
      const res1 = await this.$http.spu.reqSpuImageList(spu.id)
      if (res1.code === 200) {
        const list = res1.data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }

      const res2 = await this.$http.spu.reqSpuSaleAttrList(spu.id)
      if (res2.code === 200) this.spuSaleAttrList = res2.data

      const res3 = await this.$http.spu.reqAttrInfoList(categoryId)
      if (res3.code === 200) this.spuAttrInfoList = res3.data
    },
    // 勾选图片时的回调
    handleSelectionChange(selection) {
      this.imageList = selection
    },
    // 设置默认图片按钮的回调
    setDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuDefaultImg = row.imgUrl
      // 点击设置为默认图片同时时勾选当前图片
      this.$refs.multipleTable.toggleRowSelection(row, true)
    },
    // 取消提交
    cancelSubmit() {
      this.$emit('changeScene1', 0)
      Object.assign(this._data, this.$options.data())
    },
    // 提交参数
    async submitSkuInfo() {
      // 整理参数
      this.skuForm.skuAttrValueList = this.spuAttrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      this.skuForm.skuSaleAttrValueList = this.spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      this.skuForm.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      const res = await this.$http.spu.reuSubmitSkuInfo(this.skuForm)
      if (res.code === 200) {
        this.$message.success('添加SKU成功!')
        this.$emit('changeScene1', 0)
      }
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style lang="scss" scoped></style>
