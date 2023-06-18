import request from "@/utils/request";
import type { RoleResponseData,RoleData } from "./type";

enum API {
    ALLUSERLIST_URL = '/admin/acl/role/',
    //添加职位
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATEROLE_URL = '/admin/acl/role/update'
}

export const reqAllRoleList = (page:number,limit:number,role:string) => request.get<any,RoleResponseData>(API.ALLUSERLIST_URL+`${page}/${limit}/?roleName=${role}`)
export const reqAddOrUpdateRole = (data:RoleData) =>{
    if (data.id) {
        return request.put<any, any>(API.UPDATEROLE_URL, data)
      } else {
        return request.post<any, any>(API.ADDROLE_URL, data)
      }
}