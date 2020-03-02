/**
 * @author MARS  <qichuang>
 * @fileoverview 设备监控模块
 */
import Layout from '@/layout'

const monitoring = {
    path: '/monitoring',
    component: Layout,
    redirect: '/monitoring/index',
    name: 'Monitoring',
    meta: {
        title: 'monitoring',
        icon: 'monitoring'
    },
    children: [
        /*
         * @设备监控
         **/
        {
            path: 'index',
            component: () => import('@/views/monitoring/index'),
            name: 'monitoring',
            meta: {
                title: 'monitoring',
                permission: ['timingExport', 'statisticsExport', 'productionExport']
            }
        }
    ]
}

export default monitoring
