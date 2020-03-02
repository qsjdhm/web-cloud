<template>
    <div
        v-if="tableRenderToggle"
        class="equipment-status-table-pack"
    >
        <el-table
            border
            :data="tableData"
            style="width: 100%"
            height="530"
            :summary-method="getSummaries"
            show-summary
        >
            <el-table-column
                label="编号"
                width="100"
                align="center"
            >
                <template slot-scope="scope">
                    {{ scope.row.equipmentNo }}
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                align="center"
            >
                <el-table-column
                    label="加工中"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.processingDuration }}min</span><br>
                        <span>{{ numberOperation(scope.row.processingDurationProportion * 100) }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="空闲"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.idlingDuration }}min</span><br>
                        <span>{{ numberOperation(scope.row.idlingDurationProportion * 100) }}%</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="关机"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.shutdownDuration }}min</span><br>
                        <span>{{ numberOperation(scope.row.shutdownDurationProportion * 100) }}%</span>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
/**
 * @module 设备状态表格
 * @author 李志鸣
 */
import Math from '@/utils/calculation';

export default {
    name: 'StatisticsCenterEquipmentStatusTable',
    props: {
        tableData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            // 表格强制刷新开关
            tableRenderToggle: true
        };
    },
    watch: {
        tableData: {
            handler(newVl, oldVal) {
                this.tableRenderToggle = false;
                this.$nextTick(() => {
                    this.tableRenderToggle = true;
                });
            },
            deep: true
        }
    },
    methods: {
        // 表格总计计算
        getSummaries(param) {
            if (param.data.length > 0) {
                const data = param.data;
                const sums = [];
                data.forEach((item, index) => {
                    if (index === 0) {
                        sums.push(item.processingDuration);
                        sums.push(item.idlingDuration);
                        sums.push(item.shutdownDuration);
                    } else {
                        sums[0] += item.processingDuration;
                        sums[1] += item.idlingDuration;
                        sums[2] += item.shutdownDuration;
                    }
                });
                let reduceValue = sums.map(item => item.toString() + 'min');
                reduceValue.unshift('合计');
                return reduceValue;
            } else {
                return ['合计', '-', '-', '-'];
            }
        },
        // 浮点类型计算
        numberOperation(number) {
            return Math.numberOperation(number);
        }
    }
};
</script>

<style lang="scss" scoped>
.equipment-status-table-pack {
    height: 551px;
    background-color: #ffffff;
    border-radius: 0 0 4px 4px;
    padding: 15px;
    .el-table {
        /deep/ .el-table__header-wrapper {
            height: auto !important;
        }
    }
}
</style>
