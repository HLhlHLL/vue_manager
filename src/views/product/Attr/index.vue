<template>
  <div class="attr-container">
    <!-- 三级联动 -->
    <el-card>
      <CategorySelect :is-show-table="isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <!-- 商品分类数据表 -->
    <el-card>
      <!-- 商品属性表格 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.category3Id" @click="showAddTable">添加属性</el-button>
        <el-table :data="attrList" style="width: 100%" border stripe>
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="width" align="center" />
          <el-table-column label="属性名称" width="width" align="center">
            <template #default="{ row }">
              <el-tag v-for="(attrValue, index) in row.attrValueList" :key="index" type="success">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template #default="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr(row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加/修改商品属性表格 -->
      <div v-show="!isShowTable">
        <el-form :model="attrInfo" inline>
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名称" clearable @clear="clearAttrTable" />
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        </el-form>
        <el-table :data="attrInfo.attrValueList" style="width: 100%" stripe border>
          <el-table-column type="index" label="序号" width="280" align="center" />
          <el-table-column label="属性值" width="width" align="center">
            <template #default="{ row, $index }">
              <el-input
                v-show="row.isShowInput"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                @blur="showSpan(row)"
                @keyup.native.enter="showSpan(row)"
              />
              <span v-show="!row.isShowInput" style="display: block" @click="showInput(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template #default="{ row, $index }">
              <el-popconfirm :title="`确认删除${row.valueName}吗？`" @onConfirm="removeAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      attrForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      category1List: [],
      category2List: [],
      category3List: [],
      attrList: [],
      isShowTable: true,
      attrInfo: {
        valueName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
        id: ''
      }
    }
  },
  methods: {
    // 获取属性列表
    async getAttrList() {
      const res = await this.$http.attr.reqAttrList(this.attrForm)
      if (res.code === 200) this.attrList = res.data
      else this.$message.error('获取分类列表失败！')
    },
    // 获取三级分类相应的id
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.attrForm.category1Id = categoryId
        this.attrForm.category2Id = ''
        this.attrForm.category3Id = ''
      } else if (level === 2) {
        this.attrForm.category2Id = categoryId
        this.attrForm.category3Id = ''
      } else {
        this.attrForm.category3Id = categoryId
        this.getAttrList()
      }
    },
    // 打开添加属性表格
    showAddTable() {
      // 每次打开前先清空表格中的数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.attrForm.category3Id,
        categoryLevel: 3,
        id: ''
      }
      this.isShowTable = false
    },
    // 修改属性
    editAttr(row) {
      this.isShowTable = false
      this.isShowInput = false
      this.attrInfo = JSON.parse(JSON.stringify(row))
      // 由于点击编辑按钮时并没有设置自定义属性，所以需要手动添加，并且在添加时需要使用到$set方法，将自定义属性添加为响应式数据
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, 'isShowInput', false)
      })
    },
    // 添加属性值
    addAttrValue() {
      this.isShowInput = true
      const hasEmpty = this.attrInfo.attrValueList.some((item) => item.valueName === '')
      if (hasEmpty) return
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        // 自定义属性，用于判断输入框的显示与隐藏
        isShowInput: true
      })
      // 当点击添加按钮后自动为最后一个输入框获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    showSpan(row) {
      row.valueName = row.valueName.trim()
      if (row.valueName === '') {
        return this.$message.error('请输入正确的属性值！')
      }
      // 判断输入值是否重复
      const isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 当遍历到不是自身的时候
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepeat) {
        return this.$message.warning('不能输入重复的属性值！')
      }
      row.isShowInput = false
    },
    showInput(row, index) {
      row.isShowInput = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 删除属性值
    removeAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    clearAttrTable() {
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.attrForm.category3Id,
        categoryLevel: 3,
        id: ''
      }
    },
    // 添加/修改属性
    async addOrUpdateAttr() {
      // 将attrInfo中的空值过滤并删除自定义属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName !== '') {
          delete item.isShowInput
          return true
        }
      })
      const res = await this.$http.attr.reqAddOrUpdateAttr(this.attrInfo)
      if (res.code === 200) {
        this.isShowTable = true
        this.getAttrList()
        this.$message.success('保存成功！')
      } else this.$message.error('保存失败！')
    },
    async removeAttr(id) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.attr.reqRemoveAttr(id)
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.getAttrList()
          } else {
            this.$message.error('删除失败！')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除！')
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
