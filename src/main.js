// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import store from './store'
import moment from 'moment'
import 'moment/locale/zh-cn'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

moment.locale('zh-cn')
Vue.config.productionTip = false
Vue.prototype.$Axios = Axios
Vue.prototype.$moment = moment // 赋值使用
Vue.prototype.API1 = '' // 为api的时候存在代理

Vue.use(VueQuillEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
