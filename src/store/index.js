import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const userInfo = {} // 登录用户信息
const roleType = 0 // 登陆角色区别
const isLogin = false // 判断是否登录
const mutations = {
  handleUserName: (state, userinfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userinfo))
    state.userInfo = userinfo
    // state.roleType = roleType
    // 把登录的用户的名保存到localStorage中，防止页面刷新，导致vuex重新启动，用户名就成为初始值（初始值为空）的情况
  }
}
const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}
}
const getters = {
  userInfo: (state) => state.userInfo
}
const store = new Vuex.Store({
  userInfo,
  roleType,
  isLogin,
  mutations,
  state,
  getters
})

export default store
