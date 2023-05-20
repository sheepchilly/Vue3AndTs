//对于axios进行二次封装，封装的目的是请求与相应拦截器

import axios from 'axios'
import { ElMessage } from 'element-plus';

//第一步：利用axios的create方法，去创建axios实例 - axios实例：可以配置请求的基础地址，请求超时时间
let request = axios.create({
    //基础路径，使用开发环境变量（在.env.development中）
    baseURL:import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
    timeout:5000 //超时时间
})

//第二步：给request实例添加请求与响应拦截器
request.interceptors.request.use((config)=>{
    config.headers.token = 'dy'
    //config配置对象，里面有headers属性请求头，经常给服务器端携带公共参数
    //返回配置对象
    return config;
})

//第三步：响应拦截器
request.interceptors.response.use((response)=>{
    //成功回调，在这里可以简化数据
    return response.data
},(error)=>{
    //失败回调：处理http网络错误的
    //定义一个变量：存储网络错误信息
    let message = '';
    //http状态码
    let status = error.response.status
    switch(status){
        case 401:
            message = "TOKEN过期"
            break;
        case 403:
            message = "无权访问"
            break;
        case 404:
            message = "请求地址错误";
            break;
        case 500:
            message = "服务器故障";
            break;
        default :
            message = "网络出现问题";
            break;
    }
    //提示错误信息
    ElMessage({
        type:'error',
        message
    })

    //返回一个失败的Promise对象，终止Promise链
    return Promise.reject(error);
})

//对外暴漏
export default request;