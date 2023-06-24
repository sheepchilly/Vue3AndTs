<template>
  <div class="">
    <el-card class="box-card">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTrademark"
      >
        添加品牌
      </el-button>

      <el-table :data="trademarkArr" style="width: 100%; margin: 10px 0" border>
        <el-table-column label="序号" width="80" type="index" />
        <el-table-column prop="tmName" label="品牌名称" />
        <el-table-column prop="" label="品牌LOGO" class="elTable_column">
          <template #default="{ row, $index }">
            <img
              :src="
                row.logoUrl.indexOf('http') == -1
                  ? 'http://' + row.logoUrl
                  : row.logoUrl
              "
              class="elTable_img"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template #default="{ row, $index }">
            <el-button type="warning" size="small">
              <el-icon @click="updateTrademark(row)">
                <Edit />
              </el-icon>
            </el-button>

            <el-popconfirm
              :title="`您确认要删除${row.tmName}吗?`"
              @confirm="deleteTrademark(row)"
              width="250px"
            >
              <template #reference>
                <el-button type="danger" size="small">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :page-count="totalPage"
        v-model:current-page="currentPage"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev,pager,next,jumper,->,sizes,total"
        :total="total"
        @current-change="getHasTrademark"
        @size-change="sizeChange"
        prev-text="上一页"
        next-text="下一页"
      />
    </el-card>

    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :rules="rules"
        :model="trademarkParams"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input
            placeholder="请输入品牌名称..."
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">
          <el-upload
            ref="picUpload"
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="showFileList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="
                trademarkParams.logoUrl.indexOf('http://') == -1
                  ? 'http://' + trademarkParams.logoUrl
                  : trademarkParams.logoUrl
              "
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- dialog的底部使用具名插槽 -->
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark/index.ts'
import {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from '@/api/product/trademark/types.ts'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'


let currentPage = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(0)
let showFileList = ref<boolean>(true)
let picUpload = ref<any>(null)
let trademarkArr = ref<Records>([]) //类型是包含全部品牌的Ts类型
let dialogFormVisible = ref<boolean>(false)
let trademarkParams = reactive<TradeMark>({
  logoUrl: '',
  tmName: '',
})
let formRef = ref<any>(null)

//自定义校验规则
const validatorTmName = (_: any, value: any, callBack: any) => {
  console.log(value)
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数必须大于等于两位'))
  }
}
const validatorLogoUrl = (_: any, value: any, callBack: any) => {
  //如果图片上传了，value里就有值
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传图片'))
  }
}

const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}

onMounted(async () => {
  getHasTrademark()
})

//清除show-file-list的文件信息
const removeImg = () => {
  nextTick(() => {
    picUpload.value.clearFiles()
  })
}

const totalPage = computed(() => {
  if (total.value % limit.value == 0) {
    return Math.floor(total.value / limit.value)
  } else {
    return Math.ceil(total.value / limit.value)
  }
})

const getHasTrademark = async (page = 1) => {
  currentPage.value = page
  let result: TradeMarkResponseData = await reqHasTrademark(
    currentPage.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

//下拉菜单发生变化时触发此方法
const sizeChange = () => {
  getHasTrademark()
}

//删除品牌
const deleteTrademark = async (row: TradeMark) => {
  let { id } = row
  let result = await reqDeleteTrademark(id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    getHasTrademark(currentPage.value)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}

//添加品牌
const addTrademark = () => {
  dialogFormVisible.value = true
  removeImg()
  //清空输入框
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}

//编辑品牌
const updateTrademark = (row: TradeMark) => {
  //清空校验规则的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  //合并数据
  Object.assign(trademarkParams, row)
}

const cancel = () => {
  dialogFormVisible.value = false
}

//添加品牌的确认按钮
const confirm = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      let result: any = await reqAddOrUpdateTrademark(trademarkParams)
      if (result.code == 200) {
        dialogFormVisible.value = false
        ElMessage({
          type: 'success',
          message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
        })
        getHasTrademark(trademarkParams.id ? currentPage.value : 1)
      } else {
        ElMessage({
          type: 'error',
          message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
        })
      }
    }
  })
}

//图片上传组件API->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  //约束文件的类型
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    //约束文件的大小
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//图片上传成功的钩子 - response为请求成功后服务器返回的地址路径
const handleAvatarSuccess: UploadProps['onSuccess'] = (response: any) => {
  trademarkParams.logoUrl = response.data
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
</script>

<style lang="scss" scoped>
.elTable_img {
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
