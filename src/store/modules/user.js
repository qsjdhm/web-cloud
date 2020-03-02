import { getToken, setToken, removeToken ,removeSession} from '@/utils/auth'
import service from '@/utils/service'
import router, { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    // user login
    // login({ commit }, userInfo) {
    //     const { username, password } = userInfo
    //     return new Promise((resolve, reject) => {
    //         login({ username: username.trim(), password: password }).then(response => {
    //             const { data } = response
    //             commit('SET_TOKEN', data.token)
    //             setToken(data.token)
    //             resolve()
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // },


    // user logout
    logout({ commit, state, dispatch }) {
        return service('get','/proxy/logout').then(async(res) => {
            // commit('SET_TOKEN', '')
            // commit('SET_ROLES', [])
            removeSession()
            // removeToken()
            resetRouter()

            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            await dispatch('tagsView/delAllViews', null, { root: true })
            await dispatch('permission/resetRouter', null, {root: true })
            window.sessionStorage.clear()
            return res
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    // // dynamically modify permissions
    // changeRoles({ commit, dispatch }, role) {
    //     return new Promise(async resolve => {
    //         const token = role + '-token'
    //
    //         commit('SET_TOKEN', token)
    //         setToken(token)
    //
    //         // const { roles } = await dispatch('getInfo')
    //
    //         resetRouter()
    //
    //         // generate accessible routes map based on roles
    //         const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    //
    //         // dynamically add accessible routes
    //         router.addRoutes(accessRoutes)
    //
    //         // reset visited views and cached views
    //         dispatch('tagsView/delAllViews', null, { root: true })
    //
    //         resolve()
    //     })
    // }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
