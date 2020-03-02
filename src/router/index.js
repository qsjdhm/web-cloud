import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/* Router Modules */
// 设备监控模块
import monitoring from './modules/monitoring'
// 程序管理模块
import programManage from './modules/programManage'
// 统计中心模块
import statisticsCenter from './modules/statisticsCenter'
// 基础配置模块
import basicConfig from './modules/basicConfig/index'
// 生产工单模块
import productionWorkOrder from './modules/productionWorkOrder/index'
// 系统管理模块
import systemManage from './modules/systemManage'
// 设备管理系统-车间看板模块
import kanBanWorkShop from './modules/kanBanWorkShop/index'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true (默认false)                   //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1

 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 若你想不管路由下面的 children 声明的个数都显示你的根路由
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * alwaysShow: true               路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面，左侧菜单栏只显示子菜单项
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    permission: ['add' ,'edit']  按钮权限，权限配置页面需要中英文， 中英文详见 /src/lang/zh/button  /src/lang/en/button
    title: 'title'               面包屑和菜单栏显示名称，分别对应 /src/lang/zh/route.js  /src/lang/en/route.js
    icon: 'svg-name'             //路由的图标
    cache: true                  默认不缓存,如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    affix: true                  默认true  tags-view固定导航栏,存在导航栏中没有close关闭图标
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/example/list'  详情中中必备额，高亮左侧菜单
  }
 */

/**
 * constantRoutes
 * 固定路由，当前系统可以直接访问的页面
 */
export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        redirect: '/welcome',
        children: [
            {
                path: 'welcome',
                component: () => import('@/views/welcome/index'),
                name: 'Welcome',
                meta: { title: 'welcome', icon: 'home', affix: true }
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
    },
    // 点击左侧刷新当前菜单, https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E7%82%B9%E5%87%BB%E4%BE%A7%E8%BE%B9%E6%A0%8F-%E5%88%B7%E6%96%B0%E5%BD%93%E5%89%8D%E8%B7%AF%E7%94%B1
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    }
]

/**
 * asyncRoutes
 * 动态路由，会根据后端返回数据内容在，permission/store/
 */
export const asyncRoutes = [
    productionWorkOrder,
    monitoring,
    programManage,
    statisticsCenter,
    kanBanWorkShop,
    basicConfig,
    systemManage,
    { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
