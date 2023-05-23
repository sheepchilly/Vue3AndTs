//对外暴露配置的路由
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录', //菜单标题
      hidden: true, //路由标题在菜单中是否隐藏 true:隐藏 false:不隐藏
      icon:"Promotion", //菜单左侧文字图标，支持elementPlus全部图标
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    redirect:'/home',
    meta: {
      title: 'layout', //菜单标题
      hidden: false,
      icon:"Share",
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页', //菜单标题
          hidden: false,
          icon:"HomeFilled",
        },
      }
    ],
  },
  {
    path:'/screen',
    component:()=>import('@/views/screen/index.vue'),
    name:"Screen",
    meta:{
      hidden:false,
      title:'数据大屏',
      icon:"DataAnalysis"
    }
  },
  {
    path:'/acl',
    component:()=>import('@/layout/index.vue'),
    name:"Acl",
    meta:{
      title:'权限管理',
      hidden:false,
      icon:'Setting'
    },
    children:[
      {
        path:'/acl/user',
        component:()=>import('@/views/acl/user/index.vue'),
        name:"User",
        meta:{
          hidden:false,
          title:'用户管理',
          icon:"User"
        }
      },
      {
        path:'/acl/rule',
        component:()=>import('@/views/acl/rule/index.vue'),
        name:"Rule",
        meta:{
          hidden:false,
          title:'角色管理',
          icon:"CopyDocument"
        }
      },
      {
        path:'/acl/permission',
        component:()=>import('@/views/acl/permission/index.vue'),
        name:"Permission",
        meta:{
          hidden:false,
          title:'菜单管理',
          icon:"MessageBox"
        }
      },
    ]
  },
  {
    path:'/product',
    component:()=>import('@/layout/index.vue'),
    name:"Product",
    meta:{
      hidden:false,
      title:"商品管理",
      icon:'Goods'
    },
    children:[
      {
        path:"/product/trademark",
        component:()=>import('@/views/product/trademark/index.vue'),
        name:"Trademark",
        meta:{
          title:'品牌管理',
          hidden:false,
          icon:"ShoppingCart"
        }
      },
      {
        path:"/product/attr",
        component:()=>import('@/views/product/attr/index.vue'),
        name:"Attr",
        meta:{
          title:'属性管理',
          hidden:false,
          icon:"Tickets"
        }
      },
      {
        path:"/product/spu",
        component:()=>import('@/views/product/spu/index.vue'),
        name:"Spu",
        meta:{
          title:'SPU管理',
          hidden:false,
          icon:"Notification"
        }
      },
      {
        path:"/product/sku",
        component:()=>import('@/views/product/sku/index.vue'),
        name:"Sku",
        meta:{
          title:'SKU管理',
          hidden:false,
          icon:"Connection"
        }
      },
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404', //菜单标题
      hidden: true,
      icon:"Tools",
    },
  },
  {
    path: '/:pathMatch(.*)*', //任意路由匹配：以上路由都没有匹配上时会走这里
    redirect: '/404', //重定向到404页面
    name: 'Any',
    meta: {
      title: '任意路由', //菜单标题
      hidden: true,
      icon:"Tools",
    },
  },
]
