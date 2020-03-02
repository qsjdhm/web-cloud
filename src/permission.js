/*
* 实现步骤：
* 第一阶段: 本地写好路由表=>通过权限管理页面进行配置=>发送给后端=>
* 第二阶段: 在登录页点击登录的时候通过接口获取用户Admin-Authority=>
*   进行页面跳转(这里经过src/permission.js中通过router.beforeEach会进行拦截，因为路由每次跳转的时候都会经历这里)=>
*   进行判断当前要跳转to.path是否在permissionList（constantRoutesList,Admin-Authority,)路由表中,如果在就允许访问=>
* 备注：目前这里只是用到动态路由中的router.addRoutes方法，并没有从后端拿数据进行动态添加。
* 防止耍流氓，文档 + 流程图进行输出
* */

import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login'] // no redirect whitelist
NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)
    // 通过Admin-Token判断当前的页面的是否已经登录，并判断当前页是否在登录页
    if (window.sessionStorage.getItem('Admin-Token') && !store.state.settings.freeLogin) {
        // 判断路由有没有初始化
        if (store.state.permission.routes.length === 0) {
            // 初始化路由是将本地所有路由进行初始化，然后在通过后端返回内容进行判断
            let accessRoutes = await store.dispatch('permission/generateRoutes')
            router.addRoutes(accessRoutes)
            next({
                ...to,
                replace: true
            })
        } else {
            next()
        }
    } else {
        /* 判断当前是否是开发状态开发状态不需要登录直接进入页面 */
        if (process.env.NODE_ENV === 'development' && store.state.settings.freeLogin) {
            if (store.state.permission.routes.length === 0) {
                // 初始化路由是将本地所有路由进行初始化，然后在通过后端返回内容进行判断
                let accessRoutes = await store.dispatch('permission/devGenerateRoutes')
                router.addRoutes(accessRoutes)
                next({
                    ...to,
                    replace: true
                })
            } else {
                next()
            }
        } else {
            /* has no token*/
            if (whiteList.indexOf(to.path) !== -1) {
                // in the free login whitelist, go directly
                next()
            } else {
                // other pages that do not have permission to access are redirected to the login page.
                next(`/login?redirect=${to.path}`)
                NProgress.done()
            }
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
