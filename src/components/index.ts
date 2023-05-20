//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'

//全局对象
const allGlobalComponent = { SvgIcon, Pagination }

//对外暴露插件对象
export default {
  //必须要叫install方法
  install(app) {
    //注册项目的全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      //注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
  },
}
