import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// import { FormItem } from 'element-ui'

// 导入弹框组件，需要配置全局,这样每一个全局的Vue都可以通过this.my_message 访问
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.prototype.$my_message = Message