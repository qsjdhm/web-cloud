<!--生产信息组件 -->
<template>
    <div
        class="production-page pt-10"
        style="padding: 0px"
    >
        <bs-table
            ref="BsTable"
            :bs-data="bsData"
            :stripe="false"
        >
            <!-- 插槽套插槽 -->
            <template #operateHeader>
                <el-button
                    v-has="{role: 'productionExport'}"
                    v-waves
                    type="primary"
                    size="mini"
                    @click="exportClick()"
                >
                    <svg-icon icon-class="export" />
                    导出
                </el-button>
            </template>
            <!-- table中插槽-->
            <template #status="{scope}">

                <span
                    v-for="(item, index) in tagStatus"
                    :key="index"
                >
                    <span
                        v-if="item.en === scope.row.status"
                        class="circle-span"
                        :class="item.classCircle"
                    />
                    <span
                        v-if="item.en === scope.row.status"
                        :key="index"
                        :class="item.class"
                    >
                        {{ item.cn }}
                    </span>
                </span>
            </template>
            <template #operate="{scope}">
                <el-button type="text">编辑</el-button>
                <el-button type="text">配置</el-button>
                <el-button type="text">查看</el-button>
            </template>
        </bs-table>
    </div>
</template>

<script>
/**
 * @module 设备监控-设备生产信息
 * @author 齐闯
 */
