<template>
  <div class="">
    <el-card style="height:70px;">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input v-model="keyword" placeholder="请输入职位名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :disabled="!keyword">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 10px;">
      <el-button type="primary" @click="addRole" icon="Plus">添加</el-button>

      <el-table :data="allRole" border style="margin: 10px 0;">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="id" prop="id" align="center"></el-table-column>
        <el-table-column label="职位名称" show-overflow-tooltip prop="roleName"></el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column label="更新时间" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="280" align="center">
          <template #="{ row }">
            <el-button type="primary" icon="User" size="small" @click="setPermisstion(row)">分配角色</el-button>
            <el-button type="primary" icon="Edit" size="small" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm :title="`确定删除${row.roleName}吗?`" @confirm="deleteRole(row)" width="250">
              <template #reference>
                <el-button type="primary" icon="Delete" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :page-count="totalPage" v-model:current-page="pageNo" v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]" :background="true" layout="prev,pager,next,jumper,->,sizes,total" :total="total"
        @current-change="getHasRole" @size-change="sizeChange" prev-text="上一页" next-text="下一页" />
    </el-card>

    <!-- 对话框:添加职位与更新已有职位 -->
    <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '添加职位'">
      <el-form ref="formRule" :model="RoleParams" :rules="rules">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="请你输入职位的名称" v-model="RoleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 抽屉：分配用户的菜单权限与按钮的权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" :default-expanded-keys="[1, 2, 3]"
          :default-checked-keys="selectArr" :props="defaultProps" default-expand-all />
      </template>
      <template #footer>
        <div style="flex:auto;">
          <el-button>取消</el-button>
          <el-button type="primary" @click="handler">确认</el-button>
        </div>
      </template>
    </el-drawer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, nextTick } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission, reqDeleteRole } from '@/api/acl/role'
import type { RoleResponseData, Records, RoleData, MenuList } from '@/api/acl/role/type.ts'
import useLayOutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';

let LayOutSettingStore = useLayOutSettingStore()
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(1)
let keyword = ref<string>('')
//全部已有的职位
let allRole = ref<Records[]>([])
let dialogVisible = ref<boolean>(false)
//新增岗位的数据
let RoleParams = reactive<RoleData>({
  roleName: ''
})
let formRule = ref<any>(null)
let drawer = ref<boolean>(false)
//存储用户权限的数据
let menuArr = ref<MenuList>([])
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<any>([])
let tree = ref<any>(null)

let totalPage = computed(() => {
  if (total.value % pageSize.value != 0) {
    return Math.ceil(total.value / pageSize.value)
  } else {
    return Math.ceil(total.value / pageSize.value)
  }
})

onMounted(() => {
  getHasRole()
})

//获得全部职位信息
let getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

//删除角色
let deleteRole = async (row:any) =>{
  let result:any = await reqDeleteRole(row.id)
  if(result.code == 200){
    getHasRole(pageNo.value)
    ElMessage({type:'success',message:'删除成功'})
  }
}

//树形控件确定按钮的回调
let handler = async () => {
  //选中节点的ID
  let arr: any = tree.value.getCheckedKeys()
  //半选的ID
  let halfArr: any = tree.value.getHalfCheckedKeys()
  let permissionId: any = arr.concat(halfArr)
  let result: any = await reqSetPermission((RoleParams.id as number), permissionId)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({ type: 'success', message: '角色权限分配成功' })
    //页面刷新
    window.location.reload()
  }

}

//树形控件展示的数据
const defaultProps = {
  children: 'children',
  label: 'name'
}

//分配权限按钮的回调
const setPermisstion = async (row: any) => {
  drawer.value = true
  //收集当前要分类权限的职位的数据
  Object.assign(RoleParams, row)
  let result: any = await reqAllMenuList((RoleParams.id as number))
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    //递归遍历
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  });
}

//更新已有职位
let updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(RoleParams, row)
}

//dialog的确定按钮
const confirm = async () => {

  await formRule.value.validate
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' })
    getHasRole(RoleParams.id ? pageNo.value : 1)
    dialogVisible.value = false

  }
}

//dialog的表单校验
const rules = reactive({
  roleName: [
    { required: true, message: '请输入职位名称', trigger: 'blur' },
  ]
})

//添加职位
const addRole = () => {
  dialogVisible.value = true
  Object.assign(RoleParams, {
    roleName: '',
    id: ''
  })
  nextTick(() => {
    formRule.value.clearValidate()
  })

}

//重置按钮
const reset = () => {
  LayOutSettingStore.changeRefsh()
}

//搜索按钮的回调
const search = () => {
  getHasRole()
  keyword.value = ''
}

let sizeChange = () => {
  getHasRole()
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
