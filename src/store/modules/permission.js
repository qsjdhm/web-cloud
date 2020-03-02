import { asyncRoutes, constantRoutes } from '@/router'
import { filterData, clearChildren } from '@/utils/permission'

const state = {
    routes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        // 把标志设置为true，permission.js中会根据这个值进行判断是否需要初始化菜单
        state.routes = constantRoutes.concat(routes)
    },
    SET_DEV_ROUTES: (state, routes) => {
        // 把标志设置为true，permission.js中会根据这个值进行判断是否需要初始化菜单
        state.routes = constantRoutes.concat(routes)
    },
    REST_ROUTES: (state) => {
        // 把标志设置为true，permission.js中会根据这个值进行判断是否需要初始化菜单
        state.routes = []
    }
}
const actions = {
    // 初始化菜单路由
    generateRoutes({ commit }) {
        return new Promise(async (resolve) => {
            // 允许访问的路由,展示屏蔽掉
            let filterRouter = _.cloneDeep(asyncRoutes)
            /* zhl 当前变量是通过webpack动态添加变量, 向后端发送数据 */
            if (process.env.NODE_ENV === 'development') {
                try {
                    if (WATCH_ROUTER) await (await import('@/utils/watch-bundle')).watchRoute()
                }catch (error) {
                    console.log(error)
                }
            }
            const adminAuthority = JSON.parse(window.sessionStorage.getItem('Admin-Authority') || '[]')
            let tempAdminAuthority= _.cloneDeep(adminAuthority)
            adminAuthority.map((item) => {
                if (item.children && item.children.length > 0) {
                    tempAdminAuthority.push(...item.children)
                }
            })
            // 这里添加将按钮权限的进行添加路由中，按钮权限路由和详情页路由相同
            if (filterRouter.length > 0) {
                filterData(filterRouter, tempAdminAuthority, 0, [])
                clearChildren(filterRouter)
            } else {
                filterRouter = [{ path: '*', redirect: '/404', hidden: true }]
            }
            commit('SET_ROUTES', filterRouter)
            resolve(filterRouter)
        })
    },
    devGenerateRoutes({ commit }) {
        console.log('diayong')
        return new Promise(resolve => {
            // 允许访问的路由
            commit('SET_DEV_ROUTES', asyncRoutes)
            resolve(asyncRoutes)
        })
    },
    resetRouter({ commit }) {
        return new Promise(resolve => {
            // 允许访问的路由
            commit('REST_ROUTES')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
