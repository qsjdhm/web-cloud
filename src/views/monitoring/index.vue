<!-- 设备监控模块 -->
<template>
    <div class="monitoring-page oneScreen">
        <!-- 左侧部分 -->
        <div class="page-left">
            <el-tabs
                v-model="activeName"
                @tab-click="handleClick"
            >
                <el-tab-pane
                    label="总览"
                    name="first"
                >
                    <el-input
                        v-model="searchInput"
                        size="mini"
                        class="overview-input"
                        placeholder="请输入内容"
                        clearable
                        @input="gitOverviewList()"
                    />
                    <div class="overview-identification">
                        <div class="identification-item">
                            <span class="item-status color-number">{{ equipmentStatusCount.PROCESSING }}</span>
                            <span class="item-status border-number">加工中</span>
                        </div>
                        <div class="identification-item">
                            <span class="item-status color-yellow">{{ equipmentStatusCount.IDLING }}</span>
                            <span class="item-status border-yellow">空闲</span>
                        </div>
                        <div class="identification-item">
                            <span class="item-status color-red">{{ equipmentStatusCount.SHUTDOWN }}</span>
                            <span class="item-status border-red">停机</span>
                        </div>
                    </div>
                    <div class="device-status">
                        <div
                            v-for="(item, index) in deviceList"
                            :key="index"
                            class="device-item"
                            :class="item.check ? 'check-yellow' : ''"
                            :title="item.equipmentNo"
                            @click="statusClick(item, index)"
                        >
                            <span class="span-img">
                                <img
                                    v-if="item.status === 'PROCESSING'"
                                    src="../../assets/monitoring/processing.png"
                                >
                                <img
                                    v-else-if="item.status === 'IDLING'"
                                    src="../../assets/monitoring/idle.png"
                                >
                                <img
                                    v-else-if="item.status === 'SHUTDOWN'"
                                    src="../../assets/monitoring/disable.png"
                                >
                            </span>
                            <!-- <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.equipmentNo"
                                placement="top-end"
                            >
                                <span class="span-text">{{ item.equipmentNo }}</span>
                            </el-tooltip> -->
                            <span class="span-text">{{ item.equipmentNo }}</span>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane
                    label="分组"
                    name="second"
                >
                    <el-input
                        v-model="filterText"
                        class="overview-input"
                        size="mini"
                        clearable
                        placeholder="请输入内容"
                    />
                    <el-tree
                        ref="tree"
                        v-loading="treeLoading"
                        :data="treeList"
                        highlight-current
                        node-key="nodeId"
                        class="tree-class"
                        :default-expanded-keys="expandedKeys"
                        :filter-node-method="filterNode"
                        :props="{children: 'children',label: 'label'}"
                        @node-click="handleNodeClick"
                    >
                        <span
                            slot-scope="{ node, data }"
                            class="custom-tree-node"
                            :title="data.label"
                        >
                            <img
                                v-if="data.type === 'CATEGORY' && selectTreeId !== data.categoryId"
                                src="../../assets/monitoring/fold.png"
                            >
                            <img
                                v-else-if="data.type === 'CATEGORY' && selectTreeId === data.categoryId"
                                src="../../assets/monitoring/select.png"
                            >
                            <img
                                v-else-if="data.type === 'EQUIPMENT'"
                                src="../../assets/monitoring/expand.png"
                            >
                            <span class="class-name">
                                {{ data.label }}
                            </span>
                            <span class="span-img">
                                <img
                                    v-if="data.equipmentStatus === 'PROCESSING'"
                                    src="../../assets/monitoring/processing.png"
                                >
                                <img
                                    v-else-if="data.equipmentStatus === 'IDLING'"
                                    src="../../assets/monitoring/idle.png"
                                >
                                <img
                                    v-else-if="data.equipmentStatus === 'SHUTDOWN'"
                                    src="../../assets/monitoring/disable.png"
                                >
                            </span>
                        </span>
                    </el-tree>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 右侧部分 -->
        <div class="page-right">
            <!-- 设备分组下的 设备分类页面 -->
            <Classification
                v-if="flag"
                :equip-no="equipNo"
                @updata="upDataClick"
            />
            <!-- 设备信息teb页面 -->
            <DeviceMonitoringInformation
                v-if="!flag"
                :category-id="categoryId"
            />
        </div>
    </div>
