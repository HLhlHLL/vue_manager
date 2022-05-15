import request from '@/utils/request'
// 获取一级分类列表
export const reqCategory1 = () => request.get('/admin/product/getCategory1')
// 获取二级分类列表
export const reqCategory2 = (category1Id) => request.get(`/admin/product/getCategory2/${category1Id}`)
// 获取三级分类列表
export const reqCategory3 = (category2Id) => request.get(`/admin/product/getCategory3/${category2Id}`)
// 根据商品分类id获取商品列表
export const reqAttrList = ({ category1Id, category2Id, category3Id }) =>
  request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
// 添加/修改分类信息
export const reqAddOrUpdateAttr = (data) => request.post('/admin/product/saveAttrInfo', data)
// 删除分类属性
export const reqRemoveAttr = (attrId) => request.delete(`/admin/product/deleteAttr/${attrId}`)
