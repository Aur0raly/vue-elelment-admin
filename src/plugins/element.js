import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui' // 按需导入组件

Vue.prototype.$message = Message // 使用prototype挂载Message组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
