/**
 * @module 生产工单
 * @author chebin
 */
import Layout from '@/layout'
const productionWorkOrder = {
    path: '/ProductionWorkOrder',
    component: Layout,
    redirect: '/ProductionWorkOrder/list',
    name: 'ProductionWorkOrder',
    meta: {
        title: 'productionWorkOrder',
        icon: 'ic_shengchangongdan'
    },
    children: [
       {
            path: 'list',
            component: () => import('@/views/productionWorkOrder/list'),
            name: 'ProductionWorkOrder',
            meta: {
                title: 'productionWorkOrder',
                permission: ['view', 'export'],
                cache: true
            }
        },
       {
            path: 'list/view',
            component: () => import('@/views/productionWorkOrder/view'),
            name: 'productionWorkOrderView',
            meta: {
                title: 'productionWorkOrderView',
                permission: [],
                // cache: false
            },
            hidden: true
        }
    ]
}
export default productionWorkOrder