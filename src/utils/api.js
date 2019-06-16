import axios from 'axios'
import router from '../router/index'
import {Message} from 'element-ui'
import {UN_LOGIN} from './utils'
// 拦截 axios 请求
axios.interceptors.request.use(config => {
    return config
}, err => {
    Message.error({
        message: '请求超时'
    })
    // return Promise.resolve(err)
})
// 拦截 axios 响应
axios.interceptors.response.use(data => {
    // 请求成功，但是状态码为500
    if(data.status && data.status == 200 && data.data.status == 500) {
        //对于 “未登录” 情况，要单独考虑，将其路由到登录页面
        if (data.data.msg == UN_LOGIN) {
            router.push('/')
        } else {
            Message.error({
            message: data.data.msg
        })
        }
        return
    }
    // 请求成功，输出消息
    if(data.data.msg) {
        Message.success({
            message: data.data.msg
        })
    }
    return data
}, err => {
    var msg
    // err.response.status：请求在服务器发生异常时，前端接收到的响应（此时请求已
    // 成功，但是服务器报错了）
    if(err.response) {
        switch (err.response.status) {
            case 504:
                msg = '服务器没上线！'
                break
            case 500:
                msg = '服务器没上线！'
                break
            case 404:
                msg = '服务器没上线！'
                break
            case 403:
                msg = '权限不足，请联系管理员！'
                break
            case 401:
                msg = err.response.data.msg
                break
            default:
                if(err.response.data.msg) {
                    msg = err.response.data.msg
                } else {
                    msg = '未知错误！'
                }
                break
        }
        Message.error({
            message: msg
        })
    }
    return Promise.resolve(err)
})
/**
 * 问题：为什么这里的根路径是 '' ？
 *     因为请求的路径 ${url} 都会写成“/user/**”等形式，而我们对“/”请求在
 * vue.config.js中已经转发成真实请求路径，所以只要是“/**”都可以正常访问。
 * ${url} 中都带有 “/”，所以这里 ${base} 为 '' 就好
 */
let base = ''
// POST请求，参数采用json形式进行传递
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        // `transformRequest`允许在请求数据发送到服务器之前对其进行更改
        transformRequest: [
            data => {
                return JSON.stringify(data)
            }
        ],
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
// POST请求，参数采用表单形式进行传递（后台的Spring Security 只能接收Form表单形式传递的username,password）
export const postRequestByForm = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        // `transformRequest`允许在请求数据发送到服务器之前对其进行更改
        transformRequest: [
            data => {
                let result = ''
                for(let param in data) {
                    result += encodeURIComponent(param) + "=" + encodeURIComponent(data[param]) + "&"
                }
                return result
            }
        ],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
// 封装上传文件请求
export const uploadFileRequest = (url, params) => {
    return axios ({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        transformRequest: [
            data => {
                return JSON.stringify(data)
            }
        ],
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export const deleteRequest = url => {
    return axios({
        method: 'delete',
        url: `${base}${url}`
    })
}

export const getRequest = url => {
    return axios({
        method: 'get',
        url: `${base}${url}`
    })
}

export const getRequestWithParams = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        // get请求的参数key是params，与其他请求是data不太一样！！！
        params: params,
        // `transformRequest`允许在请求数据发送到服务器之前对其进行更改
        transformRequest: [
            params => {
                let result = ''
                for(let param in params) {
                    result += encodeURIComponent(param) + "=" + encodeURIComponent(data[param]) + "&"
                }
                return result
            }
        ],
        headers: {
            'Content-Type': 'application/json'
        }
    })
}