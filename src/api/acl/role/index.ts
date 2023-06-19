import request from "@/utils/request";
import type { RoleResponseData,RoleData,MenuResponseData } from "./type";

enum API {
    ALLUSERLIST_URL = '/admin/acl/role/',
    //添加职位
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATEROLE_URL = '/admin/acl/role/update',
    //获取全部菜单与按钮的数据
    ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
    //给相应的职位分配全新啊
    SETPERMUSSION_URL= '/admin/acl/permission/doAssign',
    //删除已有角色
    DELETEROLE_URL = '/admin/acl/role/remove/'

}

export const reqAllRoleList = (page:number,limit:number,role:string) => request.get<any,RoleResponseData>(API.ALLUSERLIST_URL+`${page}/${limit}/?roleName=${role}`)
export const reqAddOrUpdateRole = (data:RoleData) =>{
    if (data.id) {
        return request.put<any, any>(API.UPDATEROLE_URL, data)
      } else {
        return request.post<any, any>(API.ADDROLE_URL, data)
      }
}
export const reqAllMenuList = (roleId:number) => request.get<any,MenuResponseData>(API.ALLPERMISSION_URL+roleId)
export const reqSetPermission = (id:number,permissionid:number[]) => request.post<any,any>(API.SETPERMUSSION_URL+`/?roleId=${id}&permissionId=${permissionid}`)
export const reqDeleteRole = (id:number) => request.delete<any,any>(API.DELETEROLE_URL+id)