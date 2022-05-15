import request from '@/utils/request'
// 获取品牌列表
export const reqTradeMark = ({ page, limit }) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)
// 添加/更新品牌信息
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request.put('/admin/product/baseTrademark/update', tradeMark)
  } else {
    return request.post('/admin/product/baseTrademark/save', tradeMark)
  }
}
// 删除品牌信息
export const reqRemoveTradeMark = (id) => request.delete(`/admin/product/baseTrademark/remove/${id}`)
