import request from '@/utils/request'

// 获取用户列表
export const reqUserList = ({ page, limit, username }) =>
  request.get(`/admin/acl/user/${page}/${limit}`, {
    params: { username }
  })
// 新增用户
export const reqAddUser = (user) => request.post('/admin/acl/user/save', user)
// 编辑用户信息
export const reqEditUser = (user) => request.put('/admin/acl/user/update', user)
// 根据id删除用户信息
export const reqRemoveUserById = (id) => request.delete(`/admin/acl/user/remove/${id}`)
// 根据id列表删除用户信息
export const reqRemoveUserByIdList = (idList) => request.delete('/admin/acl/user/batchRemove', { data: idList })
// 根据id获取用户角色数据
export const reqRole = (userId) => request.get(`/admin/acl/user/toAssign/${userId}`)
// 为用户分配角色
export const reqSetRoles = ({ userId, roleId }) =>
  request({
    url: '/admin/acl/user/doAssign',
    method: 'POST',
    params: {
      userId,
      roleId
    }
  })
