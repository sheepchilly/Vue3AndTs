//商品分类全局组件小仓库

import { defineStore } from 'pinia'
import { reqGetC1, reqGetC2, reqGetC3 } from '@/api/product/attr'
import type { CategoryResponse } from '@/api/product/attr/types'
import type { categoryState } from './types/type'

let useCategoryStore = defineStore('category', {
  state: (): categoryState => {
    return {
      c1Arr: [],
      c1Id: '',
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      let result: CategoryResponse = await reqGetC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      let result: CategoryResponse = await reqGetC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
      let result: CategoryResponse = await reqGetC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
