import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      userface: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userface,
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
      roles: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).roles
    },
    routes: [],
    nfDot: false
  },
  mutations: {
    login(state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    initMenu(state, menus) {
      state.routes = menus
    },
    logout(state) {
      window.localStorage.removeItem('user')
      /**
       * state.routes 作用：
       *     它主要用于记录当前用户所能访问的菜单资源。
       *     在 “全局路由导航卫士” 中将通过对该对象的判断：
       *     若为空，则可以判定某个请求是按F5刷新或直接在地址栏输入地址访问的，需要请求当前用户所能访问的菜单资源；
       *     若不为空，则表明是正常跳转的，不需要重新请求菜单资源。
       *     当我们注销登录时，需要该对象置空，表明所有的请求都需要重新请求菜单资源！
       */
      state.routes = []
    }
  },
  actions: {

  }
})
