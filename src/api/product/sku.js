import request from '@/utils/request'

// 获取Sku列表
export const reqSkuList = ({ page, limit }) => request.get(`/admin/product/list/${page}/${limit}`)
// 商品上架
export const reqSale = (skuId) => request.get(`/admin/product/onSale/${skuId}`)
// 商品下架
export const reqCancelSale = (skuId) => request.get(`/admin/product/cancelSale/${skuId}`)
// 获取Sku详情
export const reqSkuById = (skuId) => request.get(`/admin/product/getSkuById/${skuId}`)
// 删除Sku
export const reqRemoveSkuById = (skuId) => request.delete(`/admin/product/deleteSku/${skuId}`)
