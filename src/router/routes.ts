//对外暴露配置的路由
export const constantRoute = [
    {
        path:'/login',
        component:()=>import('@/views/login/index.vue'),
        name:'login'
    },
    {
        path:'/',
        component:()=>import('@/views/home/index.vue'),
        name:'layout'
    },
    {
        path:'/404',
        component:()=>import('@/views/404/index.vue'),
        name:'404'
    },
    {
        path:'/:pathMatch(.*)*',//任意路由匹配：以上路由都没有匹配上时会走这里
        redirect:'/404', //重定向到404页面
        name:'Any'
    }
]
