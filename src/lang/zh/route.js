// 路由中英文对照

/* 基础配置 */
const basicConfig = {
    basicConfig: '基础配置',
    equipmentClassification: '设备分类',
    equipmentArchives: '设备档案',
    workCenter: '工作中心',
    queryDetail: '设备详情',
    archivesDetail: '档案详情',
    //SCADA配置
    ScadaConfig: 'SCADA配置',
    DataTemplate: '数据模板配置',
    DataChannelConfig: '数据通道配置',
    CommunicationModelConfig: '通信模型配置'
}
/* 系统管理 */
const system_management = {
    systemManage: '系统管理',
    department: '部门管理',
    user: '用户管理',
    role: '角色管理',
    dictionary: '字典管理',
    authority: '权限管理'
}
export default {
    ...basicConfig,
    ...system_management,
    welcome: '首页',
    page401: '401',
    page404: '404',
    profile: '个人中心',
    monitoring: '设备监控',
    programManage: '程序管理',
    programManageList: '程序管理',
    programManageView: '程序管理详情',
    statisticsCenter: '统计中心',
    statisticsCenterList: '统计中心',
    modeling: '建模',
    /* 生产工单 */
    productionWorkOrder: '生产工单',
    productionWorkOrderView: '工单详情',
    /* 车间看板 */
    kanBanWorkShop: '车间看板'
}
