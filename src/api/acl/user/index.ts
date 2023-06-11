//用户管理模块的接口
import request from "@/utils/request";
import type { UserResponseData,User,AllRoleResponseData,SetRoleData } from "./type";

enum API {
    ALLUSER_URL = '/admin/acl/user/',
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    GETUSERROLE_URL = '/admin/acl/user/toAssign/',
    //用户职位修改
    SETROLE_URL = '/admin/acl/user/doAssignRole'
}

export const reqAllUser = (page:number,limit:number)=>request.get<any,UserResponseData>(API.ALLUSER_URL+`${page}/${limit}`)
export const reqADDOrUpdateUser = (data:User) => {
    //携带的参数有id
    if(data.id){
        return request.put<any,any>(API.UPDATEUSER_URL,data)
    }else{
        return request.post<any,any>(API.ADDUSER_URL,data)
    }
}
export const reqGetUserRole = (id:number) => request.get<any,AllRoleResponseData>(API.GETUSERROLE_URL+id)
export const reqSetUserRule = (data:SetRoleData) =>request.post<any,any>(API.SETROLE_URL,data)