//定义小仓库state的数据类型


export interface UserState {
    //还没有登录的时候是null，登录成功后是string，所以用联合类型 |
    token:null|string
}