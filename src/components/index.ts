//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
//引入elementPlus提供的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
const allGlobalComponent: any = { SvgIcon, Pagination, Category }

//对外暴露插件对象
export default {
  //必须要叫install方法
  install(app: any) {
    //注册项目的全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      //注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
    //将elementPlus提供的图标注册为全局组件 - [key,component]:解构出组件的名字和相应的组件，把他们注册成全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
