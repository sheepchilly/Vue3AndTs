//账号信息的ts类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//代表一个账号信息的ts类型
export interface User {
    id?: number, 
    "createTime"?: string,
    "updateTime"?: string,
    "username"?: string,
    "password"?: string,
    "name"?: string,
    "phone"?: null,
    "roleName"?: string
}

//包含全部用户信息的数组
export type Records = User[]

//获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
    data:{
        records:Records,
        "total": number,
        "size": number,
        "current": number,
        "pages": number
    }
}

//代表一个职位的ts类型
export interface RoleData {
    id?:number,
    createTime?:string,
    updateTime?:string,
    roleName:string,
    remark?:null
}
//所有的职位列表
export type AllRole = RoleData[]
//获取全部职位的接口返回的Ts类型
export interface AllRoleResponseData extends ResponseData{
    data:{
        assignRoles:AllRole,
        allRolesList:AllRole
    }
}

//给用户分配职位接口携带参数的TS类型
export interface SetRoleData{
    roleIdList:number[],
    userId:number
}