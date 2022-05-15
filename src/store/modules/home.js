// import mockRequest from '@/utils/mockRequest'
import data from '/mock/data.json'

const state = {
  data: {}
}
const mutations = {
  GETDATA(state, data) {
    state.data = data
  },
  CLAERDATA(state) {
    state.data = {}
  }
}
const actions = {
  getData({ commit }) {
    commit('GETDATA', data)
  },
  clearData({ commit }) {
    commit('CLAERDATA')
  }
}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
