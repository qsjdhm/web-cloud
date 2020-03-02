/**
 * @module 系统管理
 * @author zhangle
 */
import Layout from '@/layout'

const systemManage = {
    path: '/systemManage',
    component: Layout,
    redirect: '/systemManage/dictionary',
    name: 'systemManage',
    meta: {
        title: 'systemManage',
        icon: 'ic_xitongguanli'
    },
    children: [
        {
            path: 'department',
            component: () => import('@/views/systemManage/department'), // Parent router-view
            name: 'department',
            meta: {
                title: 'department',
                permission: ['addDepartment', 'editDepartment', 'deleteDepartment']
            }
        },
        {
            path: 'user',
            component: () => import('@/views/systemManage/user'), // Parent router-view
            name: 'User',
            meta: {
                title: 'user',
                permission: ['addMember', 'editMember', 'resetPassword', 'disable']
            }
        },
        {
            path: 'role',
            component: () => import('@/views/systemManage/role'), // Parent router-view
            name: 'Role',
            meta: {
                title: 'role',
                permission: ['add', 'edit', 'view', 'delete']
            }
        },
        {
            path: 'authority',
            component: () => import('@/views/systemManage/authority/authority'), // Parent router-view
            name: 'authority',
            meta: {
                title: 'authority',
                permission: ['add', 'edit', 'set', 'view', 'delete']
            }
        },
        {
            path: 'dictionary',
            component: () => import('@/views/systemManage/dictionary/dictionary'), // Parent router-view
            name: 'Dictionary',
            meta: {
                title: 'dictionary',
                permission: ['add', 'edit', 'set', 'view', 'disable']
            }
        }
    ]
}

export default systemManage
