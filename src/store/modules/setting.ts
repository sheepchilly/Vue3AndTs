//关于layout组件相关配置的仓库

import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用于控制菜单折叠还是收起的控制
      refsh: false, //用于控制刷新效果
    }
  },
  actions: {
    changeIconAction() {
      this.fold = !this.fold
    },
  },
})

export default useLayOutSettingStore
