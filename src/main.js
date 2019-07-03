import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
// 引入字体库
import 'font-awesome/css/font-awesome.min.css'

// 引入 Element-Ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入封装的请求
import {getRequest, getRequestWithParams, postRequest, postRequestByForm, deleteRequest, putRequest, uploadFileRequest} from './utils/api'
//注入到vue对象，在项目可直接使用
Vue.prototype.getRequest = getRequest
Vue.prototype.getRequestWithParams = getRequestWithParams
Vue.prototype.postRequest = postRequest
Vue.prototype.postRequestByForm = postRequestByForm
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.uploadFileRequest = uploadFileRequest

import {initMenu} from './utils/utils'

// 引入全局过滤器
import './utils/filter_utils'


Vue.config.productionTip = false
/**
 * 问题：为什么在这里使用“路由导航卫视”？
 * 原因：
 *     这个问题的核心就在于“数据请求时机”。
 *     可能会有小伙伴说这有何难，登录成功之后请求不就可以了吗？是的，登录成功之后，请求菜单资源是可以的，
 * 请求到之后，我们将之保存在store中，以便下一次使用，但是这样又会有另外一个问题，假如用户登录成功之后，
 * 点击某一个子页面，进入到子页面中，然后按了一下F5进行刷新，这个时候就GG了，因为F5刷新之后store中的数
 * 据就没了，而我们又只在登录成功的时候请求了一次菜单资源，要解决这个问题，有两种思路：
 *     1.将菜单资源不要保存到store中，而是保存到localStorage中，这样即使F5刷新之后数据还在；
 *     2.直接在每一个页面的mounted方法中，都去加载一次菜单资源。
 *     由于菜单资源是非常敏感的，因此最好不要不要将其保存到本地，故舍弃方案1，但是方案2的工作量有点大，
 * 因此我采取办法将之简化，采取的办法就是使用路由中的导航守卫。
 * 
 * 补充知识点：
 * 问题：为什么按F5刷新后，store中的数据就没了？
 * 原因：因为 Vue 是单页面应用，它会一次性将所有模块的数据请求好，这样在页面跳转时，将无需再次发起网络请求。
 *       而当我们按F5刷新时，相当于将所有组件重新加载一遍，这样就会重新初始化 store 中 state 数据。
 */
router.beforeEach((to, from, next) => {
  // 若去登录页面，直接过
  if (to.name == 'Login') {
    next()
    return
  }
  /**
   * 若不是去登录页面，先从 store 中获取当前的登录状态：
   * 若未登录，则通过路由的 meta 属性的requireAuth 属性判断要去的页面是否需要登陆：
   *  若需要登录，则跳回登录页面，同时将要去的页面（to.path）作为参数传递给登录页面，以便在登录成功之后跳转到目标页面;
   *  若不需要登录，则直接过（事实上，本项目只有Login页面不需要登录）。
   * 若已经登录了，则先初始化菜单，再跳转。
   */
  var user_name = store.state.user.name;
  if (user_name == '未登录') {
    if (to.meta.requireAuth || to.name == null) {
      next({
        path: '/',
        query: {
          redirect: to.path
        }
      })
    } else {
      next()
    }
  } else {
    initMenu(router, store)
    // 处理聊天逻辑（后面再加）

    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
