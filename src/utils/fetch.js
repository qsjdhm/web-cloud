/*
 * todo 存在问题:
 *  1.不同服务上面接口,如何调用该方法使用 ?
 *  2. 修改同一时间报出多个错误
 * */
import request from './request'
import {
    Message
} from 'element-ui'
import API from '@/interface/apis'
import _ from 'lodash'
const placeholder = /{(\w+)}?/i //占位符

let baseURL = process.env.VUE_APP_BASE_API
let errMsg = 'The current request API was not found'

const errorMessage = _.throttle((message) => {
    Message.error(message)
}, 2000,{
    trailing: false
})

function fetch (url, payload, thirdUrl) {
    payload = payload || {}
    try {
        let urlPath = ''
        const req = buildUrl(url, API)
        // 判断是否是通过{}进行传递
        placeholder.lastIndex = 0
        if (placeholder.test(req.url)) {
            urlPath = buildPath(req.url, payload)
        } else {
            urlPath = req.url
        }
        return request({
            url: thirdUrl ? `${thirdUrl}${urlPath}` : `${baseURL}${urlPath}`,
            method: req.method,
            data: switchData(req.url, payload)
        }).then((res) => {
            if (res.code === 600) {
                return res.data
            } else {
                errorMessage(res.message)
                return Promise.reject(res)
            }
        }).catch((error) => {
            return Promise.reject(error)
        })
    } catch (error) {
        console.log(`${error.message}请检查fetch.js`)
    }
}

function switchData (url, payload) {
    placeholder.lastIndex = 0
    if (placeholder.test(url)) return null
    // if (payload.hash) delete payload.hash
    return payload
}

//解析类似 /api/page/2这样动态参数的问题，用正则去匹配我们的占位符，把真实数据放进去
function buildPath (url, payload) {
    placeholder.lastIndex = 0
    if (!placeholder.test(url)) return url
    return url.replace(placeholder, function ($1, $2) {
        return encodeURIComponent(payload[$2])
    })
}

/* 获取API对象 */
function buildUrl (str, API) {
    try {
        let apiKey = str.split('/')
        let req = {
            ...API[apiKey[0]][apiKey[1]]
        }
        if (req && JSON.stringify(req) !== '{}') {
            return req
        } else {
            Message.error(errMsg)
        }
    } catch (error) {
        let err = 'fetch.js>>>buildUrl'
        console.log('%c ' + `${err}---${error.message}`, 'color: red')
        Message.error('发起请求的API未获取到!')
    }
}

export default fetch
