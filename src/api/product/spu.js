import request from '@/utils/request'

// 获取Spu列表
export const reqSpuList = ({ page, limit, category3Id }) => request.get(`/admin/product/${page}/${limit}`, { params: { category3Id } })
// 获取Spu信息
export const reqSpu = (spuId) => request.get(`/admin/product/getSpuById/${spuId}`)
// 获取品牌信息
export const reqTradeMarkList = () => request.get('/admin/product/baseTrademark/getTrademarkList')
// 获取Spu图片
export const reqSpuImageList = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`)
// 获取全部销售属性
export const reqBaseSaleAttrList = () => request.get('/admin/product/baseSaleAttrList')
// 新增/修改Spu属性
export const reqAddOrUpdateSpuAttr = (spu) => {
  // 当id属性存在时表示修改
  if (spu.id) {
    return request.post('/admin/product/updateSpuInfo', spu)
  } else {
    return request.post('/admin/product/saveSpuInfo', spu)
  }
}
// 删除Spu
export const reqRemoveSpu = (spuId) => request.delete(`/admin/product/deleteSpu/${spuId}`)
// 获取Spu图片
// export const reqSpuImageList = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`)
// 获取销售属性列表
export const reqSpuSaleAttrList = (spuId) => request.get(`/admin/product/spuSaleAttrList/${spuId}`)
//
export const reqAttrInfoList = ({ category1Id, category2Id, category3Id }) =>
  request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
// 上传Sku数据
export const reuSubmitSkuInfo = (data) => request.post('/admin/product/saveSkuInfo', data)
// 根据SpuId获取Sku信息
export const reqSkuById = (spuId) => request.get(`/admin/product/findBySpuId/${spuId}`)
