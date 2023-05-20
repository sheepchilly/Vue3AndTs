//用户信息小仓库

import {defineStore} from 'pinia'
//创建用户小仓库
let useUserStore = defineStore('User',{
    // 存储数据
    state:()=>{
        return{
            num:1
        }
    },
    // 异步|逻辑 
    actions:{

    },
    //计算属性
    getters:{

    }
})

//对外暴露获取小仓库的方法
export default useUserStore;