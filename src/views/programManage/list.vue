<template>
    <!--程序管理列表页-->
    <vt-page type="one">
        <bs-table
            ref="bsTable"
            highlight-current-row
            :bs-data="bsData"
        >
            <template #programName="{scope}">
                <span
                    class="table-text"
                    @click="doViewClick(scope.row.programId)"
                >{{ scope.row.programName }}</span>
            </template>
            <template #actualStartTime="{scope}">
                <span>{{ scope.row.actualStartTime !== null ? $moment(scope.row.actualStartTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
            </template>
            <template #lastChangeTime="{scope}">
                <span>{{ scope.row.lastChangeTime !== null ? $moment(scope.row.lastChangeTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
            </template>
            <!-- <template #operate="{scope}">
                <el-button
                    v-has="{role: 'view'}"
                    type="text"
                    @click="doViewClick(scope.row.programId)"
                >
                    详情
                </el-button>
            </template> -->
        </bs-table>
    </vt-page>
</template>

<script>
    /**
     * @module 系统管理列表页
     * @author 李志鸣
     */
    export default {
        name: 'ProgramManageList',
        data () {
            return {
                // 表格配置项
                bsData: {
                    searchConfig: {
                        fields:[
                            {
                                label: '设备编号',
                                type: 'INPUT',
                                key: 'equipmentNo',
                                placeholder: '请输入设备编号'
                            },
                            {
                                label: '派工单ID',
                                type: 'INPUT',
                                key: 'workingOrderNo',
                                placeholder: '请输入派工单ID'
                            },
                            {
                                label: '工序名称',
                                type: 'INPUT',
                                key: 'processStepName',
                                placeholder: '请输入工序名称'
                            },
                            {
                                label: 'NC程序名称',
                                type: 'INPUT',
                                key: 'programName',
                                placeholder: '请输入NC程序名称'
                            }
                            // {
                            //     type: 'SELECT',
                            //     key: 'hasSynced',
                            //     placeholder: '请选择同步状态',
                            //     options: [
                            //         {label: '已同步', value: true},
                            //         {label: '未同步', value: false}
                            //     ]
                            // }
                        ]
                    },
                    tableConfig: {
                        url: '/SERVICE-BUSINESS/api/productionExecutionProgram/page',
                        methods: 'GET',
                        data: [],
                        columns: [
                            {
                                type: 'selection',
                                align: 'center'
                            },
                            {label: 'NC程序名称', prop: 'programName', slotName: 'programName'},
                            {label: '派工单ID', prop: 'workingOrderNo'},
                            {label: '工序名称', prop: 'processStepName'},
                            {label: '工装编号', prop: 'processEquipNo'},
                            {label: '设备编号', prop: 'equipmentNo'},
                            {label: '开始生产时间', 'min-width': 120, prop: 'actualStartTime', align: 'center', slotName: 'actualStartTime'},
                            {label: '修改次数', prop: 'changeCount', align: 'right'},
                            {label: '最后修改时间', prop: 'lastChangeTime', 'min-width': 120, align: 'center', slotName: 'lastChangeTime'},
                            {label: '文件数', prop: 'fileCount', align: 'right'},
                            {label: '同步数', prop: 'syncCount', align: 'right'}
                            // {label: '操作', slotName: 'operate', width: 55}
                        ]
                    }
                }
            }
        },
        methods: {
            // 点击详情按钮
            doViewClick (programId) {
                this.$router.push(
                    {
                        path: 'list/view',
                        query: {
                            id: programId
                        }
                    }
                )
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