</template>

<script>
/**
 * @module 设备监控
 * @author 齐闯
 */
// 设备分组组件
import Classification from './components/Classification';
// 设备信息teb组件
import DeviceMonitoringInformation from './components/DeviceMonitoringInformation';
export default {
    components: {
        DeviceMonitoringInformation,
        Classification
    },
    data() {
        return {
            timer: null,
            activeName: 'first', // 选中的teb
            //分组参数
            treeLoading: false, // 树数据加载loading
            flag: false, // 显示分组还是信息页面
            selectTreeId: 0, // 当前选中树节点id;
            filterText: '', // 树节点过滤
            expandedKeys: [], // 默认展开的节点
            treeList: [], // 左侧树数据

            //总览参数
            searchInput: '', // 总览搜索字段
            categoryId: '', // 默认选中的设备列表id
            equipNo: '', // 默认选中的设备编号
            checkIndex: '', //选中设备下标
            deviceList: [], // 设备列表
            equipmentStatusCount: {} // 设备状态数据
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    async mounted() {
        if (this.activeName === 'first') {
            this.timer = setInterval(() => {
                // 获取所有机台数据
                this.gitOverviewList();
            }, 5000);
            this.gitOverviewList();
        }
        if (this.activeName === 'second') {
            this.timer = setInterval(() => {
                // 获取所有机台数据
                this.getTreeList();
            }, 5000);
            this.getTreeList();
        }
    },
    destroyed() {
        // 清空定时器
        clearInterval(this.timer);
    },
    methods: {
        // teb点击事件
        handleClick(tab, event) {
            if (tab._props.name === 'first') {
                this.flag = false;
                this.categoryId = this.deviceList[0].equipmentNo;
            }
            if (tab._props.name === 'second') {
                this.categoryId = '';
                this.getTreeList();
            }
        },
        // 树节点搜索事件
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 树节点点击事件
        handleNodeClick(data) {
            this.selectTreeId = data.categoryId;
            if (data.type === 'CATEGORY') {
                this.flag = true;
                this.equipNo = data.categoryId;
            } else {
                this.flag = false;
                this.categoryId = data.equipmentNo;
            }
            console.log(
                '\x1B[32m%s\x1B[0m',
                '打印categoryId====>',
                this.categoryId
            );
        },
        // 获取分组树数据
        async getTreeList() {
            let params = {
                equipmentNoOrName: ''
            };
            let res = await this.$service(
                'get',
                '/SERVICE-BUSINESS/api/monitor/categoryEquipmentGroup',
                params
            );
            this.treeList = _.cloneDeep(res);
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(res[0].nodeId);
            });
        },
        /*--------------------------------------总览设备逻辑-----------------------------------------*/
        // 设备选中事件
        statusClick(row, index) {
            row.check = !row.check;
            this.checkIndex = index;
            this.deviceList.forEach((item, itemIndex) => {
                if (index === itemIndex) {
                    item.check = true;
                    this.categoryId = row.equipmentNo;
                } else {
                    item.check = false;
                    this.categoryId = row.equipmentNo;
                }
            });
        },
        //更新事件
        upDataClick(data) {
            this.flag = data.flag;
            this.expandedKeys = data.expandedKeys;
            // this.expandedKeys = data.expandedKeys;
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(data.id);
            });
        },
        //获取总览列表数据
        async gitOverviewList() {
            let query = {
                search: this.searchInput
            };
            let res = await this.$service(
                'get',
                '/SERVICE-BUSINESS/api/monitor/equipmentMonitor',
                query
            );
            this.deviceList = _.cloneDeep(res.equipmentList);
            // this.categoryId = res.equipmentList[0].equipmentNo;
            this.equipmentStatusCount = _.cloneDeep(res.equipmentStatusCount);
            if (this.activeName === 'first') {
                if (this.categoryId === '') {
                    this.deviceList[0].check = true;
                    this.categoryId = res.equipmentList[0].equipmentNo;
                } else {
                    this.deviceList.forEach((item, itemIndex) => {
                        if (this.checkIndex === '') {
                            this.deviceList[0].check = true;
                            this.categoryId = res.equipmentList[0].equipmentNo;
                        } else if (this.checkIndex === itemIndex) {
                            item.check = true;
                            this.categoryId = item.equipmentNo;
                        } else {
                            item.check = false;
                        }
                    });
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.monitoring-page {
    padding: 5px;
    background: $pageBg;
}
.page-left {
    width: 280px;
    height: 100%;
    float: left;
    background: #fff;
    padding: 0 10px 10px 10px;
    border-radius: 4px;

    //teb总览样式
    .overview-input {
        border-radius: 4px;
        width: 260px;
        font-size: 12px;

        /deep/.el-input__inner {
            border-radius: 4px !important;
            height: 32px;
        }
    }
    .overview-identification {
        width: 100%;
        height: 65px;
        display: flex;
        margin-top: 10px;
        justify-content: space-around;

        .identification-item {
            text-align: center;
            width: 70px;
            height: 56px;
            box-shadow: 0 2px 5px 3px rgba(0, 0, 0, 0.1);

            .item-status {
                display: block;
                width: 100%;
                height: 28px;
                line-height: 28px;
                font-size: 13px;
            }
            .color-number {
                color: #41da8f;
                font-weight: 600;
                font-size: 14px;
            }
            .color-yellow {
                color: #ffb95b;
                font-weight: 600;
                font-size: 14px;
            }
            .color-red {
                color: #d0021b;
                font-weight: 600;
                font-size: 14px;
            }
            .border-number {
                border-bottom: 2px solid #41da8f;
            }
            .border-yellow {
                border-bottom: 2px solid #ffb95b;
            }
            .border-red {
                border-bottom: 2px solid #d0021b;
            }
        }
    }

    .el-tabs {
        width: 100%;
        height: 100%;
        position: relative;

        //teb样式重置
        /deep/.el-tabs__nav-scroll {
            .el-tabs__nav {
                float: none !important;
                text-align: center;

                .el-tabs__active-bar {
                    width: 40px !important;
                    left: 48px;
                }
                .el-tabs__item {
                    width: 50% !important;
                    padding: 0;
                }
            }
        }
        ::after {
            background-color: #fff !important;
        }
        /deep/.el-tabs__header is-top {
            border-radius: 4px;
        }
        /deep/.el-tabs__content {
            width: 100%;
            position: absolute;
            left: 0;
            right: 15px;
            top: 50px;
            bottom: 0;
            border-radius: 4px;

            .el-tab-pane {
                width: 100%;
                height: 100%;

                .el-tree {
                    overflow-y: auto;
                    height: 100% !important;
                }
            }
            // 总览设备列表样式
            .device-status {
                // height: 100%;
                position: absolute;
                left: 0;
                right: 0;
                top: 105px;
                bottom: 0;
                overflow: auto;

                .device-item {
                    width: 29%;
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    font-size: 12px;
                    float: left;
                    margin: 10px 0 0 7px;
                    margin-right: 3px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    cursor: pointer;

                    .span-img {
                        display: inline-block;
                        width: 30%;
                        text-align: right;
                        padding-right: 4px;

                        img {
                            width: 8px;
                            height: 8px;
                        }
                    }
                    .span-text {
                        display: inline-block;
                        // text-align: center;
                        width: 67%;
                        color: #444;
                        overflow: hidden; //超出的文本隐藏
                        text-overflow: ellipsis; //溢出用省略号显示
                        white-space: nowrap; //溢出不换行（一行内容）
                    }
                }

                .check-yellow {
                    border: 1px solid #438afe !important;
                    color: #438afe;
                    font-weight: normal;
                    background-color: rgba(67, 138, 254, 0.2);
                }
            }
        }
    }
    //分组树样式
    /deep/.el-tree > .el-tree-node {
        display: inline-block !important;
        width: 100% !important;
    }
    .tree-class {
        width: 100%;
        margin-top: 10px;

        .custom-tree-node {
            width: 100%;

            img {
                vertical-align: middle;
            }
        }

        .class-name {
            display: inline-block;
            max-width: 123px;
            margin: 4px 5px 0 4px;
            font-size: 12px;
            // color: #444;
        }
        .span-img {
            img {
                width: 8px;
                height: 8px;
            }
        }
    }
}
.page-right {
    margin-left: 285px;
    height: 100%;
    border-radius: 4px;
}
</style>
