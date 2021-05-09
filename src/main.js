import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fontIcons/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})

Vue.config.productionTip = false
// 注册富文本编辑器
Vue.use(VueQuillEditor)
// 时间全局过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + ' ').padStart(2, '0')
  const d = (dt.getDate() + ' ').padStart(2, '0')
  const hh = (dt.getHours() + ' ').padStart(2, '0')
  const mm = (dt.getMinutes() + ' ').padStart(2, '0')
  const ss = (dt.getSeconds() + ' ').padStart(2, '0')
  return `${y}年${m}月${d}  ${hh}: ${mm}: ${ss}`
})

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
