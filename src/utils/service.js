/*
 * 参考资料:
 *  1.不同服务上面接口,如何调用该方法使用,添加多个服务器接口?
 *  2.修改同一时间报出多个错误,如何使用防抖和节流去解决 ?
 *  封装请求 ：https://www.jianshu.com/p/6e7d92d052c0
 * */
import request from './request'
import { Message } from 'element-ui'
import throttle from 'lodash/throttle'

const placeholder = /{(\w+)}?/ig // 占位符

const baseURL = process.env.VUE_APP_BASE_API

/**
 *
 * @param method
 * @param api  api
 * @param params 参数地址
 * @param showMes callback() 自定义错误提示信息
 * @returns {Promise<AxiosResponse<any>>}
 */
function service(method, api, params = {}, showMes) {
    // 判断是否是通过{xxx}进行传递，进行修改最终路径
    // const urlPath = placeholder.test(api) ? buildPath(api, params) : api
    const urlPath = buildPath(api, params)
    return request({
        url: api.indexOf('http') > -1 ? api : `${baseURL}${urlPath}`,
        method: method,
        data: switchData(api, params)
    }).then((res) => {
        if (res.code === 600) {
            return res.data
        } else {
            // 是否回调函数，可以取消错误提醒
            showMes ? showMes() : errorMessage(res.message)
            return Promise.reject(res)
        }
    }).catch((error) => {
        return Promise.reject(error)
    })
}

/**
 * 如何使用防抖处理多次弹窗提醒
 * @param message
 */
const errorMessage = throttle((message) => {
    Message.error(message)
}, 2000)

/**
 * 是否传递数据，如果数据通过api传递，这里传递null
 * @param api
 * @param params
 * @returns {null|*}
 */
function switchData(api, params) {
    placeholder.lastIndex = 0
    if (placeholder.test(api)) return null
    return params
}

/**
 * 解析类似 /api/page/2这样动态参数的问题，用正则去匹配我们的占位符，把真实数据放进去
 * 将api处理成正常请求的格式
 * @param api
 * @param params
 * @returns {*}
 */
function buildPath(api, params) {
    placeholder.lastIndex = 0
    if (!placeholder.test(api)) return api
    return api.replace(placeholder, function($1, $2) {
        return encodeURIComponent(params[$2])
    })
}

export default service
