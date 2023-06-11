<template>
  <div class="body">
    <el-card style="height:80px;">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input placeholder="请输入用户名称" v-model="username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top:10px;">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button type="danger">批量删除</el-button>

      <el-table :data="userArr" border style="margin: 10px 0;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="id" align="center" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名字" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="270" align="center">
          <template #="{ row }">
            <el-button size="small" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-button size="small" icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :page-count="totalPage" v-model:current-page="pageNo" v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]" :background="true" layout="prev,pager,next,jumper,->,sizes,total" :total="total"
        @current-change="getHasUser" @size-change="handler" prev-text="上一页" next-text="下一页" />
    </el-card>

    <!-- 抽屉：新增用户 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ UserParams.id ? '更新用户信息' : '添加用户信息' }}</h4>
      </template>
      <template #default>
        <el-form ref="userForm" :model="UserParams" :rules="rules">
          <el-form-item label="用户姓名" prop="username">
            <el-input type="text" placeholder="请填写用户名字" v-model="UserParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input type="text" placeholder="请填写用户昵称" v-model="UserParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!UserParams.id">
            <el-input type="text" placeholder="请填写用户密码" v-model="UserParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 抽屉：已有的账号进行角色的分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配用户角色</h4>
      </template>
      <template #default="{ row }">
        <el-form :model="UserParams" >
          <el-form-item label="用户姓名">
            <el-input type="text" v-model="UserParams.username" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="角色列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handlerCheckAllChange">Check all</el-checkbox>
            <el-checkbox-group v-model="userRole" @change="handleCheckedRoleChange">
              <el-checkbox v-for="(role,index) in allRolesList" :key="index" :label="role">{{  role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="saveClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, nextTick } from 'vue'
import { reqAllUser, reqADDOrUpdateUser,reqGetUserRole,reqSetUserRule } from '@/api/acl/user/index.ts'
import type { UserResponseData, Records, User,SetRoleData } from '@/api/acl/user/type.ts'
import { ElMessage } from 'element-plus';

const username = ref<string>('')
const userArr = ref<Records>([])
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let drawer = ref<boolean>(false)
//收集用户信息
let UserParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
let userForm = ref<any>(null)
let drawer1 = ref<boolean>(false)
//已有职位
let allRolesList = ref<any>([])
//全选复选框是否全选
let checkAll = ref<boolean>(false)
let userRole = ref<any>([])
//设置不确定状态，仅负责样式控制
let isIndeterminate = ref<boolean>(true)

let totalPage = computed(() => {
  if (total.value % pageSize.value != 0) {
    return Math.ceil(total.value / pageSize.value)
  } else {
    return Math.ceil(total.value / pageSize.value)
  }
})

onMounted(() => {
  getHasUser()
})
//获取用户列表
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqAllUser(pageNo.value, pageSize.value)
  userArr.value = result.data.records
  total.value = result.data.total
}

//全选复选框的change事件
let handlerCheckAllChange = (val:boolean) =>{
  userRole.value = val ? allRolesList.value : []
  isIndeterminate.value = false
}
//复选框group的change事件
const handleCheckedRoleChange = (val:string[]) => {
  const checkCount:number = val.length
  //顶部复选框是否勾选 - 取决于勾选上的项目个数与全部的职位个数是否相等
  checkAll.value = checkCount === allRolesList.value.length
  isIndeterminate.value = checkCount > 0 && checkCount < allRolesList.value.length
}

//抽屉 - 角色职位的确定按钮
const saveClick = async () =>{
  let data:SetRoleData = {
    userId:(UserParams.id as number),
    roleIdList:userRole.value.map(item => {
      return (item.id as number)
    })
  }
  let result:any = await reqSetUserRule(data)
  if(result.code == 200){
    drawer1.value = false
    ElMessage({
      type:'success',
      message:'修改成功'
    })
    getHasUser(pageNo.value)
  }
}

const cancelClick = ()=>{
  drawer1.value = false
}

//抽屉 - 分配角色按钮
const setRole = async (row: User) => {
  drawer1.value = true
  Object.assign(UserParams, row)
  const {id} = row
  let result:any = await reqGetUserRole((id as number))
  if(result.code == 200){
    allRolesList.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
  }
}

//校验用户名字的回调函数
const validatorUsername = (_:any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}

const validateName = (_: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}

//表单校验的规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
}

//抽屉的确定按钮
const save = () => {
  userForm.value.validate(async valid => {
    if (valid) {
      let result: any = await reqADDOrUpdateUser(UserParams)
      if (result.code == 200) {
        drawer.value = false
        ElMessage({
          type: 'success',
          message: UserParams.id ? '更新成功' : '添加成功'
        })
        getHasUser(UserParams.id ? pageNo.value : 1)
        //浏览器重载
        window.location.reload()
      } else {
        ElMessage({
          type: 'error',
          message: UserParams.id ? '更新失败' : '添加失败'
        })
      }
    }
  })

}

//编辑用户 - row:当前点击的用户信息
const updateUser = (row: User) => {
  Object.assign(UserParams, row)
  drawer.value = true
  nextTick(() => {
    userForm.value.clearValidate('username')
    userForm.value.clearValidate('name')
  })
}

//添加用户
const addUser = () => {
  //清除上一次表单校验的提示信息
  nextTick(() => {
    userForm.value.clearValidate('username')
    userForm.value.clearValidate('name')
    userForm.value.clearValidate('password')
  })
  Object.assign(UserParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  drawer.value = true
}
//抽屉的取消按钮
const cancel = () => {
  Object.assign(UserParams, {
    username: '',
    name: '',
    password: ''
  })
  drawer.value = false

}

//分页器下拉菜单
const handler = () => {
  getHasUser()
}

</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
