//创建vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes.ts'

//创建路由器
let router = createRouter({
  // 配置路由模式hash，需要引入createWebHashHistory
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为 - 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
