<template>
  <el-form :model="cForm" label-width="80px" inline>
    <el-form-item label="一级分类">
      <el-select v-model="cForm.category1id" :disabled="!isShowTable" placeholder="请选择" @change="handler1">
        <el-option v-for="(c1, index) in c1List" :key="index" :label="c1.name" :value="c1.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="cForm.category2id" :disabled="!isShowTable" placeholder="请选择" @change="handler2">
        <el-option v-for="(c2, index) in c2List" :key="index" :label="c2.name" :value="c2.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="cForm.category3id" :disabled="!isShowTable" placeholder="请选择" @change="handler3">
        <el-option v-for="(c3, index) in c3List" :key="index" :label="c3.name" :value="c3.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    isShowTable: { type: Boolean, default: true }
  },
  data() {
    return {
      cForm: {
        category1id: '',
        category2id: '',
        category3id: ''
      },
      c1List: [],
      c2List: [],
      c3List: []
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const res = await this.$http.attr.reqCategory1()
      if (res.code === 200) this.c1List = res.data
      else this.$message.error('获取数据失败！')
    },
    async handler1() {
      this.cForm.category2id = ''
      this.cForm.category3id = ''
      this.c2List = []
      this.c3List = []
      this.$emit('getCategoryId', { categoryId: this.cForm.category1id, level: 1 })
      const res = await this.$http.attr.reqCategory2(this.cForm.category1id)
      if (res.code === 200) this.c2List = res.data
      else this.$message.error('获取数据失败！')
    },
    async handler2() {
      this.cForm.category3id = ''
      this.c3List = []
      this.$emit('getCategoryId', { categoryId: this.cForm.category2id, level: 2 })
      const res = await this.$http.attr.reqCategory2(this.cForm.category2id)
      if (res.code === 200) this.c3List = res.data
      else this.$message.error('获取数据失败！')
    },
    handler3() {
      this.$emit('getCategoryId', { categoryId: this.cForm.category3id, level: 3 })
    }
  }
}
</script>

<style lang="scss" scoped></style>
