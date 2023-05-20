import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
//mock插件提供的方法
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig(({command})=>{
  return{
  plugins: [vue(),
  createSvgIconsPlugin({
    //svg矢量图标存放位置
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    symbolId: 'icon-[dir]-[name]',
  }),
  viteMockServe({
    localEnabled: command === 'serve',
  }),
  ],
    resolve: {
    alias: {
      "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
    }
  },
  //scss变量全局变量配置项
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
      },
    },
  },
}
})
