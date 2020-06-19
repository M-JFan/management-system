// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import elementUi from 'element-ui'
import Vuex from 'vuex'
import store from './store/index'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import './common/reset.css'
import './common/common.css'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(elementUi)
Vue.use(Vuex)

// 页面刷新时，重新赋值token
if (localStorage.getItem('user_token')) {
  store.commit('setToken', localStorage.getItem('user_token'))
}

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.matched.some(r => r.meta.requireAuth)) {           //这里的requireAuth为路由中定义的 meta:{requireAuth:true}，意思为：该路由添加该字段，表示进入该路由需要登陆的
    
  if (store.state.token) {
      next();
    }
    else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  else {
    next();
  }
})
axios.defaults.headers.common['Authorization'] = store.state.token;
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
