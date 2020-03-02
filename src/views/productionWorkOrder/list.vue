<template>
    <!-- 生产工单列表页 -->
    <vt-page
        type="one"
        class="table_list"
    >
        <bs-table
            ref="bsTable"
            border
            highlight-current-row
            :bs-data="bsData"
        >
            <template #operateHeader>
                <el-button
                    type="primary"
                    size="mini"
                    @click="exportClick"
                >
                    <svg-icon icon-class="export" />
                    导出
                </el-button>
            </template>
            <template #no="{scope}">
                <span
                    class="table-text"
                    @click="viewBtnClick(scope.row)"
                >{{ scope.row.no }}</span>
            </template>
            <template #quantity="{scope}">
                <span>{{ scope.row.alreadyProducedQuantity + ' / ' + scope.row.quantity }}</span>
            </template>
            <template #startTime="{scope}">
                <span>{{ (scope.row.actualStartTime && scope.row.actualStartTime !=='') ? $moment(scope.row.actualStartTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
            </template>
            <template #endTime="{scope}">
                <span>{{ (scope.row.actualEndTime && scope.row.actualEndTime !=='') ? $moment(scope.row.actualEndTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
            </template>
            <template #status="{scope}">
                <!-- <span v-if="scope.row.status === 'TO_BE_PRODUCED'"><el-tag type="danger">待生产</el-tag></span>
                <span v-if="scope.row.status === 'IN_PRODUCTION'"><el-tag type="warning">生产中</el-tag></span>
                <span v-if="scope.row.status === 'FINISHED'"><el-tag type="success">完成</el-tag></span> -->
                <span
                    class="statusColor"
                    :class="scope.row.status === 'TO_BE_PRODUCED' ? 'border-red' : scope.row.status === 'IN_PRODUCTION' ? 'border-yellow' : scope.row.status === 'FINISHED' ? 'border-number' : ''"
                />
                <span
                    :class="scope.row.status === 'TO_BE_PRODUCED' ? 'text-red' : scope.row.status === 'IN_PRODUCTION' ? 'text-yellow' : scope.row.status === 'FINISHED' ? 'text-number' : ''"
                >
                    {{ statusType(scope.row.status) }}
                </span>
            </template>
            <!-- <template #operate="{scope}">
                <el-button
                    v-has="{role: 'view'}"
                    type="text"
                    @click="viewBtnClick(scope.row)"
                >
                    查看
                </el-button>
            </template> -->
        </bs-table>
    </vt-page>
</template>

<script>
/**
 * @module 生产工单列表页
 * @author chebin
 */
import request from '@/utils/request'

export default {
    name: 'ProductionWorkOrder',
    data() {
        return {
            //表格数据
            tableListData: [],
            // 表格配置项
            bsData: {
                searchConfig: {
                    fields: [
                        {
                            value: ['', ''],
                            splitField: ['startFinishedTime', 'endFinishedTime'],
                            type: 'DATERANGE',
                            key: 'NCName',
                            label: '结束时间'
                        },
                        {
                            type: 'INPUT',
                            key: 'equipNo',
                            placeholder: '请输入设备编号',
                            label: '设备编号'
                        },
                        {
                            type: 'INPUT',
                            key: 'productName',
                            placeholder: '请输入产品名称',
                            label: '产品名称'
                        },
                        {
                            type: 'INPUT',
                            key: 'executionPerson',
                            placeholder: '请输入操作者',
                            label: '操作者'
                        },
                        {
                            type: 'INPUT',
                            key: 'executionPerson',
                            placeholder: '请输入操作者',
                            label: '操作者'
                        },
                        {
                            type: 'INPUT',
                            key: 'executionPerson',
                            placeholder: '请输入操作者',
                            label: '操作者'
                        },
                        // {
                        //     type: 'INPUT',
                        //     key: 'executionPerson',
                        //     placeholder: '请输入操作者',
                        //     label: '操作者'
                        // },
                        // {
                        //     type: 'INPUT',
                        //     key: 'executionPerson',
                        //     placeholder: '请输入操作者',
                        //     label: '操作者'
                        // },
                        // {
                        //     type: 'INPUT',
                        //     key: 'executionPerson',
                        //     placeholder: '请输入操作者',
                        //     label: '操作者'
                        // },
                        // {
                        //     type: 'INPUT',
                        //     key: 'executionPerson',
                        //     placeholder: '请输入操作者',
                        //     label: '操作者'
                        // }
                    ]
                },
                tableConfig: {
                    // this.$service('GET', '/SERVICE-BUSINESS/api/productionExecutionPlanning/page', params)
                    url: '/SERVICE-BUSINESS/api/productionExecutionPlanning/page',
                    methods: 'GET',
                    params: {},
                    columns: [
                        // {
                        //     type: 'selection',
                        //     align: 'center'
                        // },
                        {label: '派工单ID', prop: 'no', color: 'red', slotName: 'no'},
                        {label: '产品名称', prop: 'productName'},
                        {label: '产品批号', prop: 'productBatchNo'},
                        // {label: '员工编号', prop: 'executionPersonNo'},
                        // {label: '操作者', prop: 'executionPerson'},
                        // {label: '工序名称', prop: 'processStepName'},
                        // {label: '设备编号', prop: 'equipNo'},
                        // {label: '生产进度', prop: 'quantity', slotName: 'quantity', align: 'right'},
                        // {
                        //     label: '开始时间',
                        //     prop: 'actualStartTime',
                        //     'min-width': 120,
                        //     slotName: 'startTime',
                        //     align: 'center'
                        // },
                        // {label: '结束时间', prop: 'actualEndTime', 'min-width': 120, slotName: 'endTime', align: 'center'},
                        // {label: '用时(min)', prop: 'duration', align: 'right'},
                        // {label: '状态', prop: 'status', width: 105, slotName: 'status', align: 'center'}
                        // {label: '操作', slotName: 'operate', width: 55}
                    ]
                }
            }
        }
    },
    created() {
        this.getNaturalWeek()
    },
    mounted() {
        // // this.$refs.bsTable.searchParams

        // this.$refs.bsTable.initTable();
    },
    methods: {
        statusType(val) {
            switch (val) {
            case 'TO_BE_PRODUCED':
                return '待生产';
            case 'IN_PRODUCTION':
                return '生产中';
            case 'PRODUCING':
                return 'warning';
            case 'FINISHED':
                return '完成';
            default:
                return '-'
            }
        },
        //获取自然周的开始和结束时间
        getNaturalWeek() {
            let weekOfday = parseInt(this.$moment().format('d')); // 计算今天是这周第几天 周日为一周中的第一天
            let start = this.$moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD HH:mm:ss'); // 周一日期
            let end = this.$moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD HH:mm:ss'); // 周日日期
            let dayStart = new Date(new Date(new Date(start).toLocaleDateString()).getTime());//周一零点
            var dayEnd = new Date(new Date(new Date(end).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);//周日23:59
            this.bsData.tableConfig.params.startFinishedTime = this.$moment(dayStart).format('YYYY-MM-DD HH:mm:ss');
            this.bsData.tableConfig.params.endFinishedTime = this.$moment(dayEnd).format('YYYY-MM-DD HH:mm:ss');
            // this.bsData.searchConfig.fields[3].value[0] = this.$moment(dayStart);
            this.bsData.searchConfig.fields[0].value[0] = this.$moment(dayStart).format('YYYY-MM-DD HH:mm:ss');
            this.bsData.searchConfig.fields[0].value[1] = this.$moment(dayEnd).format('YYYY-MM-DD HH:mm:ss');
        },
        //导出文件
        async exportClick() {
            /* todo 获取表格中搜索数据 */
            this.$refs.bsTable.searchParams.endFinishedTime = this.$moment(this.$refs.bsTable.searchParams.endFinishedTime)
            this.$refs.bsTable.searchParams.startFinishedTime = this.$moment(this.$refs.bsTable.searchParams.startFinishedTime)
            console.log(this.$refs.bsTable.searchParams)
            // this.bsData.searchConfig.fields[3].value[0] = this.$moment(dayStart);
            // this.bsData.searchConfig.fields[3].value[1] = this.$moment(dayEnd);
            let params = {
                pageNum: this.$refs.bsTable.tableConfig.pagination['current-page'],
                pageSize: this.$refs.bsTable.tableConfig.pagination['page-size'],
                ...this.$refs.bsTable.searchParams
            }
            let res = await request({
                url: `${process.env.VUE_APP_BASE_API}/SERVICE-BUSINESS/api/export/planning`,
                method: 'post',
                responseType: 'blob',
                data: params
            })
            let objectUrl = URL.createObjectURL(res.data)
            const link = document.createElement('a')
            /*我们取文件名的方式需要跟后端确认，通过返回的Request Headers中哪个项取值，此处建议文件流下载通过同样的取值方式取值*/
            // link.download = decodeURI(res.headers['content-disposition'].split('=')[1])
            link.download = decodeURI(res.headers.filename)
            link.href = objectUrl
            link.click()
            window.URL.revokeObjectURL(objectUrl)
        },
        // 查看工单
        viewBtnClick(row) {
            this.$router.push({path: 'list/view', query: row})
        }
    }
}
</script>

<style lang="scss" scoped>
.table_list {
    position: relative;

    .export {
        position: absolute;
        width: 73px;
        height: 32px;
        top: 39px;
        // margin-top:
    }

    .statusColor {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .border-red {
        background: #D0021B;
        color: #D0021B;
    }

    .border-number {
        background: #7ed321;
        color: #7ed321;
    }

    .border-yellow {
        background: #f5a623;
        color: #f5a623;
    }

    .text-red {
        color: #D0021B;
    }

    .text-number {
        color: #7ed321;
    }

    .text-yellow {
        color: #f5a623;
    }

}
</style>
