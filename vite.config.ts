import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
//mock插件提供的方法
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig(({ command, mode }) => {
  //获取各种环境下的对应的变量，需要传入三个参数（哪一个环境的文件，文件在哪个位置）
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
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
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
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
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, //获取数据的服务器地址设置
          changeOrigin: true, //需要代理跨域
          rewrite: (path) => path.replace(/^\/api/, ''), //路径重写，把/api替换为空
        },
      },
    },
  }
})
