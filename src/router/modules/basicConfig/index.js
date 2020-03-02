/**
 *  基础配置模块
 */
import Layout from '@/layout'

const basicConfig = {
    path: '/basicConfig',
    component: Layout,
    redirect: '/basicConfig/equipmentClassification',
    name: 'BasicConfig',
    meta: {
        title: 'basicConfig',
        icon: 'ic_jichupeizhi'
    },
    children: [
        {
            path: 'equipmentClassification', // 设备分类
            component: () => import('@/views/basicConfig/equipmentClassification/list'),
            name: 'EquipmentClassification',
            meta: { title: 'equipmentClassification', permission: ['add', 'edit', 'view', 'disable', 'disableAll', 'enabledAll','addClassification', 'editClassification', 'disableClassification']}
        },
        {
            path: 'equipmentClassification/view', //设备分类详情
            component: () => import('@/views/basicConfig/equipmentClassification/components/queryDetail'),
            name: 'queryDetail',
            meta: {
                title: 'queryDetail'
            },
            hidden: true
        },
        {
            path: 'equipmentArchives', //设备档案
            component: () => import('@/views/basicConfig/equipmentArchives/list'),
            name: 'EquipmentArchives',
            meta: { title: 'equipmentArchives', permission: ['add', 'edit', 'view','addClassification', 'editClassification', 'disableClassification']}
        },
        {
            path: 'equipmentArchives/view', // 设备档案详情
            component: () => import('@/views/basicConfig/equipmentClassification/components/archivesDetail'),
            name: 'archivesDetail',
            meta: {
                title: 'archivesDetail',
                // activeMenu: '/equipmentMange/account/query'
            },
            hidden: true
        },
        {
            path: 'workCenter', //工作中心
            component: () => import('@/views/basicConfig/workCenter/list'),
            name: 'WorkCenter',
            meta: { title: 'workCenter', permission: ['add', 'edit', 'view', 'disable']}
        },
        //SCADA配置
        {
            path: 'scadaConfig',
            // component: () => import('@/views/basicConfig/scadaConfig/DataTemplateConfig/list'),
            component: () => import('@/layout/components/RouterView'),
            meta: {
                title: 'ScadaConfig'
            },
            alwaysShow: true,
            children: [
                {
                    // 数据模板配置
                    path: 'dataTemplate',
                    component: () => import('@/views/basicConfig/scadaConfig/DataTemplateConfig/list'),
                    name: 'dataTemplate',
                    meta: {
                        title: 'DataTemplate',
                        permission: ['add', 'edit', 'view', 'disable', 'delete']
                    }
                },
                {
                    // 数据通道配置
                    path: 'dataChannelConfig',
                    component: () => import('@/views/basicConfig/scadaConfig/DataChannelConfig/list'),
                    name: 'dataChannelConfig',
                    meta: {
                        title: 'DataChannelConfig',
                        permission: ['add', 'edit', 'view', 'disable', 'delete']
                    }
                },
                {
                    // 通信模型配置
                    path: 'communicationModelConfig',
                    component: () => import('@/views/basicConfig/scadaConfig/CommunicationModelConfig/list'),
                    name: 'communicationModelConfig',
                    meta: {
                        title: 'CommunicationModelConfig',
                        permission: ['add', 'edit', 'view', 'delete']
                    }
                }
            ]
        },
    ],
}
export default basicConfig
