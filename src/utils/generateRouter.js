// 1.将 router中异步路由表的path进行拼接,转化成访问路由浏览器器呈现路由,
// 2.将title的英文利用i18n转化成中文
// 3.将得到路由转化成以及路由
// 4.处理按钮权限, 将按钮title利用i18n转化成中文
// 5.将按钮和当前所在路由进行拼接作为唯一性.
// 最后通过接口发给后端,系统管理权限配置页面完成



import { asyncRoutes } from '@/router/index'
import path from 'path'
import i18n from '@/lang'
import lodash from 'lodash'


// 将数据转化为一级数组
function switchArr(arr, routerList) {
    for (let item = 0; item < arr.length; item++) {
        if (arr[item].children && arr[item].children.length > 0) {
            switchArr(arr[item].children, routerList)
        } else {
            routerList.push(arr[item])
        }
    }
}

// 处理btn权限
function handleBtn(arrData, val) {
    arrData.map((item) => {
        item.name = item.title
        item.url = item.path
        item.type = 'MENU'
        item.checked = val
        let permissionArr = lodash.cloneDeep(item.permission)
        let permission = []
        if (!permissionArr) return
        permissionArr.map((item) => { permission.push({ title: item }) })
        // delete item.path
        // delete item.title
        // delete item.permission
        if (permission && permission.length > 0) {
            item.children = permission
            item.children.map((childrenItem) => {
                childrenItem.name = i18n.t(`button.${childrenItem.title}`)
                childrenItem.type = 'ELEMENT'
                childrenItem.checked = val
                childrenItem.url = `${item.url}/${childrenItem.title}`
                // delete childrenItem.permission
                // delete childrenItem.title
            })
        }
    })
}

export function generateRoutes(routes, basePath = '/') {
    const res = []
    for (let route of routes) {
        if (route.hidden) { continue }
        // const onlyOneShowingChild = isOnlyOneShowingChild(route.children, route)
        // if (route.children && onlyOneShowingChild && !route.alwaysShow) {
        //     route = onlyOneShowingChild
        // }
        const data = {
            path: path.resolve(basePath, route.path),
            title: route.meta && route.meta.title,
            permission: (route.meta && route.meta.permission) || ''
        }
        if (route.children) {
            data.children = generateRoutes(route.children, data.path)
        }
        res.push(data)
    }
    return res
}

function isOnlyOneShowingChild(children = [], parent) {
    let onlyOneChild = null
    const showingChildren = children.filter(item => !item.hidden)
    if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
    }
    if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
    }
    return false
}

// 将英文转化成中文
export  function i18nToZh(routes) {
    let routesZh = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
            route.children = i18nToZh(route.children)
        }
        return route
    })
    return routesZh
}

function getRoutes() {
    let routerList = []
    const routes = generateRoutes(_.cloneDeep(asyncRoutes))
    let newRoutes = i18nToZh(routes)
    // 将数据转化为一级数组
    switchArr(newRoutes, routerList)
    handleBtn(routerList, false)
    return routerList
}

export default getRoutes
