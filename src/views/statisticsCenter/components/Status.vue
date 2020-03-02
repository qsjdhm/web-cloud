<template>
    <div class="status-pack">
        <div class="left-pack">
            <!--设备列表-->
            <EquipmentList @onSelectChange="onEquipmentListSelectChange" />
        </div>
        <div class="right-pack">
            <div class="title-pack">
                <div />
                <div class="search-pack">
                    <el-date-picker
                        v-model="time"
                        size="mini"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    />
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-search"
                        style="margin-right: 10px;"
                        @click="doSearchClick"
                    >
                        搜索
                    </el-button>
                    <el-button
                        v-has="{role: 'statusExport'}"
                        size="mini"
                        style="margin-right: 10px; margin-left: 0;"
                        @click="doExportClick"
                    >
                        <svg-icon icon-class="export" />
                        <span style="margin-left: 5px">导出</span>
                    </el-button>
                </div>
            </div>
            <div class="chart-table-pack">
                <el-scrollbar>
                    <div
                        class="chart"
                        :span="11"
                    >
                        <!--设备状态图表-->
                        <EquipmentStatusChart
                            class="equipment-status-chart"
                            :equipment-status-chart-data="equipmentStatusChartData"
                        />
                        <!--设备利用率图表-->
                        <EquipmentUtilizationChart
                            class="equipment-utilization-chart"
                            :equipment-utilization-chart-data="equipmentUtilizationChartData"
                        />
                    </div>
                    <div
                        class="table"
                        :span="12"
                    >
                        <!--设备状态表格-->
                        <EquipmentStatusTable
                            class="equipment-status-table"
                            :table-data="tableData"
                        />
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * @module 统计中心-状态组件
 * @author 李志鸣
 */

import request from '@/utils/request';
import EquipmentList from './EquipmentList'; // 设备列表组件
import EquipmentStatusChart from './EquipmentStatusChart'; // 设备状态图表组件
import EquipmentUtilizationChart from './EquipmentUtilizationChart'; // 设备利用率图表组件
import EquipmentStatusTable from './EquipmentStatusTable'; // 设备状态表格

export default {
    name: 'StatisticsCenterStatus',
    components: {
        EquipmentList,
        EquipmentStatusChart,
        EquipmentUtilizationChart,
        EquipmentStatusTable
    },
    data () {
        return {
            // 时间范围
            time: [],
            // 已选择设备列表
            checkedEquipmentList: [],
            // 设备状态图表数据
            equipmentStatusChartData: {},
            // 设备利用率图表数据
            equipmentUtilizationChartData: {},
            // 表格数据
            tableData: [],
            // 是否达到请求条件
            firstRequest: false
        };
    },
    watch: {
        firstRequest() {
            if (this.firstRequest) {
                // 点击查询按钮
                this.doSearchClick();
            }
        }
    },
    mounted() {
        setTimeout(() => {
            // 解析一周的时间
            this.resolveAWeekDate();
        }, 0);
    },
    methods: {
        // 触发设备列表组件选择事件
        onEquipmentListSelectChange(selectData) {
            this.checkedEquipmentList = _.cloneDeep(selectData);
            this.firstRequest = true;
        },
        // 解析一周的时间
        resolveAWeekDate() {
            let end = this.$moment()
                .endOf('week')
                .add(1, 'day');
            let start = this.$moment()
                .startOf('week')
                .add(1, 'day');
            this.time = [start, end];
        },
        // 点击查询按钮
        async doSearchClick() {
            try {
                if (
                    this.time !== null &&
                    this.time.length > 0 &&
                    this.checkedEquipmentList.length > 0
                ) {
                    let params = {
                        startTime: this.time[0],
                        endTime: this.time[1],
                        equipmentNos: this.checkedEquipmentList
                    };
                    let res = await this.$service(
                        'post',
                        '/SERVICE-BUSINESS/api/equipmentStatusProportionHour/statics',
                        params
                    );
                    this.equipmentStatusChartData = _.cloneDeep(
                        res.statusProportion
                    );
                    this.equipmentUtilizationChartData = _.cloneDeep(
                        res.processingProportion
                    );
                    this.tableData = _.cloneDeep(res.equipmentStatics);
                } else {
                    this.$message.warning('请至少选择一个设备并选择查询时间！');
                }
            } catch (error) {
                throw error;
            }
        },
        // 点击导出按钮
        async doExportClick() {
            if (
                this.time !== null &&
                this.time.length > 0 &&
                this.checkedEquipmentList.length > 0
            ) {
                let params = {
                    startTime: this.time[0],
                    endTime: this.time[1],
                    equipmentNos: this.checkedEquipmentList
                };
                let res = await request({
                    url: `${process.env.VUE_APP_BASE_API}/SERVICE-BUSINESS/api/export/equipmentStatusStatics`,
                    method: 'post',
                    responseType: 'blob',
                    data: params
                });
                let objectUrl = URL.createObjectURL(res.data);
                const link = document.createElement('a');
                link.download = decodeURI(res.headers.filename);
                link.href = objectUrl;
                link.click();
                window.URL.revokeObjectURL(objectUrl);
            } else {
                this.$message.warning(
                    '请至少选择一个设备并选择查询时间，完成查询后进行导出操作！'
                );
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.status-pack {
    height: 100%;
    width: 100%;
    padding-top: 5px;
    .left-pack {
        height: 100%;
        float: left;
    }
    .right-pack {
        height: 100%;
        margin-left: 305px;
        .title-pack {
            width: 100%;
            height: 36px;
            background-color: #ffffff;
            border-radius: 4px 4px 0 0;
            margin-bottom: 5px;
            .search-pack {
                height: 36px;
                float: right;
                line-height: 36px;
                text-align: right;
            }
        }
        .chart-table-pack {
            height: calc(100vh - 136px);
            /deep/ .el-scrollbar {
                height: 100%;
                .el-scrollbar__wrap {
                    overflow-x: hidden !important;
                }
            }
            .chart {
                width: 49%;
                float: left;
                .equipment-status-chart {
                    width: 100%;
                    height: 273px;
                }
                .equipment-utilization-chart {
                    width: 100%;
                    height: 273px;
                    margin-top: 5px;
                }
            }
            .table {
                width: 50%;
                float: right;
                .equipment-status-table {
                    width: 100%;
                }
            }
        }
    }
}
</style>
