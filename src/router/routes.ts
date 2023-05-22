//对外暴露配置的路由
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta:{
      title:'登录', //菜单标题
      hidden:true, //路由标题在菜单中是否隐藏 true:隐藏 false:不隐藏
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta:{
      title:'layout', //菜单标题
      hidden:false
    },
    children:[
      {
        path:'/home',
        component:()=>import('@/views/home/index.vue'),
        name:'home',
        meta:{
          title:'首页', //菜单标题
          hidden:false
        }
      },
      {
        path:'/ceshi',
        component:()=>import('@/views/home/index.vue'),
        name:'ceshi',
        meta:{
          title:'测试', //菜单标题
          hidden:false
        }
      },
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta:{
      title:'404', //菜单标题
      hidden:true
    }
  },
  {
    path: '/:pathMatch(.*)*', //任意路由匹配：以上路由都没有匹配上时会走这里
    redirect: '/404', //重定向到404页面
    name: 'Any',
    meta:{
      title:'任意路由', //菜单标题
      hidden:true
    }
  },
]
