//路由鉴权 - 某一个路由在什么状态下可以被访问，什么状态下访问不了

import router from '@/router'
import setting from './setting.ts'
//引入进度条样式
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })

//获取用户相关的小仓库中的token数据，去判断用户是否登录成功 - 注意：无法在组件外部直接获取小仓库，需要引入大仓库后再实例化小仓库才可以
import useUserStore from './store/modules/user'
import pinia from './store'
let userStore = useUserStore(pinia)

//全局前置守卫 ：项目当中任意路由切换都会触发的钩子
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.start()
  //获取token，去判断用户登录还是未登录
  let token = userStore.token
  //获取用户名字
  let username = userStore.username
  if (token) {
    //登录成功，用户访问login，不能访问，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功后可以访问除了登录以外的其他路由
      //用用户信息直接放行
      if (username) {
        next()
      } else {
        //没有用户信息就向服务器发请求获取用户信息后再放行
        try {
          await userStore.userInfo()
          next({...to})
        } catch (error) {
          //什么情况下会走catch分支？ 1.token过期，获取不到用户信息 2.用户手动修改本地存储token
          //1.token过期先退出登录 - 把用户信息清空,回到login页面
          await userStore.userLogOut()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      //未登录的情况下在地址栏输入的地址，因为没有token所以去不了，但是会保留用户的输入
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

//全局后置守卫
router.afterEach((to: any, from: any, next: any) => {
  nprogress.done()
})