import request from '@/utils/request';
var this_ = this;
export default {
    props: {
        fatherId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            // 状态
            tagStatus: [
                {
                    en: 'FINISHED',
                    cn: '完成',
                    class: 'success',
                    classCircle: 'success-circle'
                },
                {
                    en: 'IN_PRODUCTION',
                    cn: '生产中',
                    class: 'warning',
                    classCircle: 'warning-circle'
                },
                {
                    en: 'TO_BE_PRODUCED',
                    cn: '待生产',
                    class: 'danger',
                    classCircle: 'danger-circle'
                },
                {
                    en: 'UNKNOWN',
                    cn: '其它'
                    // class: 'danger',
                    // classCircle: 'danger-circle'
                }
            ],
            bsData: {
                searchConfig: {
                    showNum: '2',
                    fields: [
                        {
                            label: '工序名称',
                            type: 'INPUT',
                            key: 'processStepName',
                            placeholder: '请输入工序名称'
                        },
                        {
                            label: '时间范围',
                            value: ['', ''],
                            splitField: ['beginStartTime', 'endStartTime'],
                            type: 'DATERANGE',
                            key: 'NCName',
                            placeholder: '请选择时间'
                        },
                        {
                            label: '产品名称',
                            type: 'INPUT',
                            key: 'productName',
                            placeholder: '请输入产品名称'
                        },
                        {
                            label: '状态',
                            type: 'SELECT',
                            key: 'status',
                            placeholder: '请选择状态',
                            options: [
                                {
                                    label: '生产中',
                                    value: 'IN_PRODUCTION'
                                },
                                {
                                    label: '待生产',
                                    value: 'TO_BE_PRODUCED'
                                },
                                {
                                    label: '完成',
                                    value: 'FINISHED'
                                }
                            ]
                        }
                    ]
                },
                tableConfig: {
                    url:
                        '/SERVICE-BUSINESS/api/monitor/equipmentProductionInfo',
                    // url: '',
                    methods: 'get',
                    params: {
                        equipNo: ''
                    },
                    // 表格数据
                    data: [],
                    // 列配置
                    columns: [
                        {
                            type: 'index'
                        },
                        {
                            label: '派工单ID',
                            prop: 'no',
                            'min-width': 140
                        },
                        {
                            label: '工序名称',
                            prop: 'processStepName',
                            'min-width': 140
                        },
                        {
                            label: '产品名称',
                            prop: 'productName',
                            'min-width': 140
                        },
                        {
                            label: '产品批号',
                            prop: 'productBatchNo',
                            'min-width': 140
                        },
                        {
                            label: '工装编号',
                            prop: 'processEquipNo',
                            'min-width': 140
                        },
                        {
                            label: '开始时间',
                            align: 'center',
                            prop: 'startTime',
                            type: 'time',
                            'min-width': 140
                        },
                        {
                            label: '派工日期',
                            align: 'center',
                            prop: 'endDate',
                            // type: 'time',
                            'min-width': 140
                        },
                        {
                            label: '状态',
                            align: 'center',
                            prop: 'status',
                            slotName: 'status',
                            'min-width': 100
                        },
                        {
                            label: '程序号',
                            prop: 'programNo',
                            'min-width': 140
                        },
                        {
                            label: '用时(min)',
                            align: 'right',
                            prop: 'duration',
                            'min-width': 140
                        }
                    ]
                }
            },
            beginTime: '', //  自然周开始时间
            endTime: '' //  自然周结束时间
        };
    },
    watch: {
        fatherId: {
            handler(val) {
                // this.fatherId = _.cloneDeep(val);
                if (val !== '') {
                    this.bsData.tableConfig.params.equipNo = _.cloneDeep(val);
                    this.$nextTick(() => {
                        console.log(
                            '\x1B[32m%s\x1B[0m',
                            '打印====>',
                            this.bsData.tableConfig
                        );
                        this.$refs.BsTable.resetTable();
                    });
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.getNaturalWeek();
    },
    async mounted() {},
    methods: {
        //导出功能
        async exportClick() {
            let this_ = this;
            console.log(this_.$refs.BsTable.searchParams);
            try {
                /* todo @闯 导出参数可以从这里取 */
                let params = {
                    pageNum: this_.$refs.BsTable.searchParams.pageNum,
                    pageSize: this_.$refs.BsTable.searchParams.pageSize,
                    ...this_.$refs.BsTable.searchParams,
                    equipNo: this_.fatherId,
                    beginStartTime:
                        this_.$refs.BsTable.searchParams.beginStartTime === null
                            ? null
                            : new Date(
                                  this_.$refs.BsTable.searchParams.beginStartTime
                              ),
                    endStartTime:
                        this_.$refs.BsTable.searchParams.endStartTime === null
                            ? null
                            : new Date(
                                  this_.$refs.BsTable.searchParams.endStartTime
                              )
                };
                let res = await request({
                    url: `${process.env.VUE_APP_BASE_API}/SERVICE-BUSINESS/api/export/equipmentProductionInfo`,
                    method: 'post',
                    responseType: 'blob',
                    data: params
                });
                let objectUrl = URL.createObjectURL(res.data);
                const link = document.createElement('a');
                link.download = decodeURI(res.headers.filename);
                // link.download = decodeURI(res.headers['content-disposition'].split('=')[1])
                link.href = objectUrl;
                link.click();
                window.URL.revokeObjectURL(objectUrl);
            } catch (error) {
                throw error;
            }
        },
        //获取自然周的开始和结束时间
        getNaturalWeek() {
            let weekOfday = parseInt(this.$moment().format('d')); // 计算今天是这周第几天 周日为一周中的第一天
            let start = this.$moment()
                .subtract(weekOfday - 1, 'days')
                .format('YYYY-MM-DD HH:mm:ss'); // 周一日期
            let end = this.$moment()
                .add(7 - weekOfday, 'days')
                .format('YYYY-MM-DD HH:mm:ss'); // 周日日期
            let dayStart = new Date(
                new Date(new Date(start).toLocaleDateString()).getTime()
            ); //周一零点
            var dayEnd = new Date(
                new Date(new Date(end).toLocaleDateString()).getTime() +
                    24 * 60 * 60 * 1000 -
                    1
            ); //周日23:59
            this.bsData.tableConfig.params.beginStartTime = this.$moment(
                dayStart
            ).format('YYYY-MM-DD HH:mm:ss');
            this.bsData.tableConfig.params.endStartTime = this.$moment(
                dayEnd
            ).format('YYYY-MM-DD HH:mm:ss');
            this.bsData.searchConfig.fields[1].value[0] = this.$moment(
                dayStart
            ).format('YYYY-MM-DD HH:mm:ss');
            this.bsData.searchConfig.fields[1].value[1] = this.$moment(
                dayEnd
            ).format('YYYY-MM-DD HH:mm:ss');
        }
    }
};
</script>

<style lang="scss" scoped>
.production-page {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;

    .production-header {
        width: 100%;
        height: 36px;
        line-height: 36px;
    }
    .table {
        width: 100%;
        background: #fff;
    }

    // 总览设备列表样式
    .table {
        height: 100%;
    }
    //状态色值
    .success {
        color: #7ed321;
    }
    .warning {
        color: #f5a623;
    }
    .danger {
        color: #d0021b;
    }
    .info {
        color: #fafafa;
    }
    .success-circle {
        background: #7ed321;
    }
    .warning-circle {
        background: #f5a623;
    }
    .danger-circle {
        background: #d0021b;
    }
    .info-circle {
        background: #fafafa;
    }
}
</style>
