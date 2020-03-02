/**
 * 参考地址:
 * 解决重复请求问题
 * todo refresh token https://www.jianshu.com/p/d5fb2bb94514 处理token是否符合预期, 打断点进行调试
 * https://javascript.ctolib.com/ssttm169-use-axios-well.html 解决超时后继续重复请求
 * https://github.com/axios/axios/issues/164#issuecomment-327837467
 */

import axios from 'axios'
import _ from 'lodash'
import router from '@/router'
import { Message } from 'element-ui'
import service from '@/utils/service'

// 节流函数的使用
const errorMessage = _.throttle((message) => {
    Message.error(message)
}, 2000,{
    trailing: false
})

/* =================== 刷新请求的token start=================== */
// 是否有请求在刷新token
window.isRefreshing = false
// 被挂起的请求数组
let subscribesArr = []

/**
 * 判断是否已经过期
 * @returns {boolean}
 */
function isTokenExpired() {

    const expiresIn = window.sessionStorage.getItem('Admin-ExpiresIn')
    if (expiresIn) {
        const nowTime = new Date().getTime()
        const willExpired = (expiresIn - nowTime) / 1000 < 10
        return willExpired
    }
    return false
}

// push所有请求到数组中
function subscribeTokenRefresh(cb) {
    subscribesArr.push(cb)
}

// 用新token发起请求
function reloadSubscribesArr(token) {
    subscribesArr.map(cb => cb(token))
}

/* =================== 刷新请求的token end=================== */
/*
* withCredentials: true
* 影响到跨域设置，参考地址： https://segmentfault.com/q/1010000015791317
* */
const Axios = axios.create({
    timeout: 10000,
    responseType: 'json',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})
// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  async(config) => {
      // 1. 处理数据的前后空格
      if (config.data !== undefined) {
          for (const dataKey in config.data) {
              if (typeof config.data[dataKey] === 'string') {
                  config.data[dataKey] = _(config.data[dataKey]).trim()
              }
          }
      }
      // 2. 转换下get等需要的数据
      if (config.method === 'get') {
          config.params = config.data
      }
      /* =================== 刷新token开始 start=================== */
      if (isTokenExpired() && !config.url.includes('/proxy/login') && !config.url.includes('/proxy/refresh')) {
          if (!window.isRefreshing) {
              window.isRefreshing = true
              service('post','/proxy/refresh', { refreshToken: window.sessionStorage.getItem('Admin-RefreshToken') })
                .then((response) => {
                    window.isRefreshing = false
                    window.sessionStorage.setItem('Admin-Token', `Bearer ${response.accessToken}`)
                    window.sessionStorage.setItem('Admin-RefreshToken', response.refreshToken)
                    window.sessionStorage.setItem('Admin-ExpiresIn', response.expiresIn * 1000 + new Date().getTime())
                    reloadSubscribesArr(`Bearer ${response.accessToken}`)
                }).catch(() => {
                  window.isRefreshing = false
                  subscribesArr = []
                  window.sessionStorage.clear()
                  router.push({ path: '/' })
              })
          }
          // 返回Promise，调用的时候使用
          const retry = new Promise((resolve, reject) => {
              subscribeTokenRefresh((newToken) => {
                  config.headers.Authorization = newToken
                  resolve(config)
              })
          })
          return retry
      } else {
          config.headers.Authorization = window.sessionStorage.getItem('Admin-Token')
          return config
      }
      /* =================== 刷新token开始 end=================== */
  },
  error => {
      return Promise.reject(error)
  }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
      if (res.status !== 200) {
          return Promise.reject(res)
      }
      if (res.config.responseType === 'blob') {
          return res
      }
      return res.data
  },
  async(error) => {
      // 后端请求未反数据,异常状态
      if (error.response && error.response.status) {
          switch (error.response.status) {
              case 401:
                  router.push({ path: '/login' })
                  window.sessionStorage.clear()
                  errorMessage(error.response.data.error_description)
                  break
              case 404:
                  errorMessage(error.response.data.message)
                  break
              case 500:
                  errorMessage('服务端异常！')
          }
      } else {
          errorMessage('服务器异常，请稍后再试！')
      }
      // 返回 response 里的错误信息
      return Promise.reject(error)
  }
)
export default Axios
