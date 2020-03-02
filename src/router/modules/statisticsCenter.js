/**
 * @module 统计中心
 * @author 李志鸣
 */
import Layout from '@/layout'

const statisticsCenter = {
    path: '/statisticsCenter',
    component: Layout,
    redirect: '/statisticsCenter/list',
    name: 'StatisticsCenter',
    meta: {title: 'statisticsCenter', icon: 'statisticsCenter'},
    children: [
        {
            path: 'list',
            component: () => import('@/views/statisticsCenter/list'),
            name: 'StatisticsCenterList',
            meta: {
                title: 'statisticsCenterList',
                icon: 'statisticsCenter',
                permission: ['statusExport']
            }
        }
    ]
}

export default statisticsCenter
