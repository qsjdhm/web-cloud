<!-- 设备监控 右侧页面 分组页面-->
<template>
    <div class="group-page">
        <div
            v-for="(item, index) in deviceGroupingList"
            :key="index"
            class="group-item"
        >
            <div class="common-title-pack">
                <div class="text-pack">
                    {{ isOwnEmpty(item.equipmentSystem) && item.equipmentSystem.equipmentName !== null ? item.equipmentSystem.equipmentName : '-' }}
                    {{ isOwnEmpty(item.equipmentSystem) && item.equipmentSystem.equipmentNo !== null ? item.equipmentSystem.equipmentNo : '-' }}
                </div>
                <div
                    class="icon-right"
                    @click="detailsClick(item)"
                >
                    <i class="el-icon-d-arrow-right" />
                </div>
            </div>
            <div class="item-box">
                <el-row :gutter="20">
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">主轴转速</span>
                        <span class="span-value">{{ isOwnEmpty(item.equipmentSystem) && item.equipmentSystem.spindleSpeed !== null ? item.equipmentSystem.spindleSpeed : '-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">主轴负载</span>
                        <span class="span-value">{{ isOwnEmpty(item.equipmentSystem) && item.equipmentSystem.spindleLoad !== null ? item.equipmentSystem.spindleLoad : '-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">进给倍率</span>
                        <span class="span-value">{{ isOwnEmpty(item.equipmentSystem) && item.equipmentSystem.feedShaftRatio !== null ? item.equipmentSystem.feedShaftRatio :'-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">派工单ID</span>
                        <!-- <span class="span-value">{{ item.workOrders = null ? '_' : item.workOrders.no === null ? '-' : item.workOrders.no }}</span> -->
                        <span class="span-value">{{ item.workOrders.length !== 0 && item.workOrders[0].no !== null ? item.workOrders[0].no : '-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">产品品号</span>
                        <span class="span-value">{{ item.workOrders.length !== 0 && item.workOrders[0].productNo !== null ? item.workOrders[0].productNo : '-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">产品批号</span>
                        <span class="span-value">{{ item.workOrders.length !== 0 && item.workOrders[0].productBatchNo !== null ? item.workOrders[0].productBatchNo : '-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">当前工序</span>
                        <span class="span-value">{{ item.workOrders.length !== 0 && item.workOrders[0].processStepName !== null ? item.workOrders[0].processStepName : '-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">工装编号</span>
                        <span class="span-value">
                            <span v-if="item.workOrders.length === 0">-</span>
                            <span v-else-if="item.workOrders[0].processEquips.length === 0">-</span>
                            <span
                                v-for="(row, rowIndex) in item.workOrders[0].processEquips"
                                v-else
                                :key="rowIndex"
                            >
                                {{ row.processEquipNo === null ? '-' : row.processEquipNo }}
                                <span v-if="item.workOrders[0].processEquips.length > 1 && rowIndex !== item.workOrders[0].processEquips.length - 1">,</span>
                            </span>
                        </span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">操作者</span>
                        <span class="span-value">{{ item.workOrders.length !== 0 && item.workOrders[0].executionPerson !== null ? item.workOrders[0].executionPerson : '-' }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">加工进度</span>
                        <span class="span-value">
                            <span v-if="item.workOrders.length !== 0">
                                <el-progress
                                    :text-inside="true"
                                    :stroke-width="13"
                                    :percentage="Number(((Number(item.workOrders[0].productQuantity)/Number(item.workOrders[0].quantity)) * 100).toFixed(0))"
                                />
                                <p>{{ item.workOrders[0].productQuantity }}/{{ item.workOrders[0].quantity }}</p>
                            </span>
                            <span v-else>
                                <el-progress
                                    :text-inside="true"
                                    :stroke-width="13"
                                    :percentage="0"
                                />
                                <p>0/0</p>
                            </span>
                        </span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">工单数量</span>
                        <span class="span-value">{{ item.workOrders.length !== 0 ? item.workOrders.length : '-' }}</span>
                    </el-col>
                </el-row>
                <span class="status-tag">
                    <span v-if="isOwnEmpty(item.equipmentSystem) && item.equipmentSystem.processingStatus !== null">
                        <span
                            v-for="(data, dataIndex) in tagStatus"
                            :key="dataIndex"
                        >
                            <el-tag
                                v-if="data.en === item.equipmentSystem.processingStatus"
                                :key="dataIndex"
                                :type="data.type"
                            >
                                {{ data.cn }}
                            </el-tag>
                        </span>
                    </span>
                    <span v-else>
                        <el-tag type="info">-</el-tag>
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * @module 设备监控-设备分组页面
 * @author 齐闯
 */
export default {
    props: {
        equipNo: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            tagStatus: [
                { en: 'PROCESSING', cn: '加工中', type: '' },
                { en: 'IDLING', cn: '空闲', type: 'warning' },
                { en: 'SHUTDOWN', cn: '停机', type: 'success' },
                { en: 'UNKNOWN', cn: '其它', type: 'info' }
            ], // 设备状态
            equipmentNoId: '', // 选中的设备编号
            categoryId: '', // 设备编号对应的左侧树的节点id
            treeList: [], // 左侧树数据
            deviceGroupingList: [] // 设备分组数据
        };
    },
    watch: {
        equipNo: {
            handler(val) {
                this.getEquipmentGroup();
            },
            deep: true,
            immediate: true
        }
    },
    async mounted() {},
    methods: {
        // 方法
        isOwnEmpty(obj) {
            let flag = false;
            for (let name in obj) {
                if (!obj.name) {
                    flag = true;
                }
            }
            return flag;
        },
        //更多事件
        detailsClick(data) {
            this.equipmentNoId = data.equipmentSystem.equipmentNo;
            this.getTreeList();
        },
        //树结构数据处理
        stationRecursive(data) {
            let this_ = this;
            const getStr = function(data) {
                data.map(function(row) {
                    if (
                        row.equipmentNo !== null &&
                        row.equipmentNo === this_.equipmentNoId
                    ) {
                        let query = {
                            flag: false,
                            id: row.nodeId,
                            equipmentNo: row.equipmentNo,
                            expandedKeys: [this_.equipNo]
                        };
                        this_.$emit('updata', query);
                        return false;
                    } else if (row.children !== null) {
                        getStr(row.children);
                    }
                });
            };
            getStr(data);
        },
        // 左侧树数据
        async getTreeList() {
            let params = {
                equipmentNoOrName: ''
            };
            let res = await this.$service(
                'get',
                '/SERVICE-BUSINESS/api/monitor/categoryEquipmentGroup',
                params
            );
            this.stationRecursive(res);
        },
        // 获取设备监控分组数据
        async getEquipmentGroup() {
            let params = {
                categoryId: this.equipNo
            };
            let res = await this.$service(
                'get',
                '/SERVICE-BUSINESS/api/monitor/equipmentGroup',
                params
            );
            if (res.length !== 0) {
                this.deviceGroupingList = _.cloneDeep(res);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.group-page {
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .group-item {
        width: 100%;
        height: 160px;
        padding: 0 10px;
        background: #fff;
        border-radius: 4px;
        margin-bottom: 5px;

        .common-title-pack {
            height: 32px;
            line-height: 32px;
            display: flex;
            font-weight: 600;
            font-size: 14px;
            justify-content: space-between;
        }
        .icon-right {
            width: 30px;
            text-align: center;
            float: right;
            cursor: pointer;
        }

        .item-box {
            width: 100%;
            height: 128px;
            padding: 0;
            position: relative;

            .status-tag {
                width: 60px;
                height: 40px;
                position: absolute;
                right: 20px;
                top: 75px;
                display: inline-block;
            }
        }

        //详情页title文字样式重置
        .detail-title {
            span {
                /deep/.el-progress {
                    margin-top: 9px;
                    width: 80%;
                    height: 100%;
                    display: inline-block;
                }
                p {
                    display: inline-block;
                    margin: 0 0 0 3px;
                    padding: 0;
                    width: 30px;
                    height: 32px;
                    line-height: 32px;
                }
            }
        }
    }
}
</style>
