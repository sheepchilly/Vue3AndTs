import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index.ts'
import pinia from '@/store/index.ts'

//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//引入暗黑模式的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

//配置element-plus国际化
//@ts-ignore -> 这句话的意思是忽略语法检查
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

//svg插件需要的配置代码
import 'virtual:svg-icons-register'

//引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components/index.ts'

//引入模板的全局样式
import '@/styles/index.scss'

//引入路由鉴权文件
import './permission'

//引入自定义指令文件
import { isHasButton } from './directive/has'

createApp(App)
  .use(ElementPlus, {
    locale: zhCn, //element-plus国际化的配置
  })
  .use(globalComponent) //使用全局自定义插件
  .use(router)
  .use(pinia)
  .use(isHasButton)
  .mount('#app')
