<template>
  <el-card>
    <el-form ref="addFormRef" inline>
      <el-form-item>
        <el-input v-model="queryInfo.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button @click="clearSearch">清空</el-button>
      </el-form-item>
    </el-form>
    <div class="button">
      <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
      <el-button type="danger" :disabled="idList.length === 0" @click="removeUserByIdList">批量删除</el-button>
    </div>
    <el-table ref="multipleTable" :data="userList" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="username" label="用户名" width="width" align="center" />
      <el-table-column prop="nickName" label="用户昵称" width="width" align="center" />
      <el-table-column prop="roleName" label="权限列表" width="width" align="center" />
      <el-table-column prop="gmtCreate" label="创建时间" width="width" align="center" />
      <el-table-column prop="gmtModified" label="更新时间" width="width" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }">
          <el-button type="info" icon="el-icon-user" size="mini" @click="showSetRoleDialog(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserDialog(row)" />
          <el-popconfirm :title="`确定删除${row.username}吗？`" style="margin-left: 10px" @onConfirm="removeUserById(row)">
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryInfo.page"
      :page-sizes="[5, 7, 10]"
      :page-size="queryInfo.limit"
      layout="prev, pager, next, jumper, -> ,total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" :show-close="false">
      <!-- 表单区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRule" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="addForm.nickName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUser">提交</el-button>
          <el-button @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="40%" :show-close="false">
      <!-- 表单区域 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRule" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="editForm.nickName" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="width" :show-close="false">
      <el-form ref="setRoleFormRef" :model="setRoleForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="setRoleForm.username" disabled />
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox :value="allChecked" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0"></div>
          <el-checkbox v-for="(role, index) in setRoleForm.allRolesList" :key="index" v-model="role.isSelected" :label="role.roleName" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelSetRole">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      queryInfo: {
        page: 1,
        limit: 5,
        username: ''
      },
      total: 0,
      userList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      addForm: {
        nickName: '',
        password: '',
        roleName: '',
        username: ''
      },
      addFormRule: {
        username: [
          { required: true, message: '请输入用户名！', trigger: 'blur' },
          { min: 1, max: 16, message: '用户名在 1 ~ 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { min: 6, max: 16, message: '用户名在 1 ~ 16 个字符', trigger: 'blur' }
        ]
      },
      editForm: {
        username: '',
        nickName: ''
      },
      editFormRule: {
        username: [
          { required: true, message: '请输入用户名！', trigger: 'blur' },
          { min: 1, max: 16, message: '用户名在 1 ~ 16 个字符', trigger: 'blur' }
        ]
      },
      setRoleForm: {
        username: '',
        userId: '',
        allRolesList: [],
        assignRoles: []
      },
      idList: []
    }
  },
  computed: {
    // 是否全选
    allChecked() {
      return this.setRoleForm.allRolesList.every((item) => item.isSelected)
    },
    // 半选状态
    isIndeterminate() {
      const allLength = this.setRoleForm.allRolesList.length
      const selectedLength = this.selectedRoleList.length
      if (allLength === selectedLength || selectedLength === 0) {
        return false
      } else {
        return true
      }
    },
    // 选中的角色列表
    selectedRoleList() {
      return this.setRoleForm.allRolesList.filter((item) => item.isSelected)
    },
    // 选中的角色id列表
    roleId() {
      return this.selectedRoleList.reduce((prev, item) => {
        prev.push(item.id)
        return prev
      }, [])
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const res = await this.$http.user.reqUserList(this.queryInfo)
      if (res.code === 20000) {
        this.userList = res.data.items
        this.total = res.data.total
      } else {
        this.$message.error('获取用户列表失败！')
      }
    },
    // 获取选中将要删除的用户列表
    handleSelectionChange(params) {
      this.idList = params.reduce((prev, item) => {
        prev.push(item.id)
        return prev
      }, [])
    },
    handleSizeChange(limit) {
      this.queryInfo.limit = limit
      this.getUserList()
    },
    handleCurrentChange(page) {
      this.queryInfo.page = page
      this.getUserList()
    },
    // 根据用户名搜索用户
    search() {
      this.getUserList()
    },
    // 清空搜索条件
    clearSearch() {
      this.queryInfo.username = ''
      this.getUserList()
    },
    // 添加用户
    async addUser() {
      const res = await this.$http.user.reqAddUser(this.addForm)
      if (res.code === 20000) {
        this.$message.success('添加成功！')
        this.getUserList()
        this.$refs.addFormRef.resetFields()
        this.addDialogVisible = false
      } else this.$message.error('添加失败！')
    },
    // 取消添加
    cancelAdd() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    // 打开编辑用户信息对话框
    showEditUserDialog(row) {
      this.editDialogVisible = true
      this.editForm = JSON.parse(JSON.stringify(row))
    },
    // 提交编辑用户信息
    async editUser() {
      const res = await this.$http.user.reqEditUser(this.editForm)
      if (res.code === 20000) {
        this.$message.success('修改成功！')
        this.editDialogVisible = false
        this.getUserList()
      } else {
        this.$message.error('修改失败！')
      }
    },
    // 根据id删除用户信息
    async removeUserById(row) {
      const res = await this.$http.user.reqRemoveUserById(row.id)
      if (res.code === 20000) {
        this.$message.success('删除成功！')
        this.getUserList()
      } else {
        this.$message.error('删除失败！')
      }
    },
    // 根据id列表删除用户
    removeUserByIdList() {
      this.$confirm('此操作将永久删除这些用户，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.user.reqRemoveUserByIdList(this.idList)
          if (res.code === 20000) {
            this.$message.success('批量删除成功！')
            this.getUserList()
          } else {
            this.$message.error('批量删除失败！')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除！')
        })
    },
    // 根据id获取用户角色列表
    async showSetRoleDialog(row) {
      this.setRoleDialogVisible = true
      const res = await this.$http.user.reqRole(row.id)
      if (res.code === 20000) {
        this.setRoleForm = res.data
        this.setRoleForm.username = row.username
        this.setRoleForm.userId = row.id
        // 为所有角色选项绑定自定义属性，用于判断该项是否被选中
        this.setRoleForm.allRolesList.forEach((item) => {
          // 默认未选中
          this.$set(item, 'isSelected', false)
        })
        this.setRoleForm.assignRoles.forEach((item) => {
          this.setRoleForm.allRolesList.forEach((item1) => {
            if (item.roleName === item1.roleName) {
              item1.isSelected = true
            }
          })
        })
      } else {
        this.$message.error('获取用户角色列表失败！')
      }
    },
    // 全选/取消全选
    handleCheckAllChange(val) {
      this.setRoleForm.allRolesList.forEach((item) => {
        item.isSelected = val
      })
    },
    // 分配角色
    async setRoles() {
      const { userId } = this.setRoleForm
      const roleId = this.roleId.join(',')
      const res = await this.$http.user.reqSetRoles({ userId, roleId })
      if (res.code === 20000) {
        this.setRoleDialogVisible = false
        this.setRoleForm = {
          username: '',
          userId: '',
          allRolesList: [],
          assignRoles: []
        }
        this.getUserList()
        this.$message.success('角色分配成功！')
      } else {
        this.$message.error('分配角色失败！')
      }
    },
    // 取消分配角色
    cancelSetRole() {
      this.setRoleDialogVisible = false
      this.setRoleForm = {
        username: '',
        userId: '',
        allRolesList: [],
        assignRoles: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  margin: 10px 0;
}
.el-dialog {
  .el-input {
    width: 600px;
  }
}
</style>
