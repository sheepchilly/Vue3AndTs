<template>
    <el-form label-width="100px">
        <el-form-item label="spu名称">
            <el-input placeholder="请输入spu名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="spu品牌">
            <el-select placeholder="请选择" v-model="SpuParams.tmId">
                <el-option v-for="item in AllTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="spu描述">
            <el-input type="textarea" placeholder="请输入描述" v-model="SpuParams.description"></el-input>
        </el-form-item>

        <el-form-item label="spu照片">
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImage" alt="Preview Image" style="width: 100%;" />
            </el-dialog>
        </el-form-item>

        <el-form-item label="spu销售属性">
            <el-select :placeholder="`还有${unSelectSaleAttr.length}种选择`" v-model="saleAttrIdAndValueName">
                <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"
                    :value="`${item.id}:${item.name}`"></el-option>
            </el-select>
            <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" type="primary" icon="Plus"
                style="margin:0 10px;">添加销售属性</el-button>
            <el-table :data="saleAttr" style="width: 100%;margin: 10px 0 ;" border>
                <el-table-column type="index" label="序号" width="100" align="center" />
                <el-table-column label="属性名" width="100" prop="saleAttrName" />
                <el-table-column label="属性值">
                    <template #="{ row }">
                        <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable
                            @close="handleClose(row, index)" style="margin-right:10px;">
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-input v-model="row.saleAttrValue" @blur="toLook(row)" v-if="row.flag == true"
                            placeholder="请你输入属性值" size="small" style="width:100px;margin:0 10px;"></el-input>
                        <el-button @click="toEdit(row)" v-else type="success" size="small" icon="Plus"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #="{ row, $index }">
                        <el-button icon="Delete" type="danger" size="small" @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="save" type="primary" size="default" :disabled="saleAttr.length > 0 ? false : true">保存</el-button>
            <el-button size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { reqAllTrademark, reqImage, reqSpuHasSale, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu/index.ts'
import type { SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, Trademark, SpuData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/types.ts'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
let AllTradeMark = ref<Trademark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
//存储父传递过来的spu对象
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
let dialogVisible = ref<boolean>(false)
let dialogImage = ref<string>('')
let saleAttrIdAndValueName = ref<string>('')

//添加一个新的SPU初始化请求的方法
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
        id:''
    })
    imgList.value = []
    saleAttr.value = []
    saleAttrIdAndValueName.value = ''

    SpuParams.value.category3Id = c3Id
    //获取全部品牌的数据
    let result1: AllTradeMark = await reqAllTrademark()
    //获取全部销售属性的数据
    let result2: HasSaleAttrResponseData = await reqAllSaleAttr()
    //存储数据
    AllTradeMark.value = result1.data
    allSaleAttr.value = result2.data
}

//保存按钮
const save = async () => {
    //1.照片墙数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    //2.销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value

    let result: any = await reqAddOrUpdateSpu(SpuParams.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
            $emit('changeScene',{flag:0,params:SpuParams.value.id?'update':'add'})
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }
}

//往数组中追加flag
const toEdit = (row: SaleAttr) => {
    row.flag = true
    row.saleAttrValue = ""
}
//表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
    row.flag = false
    //整理收集到的属性值的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '当前输入为空！'
        })
        return
    }
    //判断属性值在数组当中是否存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue
    })
    if (repeat) {
        ElMessage({
            type: "error",
            message: "属性重复，请重新输入！"
        })
        return
    }

    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
}

//添加销售属性
const addSaleAttr = () => {
    let attr = saleAttrIdAndValueName.value.split(':')
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId: attr[0],
        saleAttrName: attr[1],
        spuSaleAttrValueList: []
    }
    //往数组中追加数据
    saleAttr.value.push(newSaleAttr)
    //清空收集的数据
    saleAttrIdAndValueName.value = ''
}

//当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
    let unSelectArr = allSaleAttr.value.filter((item) => {
        return saleAttr.value.every(val => {
            return item.name != val.saleAttrName
        })
    })
    return unSelectArr
})

//子组件点击取消按钮通知父组件修改场景值
const cancel = () => {
    $emit('changeScene', {flag:0,params:'update'})
}

//属性值的tag关闭
const handleClose = (row: any, index: number) => {
    row.spuSaleAttrValueList.splice(index, 1)
}

//上传图片之前触发的钩子函数
const beforeAvatarUpload = (rawFile: any) => {
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

//图片删除
const handleRemove = (file: any) => {
    console.log(file.uid)
}

//图片预览
const handlePictureCardPreview = (file: any) => {
    console.log(file.uid, 'add')
    dialogImage.value = file.url
    dialogVisible.value = true
}

const initHasSpuData = async (spu: SpuData) => {
    SpuParams.value = spu
    let { id } = spu
    //获取全部品牌的数据 
    let result: AllTradeMark = await reqAllTrademark()
    //获取某一个品牌旗下全部售卖商品的图片
    let result1: SpuHasImg = await reqImage((id as number))
    //已有的销售属性的接口
    let result2: SaleAttrResponseData = await reqSpuHasSale((id as number))
    //获取整个项目全部SPU的销售属性
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

    AllTradeMark.value = result.data
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    saleAttr.value = result2.data
    allSaleAttr.value = result3.data
}

//子组件身上的方法必须得对外暴露，父组件才可以拿到
defineExpose({ initHasSpuData, initAddSpu })

</script>

<style scoped>
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
