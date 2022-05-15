<template>
  <div class="observe-container">
    <el-row :gutter="10">
      <el-col :span="13">
        <Search />
      </el-col>
      <el-col :span="11">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from './Search'
import Category from './Category'
export default {
  name: 'Observe',
  components: {
    Search,
    Category
  }
}
</script>

<style lang="scss" scoped></style>
