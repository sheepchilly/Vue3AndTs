<template>
  <div class="">
    <el-card style="height:70px;">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input v-model="keyword" placeholder="请输入职位名称" ></el-input>
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
            <el-button type="primary" icon="User" size="small">分配角色</el-button>
            <el-button type="primary" icon="Edit" size="small" @click="updateRole(row)">编辑</el-button>
            <el-button type="primary" icon="Delete" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :page-count="totalPage" v-model:current-page="pageNo" v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]" :background="true" layout="prev,pager,next,jumper,->,sizes,total" :total="total"
        @current-change="getHasRole" @size-change="sizeChange" prev-text="上一页" next-text="下一页" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="RoleParams.id?'更新职位':'添加职位'">
      <el-form  ref="formRule" :model="RoleParams" :rules="rules">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted ,reactive, nextTick} from 'vue'
import { reqAllRoleList,reqAddOrUpdateRole } from '@/api/acl/role'
import type { RoleResponseData, Records } from '@/api/acl/role/type.ts'
import useLayOutSettingStore from '@/store/modules/setting';
import { RoleData } from '@/api/acl/user/type';
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
  roleName:''
})
let formRule = ref<any>(null)

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

//更新已有职位
let updateRole = (row:RoleData)=>{
  dialogVisible.value = true
  Object.assign(RoleParams,row)
}

//dialog的确定按钮
const confirm = async()=>{

    await formRule.value.validate
      let result:any = await reqAddOrUpdateRole(RoleParams)
      if(result.code == 200){
        ElMessage({type:'success',message:RoleParams.id?'更新成功':'添加成功'})
        getHasRole(RoleParams.id?pageNo.value:1)
        dialogVisible.value = false

      }
  }

//dialog的表单校验
const rules = reactive({
  roleName:[
  { required: true, message: '请输入职位名称', trigger: 'blur' },
  ]
})

//添加职位
const addRole =() => {
  dialogVisible.value = true
  Object.assign(RoleParams,{
    roleName:'',
    id:''
  })
  nextTick(()=>{
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
