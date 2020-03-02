/**
 * @module 程序管理
 * @author lizhiming
 */
import Layout from '@/layout'

const programManage = {
    path: '/programManage',
    component: Layout,
    redirect: '/programManage/list',
    name: 'ProgramManage',
    meta: {title: 'programManage', icon: 'programManage'},
    children: [
        {
            path: 'list',
            component: () => import('@/views/programManage/list'),
            name: 'ProgramManageList',
            meta: {
                title: 'programManageList',
                icon: 'programManage',
                permission: ['view', 'view/view', 'view/downLoad', 'view/sync'],
                cache: true
            }
        },
        {
            path: 'list/view',
            component: () => import('@/views/programManage/view'),
            name: 'ProgramManageView',
            meta: {
                title: 'programManageView',
                icon: 'programManage',
                // permission: ['view','downLoad','sync']
                activeMenu: '/programManage/list',
            },
            hidden: true
        }
    ]
}

export default programManage
