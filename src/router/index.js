import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/Login.vue'
import Home from '../pages/home/Home.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      // 表示该组件不在侧边栏显示
      hidden: true
    },
    {
      path: '/home',
      name: '主页',
      component: Home,
      hidden: true,
      meta: {
        requireAuth: true
      }
    }
  ]
})
