<template>
    <div class="equipment-list-pack">
        <el-row class="checked-pack">
            <el-col>
                <el-checkbox
                    v-model="allSelectToggle"
                    class="checked"
                    :indeterminate="indeterminateToggle"
                    @change="onAllSelectChange"
                />
                <span class="checked-text">全选</span>
            </el-col>
        </el-row>
        <div
            class="list-pack"
            :style="{'height': equipmentListHeight + 'px'}"
        >
            <el-scrollbar>
                <div class="row">
                    <div
                        v-for="(item, index) in equipmentList"
                        :key="index"
                        class="equipment"
                    >
                        <div
                            class="select"
                        >
                            <el-checkbox
                                v-model="item.checked"
                                style="padding-top: 8px;"
                                @change="onEquipmentSingleSelectChange(item)"
                            />
                        </div>
                        <div
                            class="equipment-code"
                            :title="item.no"
                            @click="doEquipmentCodeClick(index)"
                        >
                            <span>{{ item.no }}</span>
                        </div>
                    </div>
                    <div class="empty-item" />
                    <div class="empty-item" />
                    <div class="empty-item" />
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    /**
     * @module 统计中心-设备列表组件
     * @author 李志鸣
     */
    export default {
        name: 'StatisticsCenterEquipmentList',
        data () {
            return {
                // 设备列表高度
                equipmentListHeight: null,
                // 全选状态开关
                allSelectToggle: false,
                // 设备列表数据
                equipmentList: [],
                // 半选开关
                indeterminateToggle: false
            }
        },
        mounted () {
            setTimeout(() => {
                // 计算设备列表高度
                this.equipmentListHeight = document.getElementsByClassName('page-pack')[0].offsetHeight - 15 - 15 - 45 - 15 - 15 - 20
                // 获取设备列表
                this.getEquipmentList()
            }, 0)
        },
        methods: {
            // 状态判断
            checkedStatusJudge () {
                // 状态判断
                let checkedAll = this.equipmentList.every((item, index, array) => {
                    return item.checked === true
                })
                let noCheckedAll = this.equipmentList.every((item, index, array) => {
                    return item.checked === false
                })
                if (checkedAll) {
                    this.allSelectToggle = true
                    this.indeterminateToggle = false
                }
                if (noCheckedAll) {
                    this.allSelectToggle = false
                    this.indeterminateToggle = false
                }
                if (!checkedAll && !noCheckedAll) {
                    this.indeterminateToggle = true
                }
            },
            // 触发全选事件
            onAllSelectChange (val) {
                if (val) {
                    this.equipmentList.forEach((item, index) => {
                        item.checked = true
                    })
                } else {
                    this.equipmentList.forEach((item, index) => {
                        item.checked = false
                    })
                }
                // 状态判断
                this.checkedStatusJudge()
                // 向父组件传值
                this.sendDataForParentModule()
            },
            // 点击设备列表设备编号
            doEquipmentCodeClick (index) {
                this.equipmentList[index].checked = !this.equipmentList[index].checked
                // 状态判断
                this.checkedStatusJudge()
                // 向父组件传值
                this.sendDataForParentModule()
            },
            // 触发设备列表单选事件
            onEquipmentSingleSelectChange (selectData) {
                // 状态判断
                this.checkedStatusJudge()
                // 向父组件传值
                this.sendDataForParentModule()
            },
            // 获取设备列表
            async getEquipmentList () {
                let res = await this.$service('get', '/SERVICE-BUSINESS/api/equipment/byDatasource', {})
                let resolveEquipmentList = []
                res.forEach((item, index) => {
                    resolveEquipmentList.push({
                        id: item.id,
                        no: item.no,
                        checked: false
                    })
                })
                this.equipmentList = _.cloneDeep(resolveEquipmentList)
                if (this.equipmentList.length > 0) {
                    this.allSelectToggle = true
                    this.equipmentList.forEach((item, index) => {
                        item.checked = true
                    })
                    // 向父组件传值
                    this.sendDataForParentModule()
                }
            },
            // 向父组件传值
            sendDataForParentModule () {
                let resolveSelectData = []
                this.equipmentList.forEach((item, index) => {
                    if (item.checked) {
                        resolveSelectData.push(item.no)
                    }
                })
                this.$emit('onSelectChange', resolveSelectData)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .equipment-list-pack {
        height: 100%;
        width: 300px;
        background-color: #fff;
        border-radius: 4px;
        padding: 15px;
        .checked-pack {
            .checked {
                padding-left: 14px;
            }
            .checked-text {
                font-size: 12px;
                padding-left: 5px;
            }
        }
        .list-pack {
            overflow-y: auto;
            margin-top: 5px;
            /deep/ .el-scrollbar {
                height: 100%;
                .el-scrollbar__wrap {
                    overflow-x: hidden !important;
                }
            }
            .row {
                overflow: hidden;
                display: flex;
                justify-content: space-around;
                align-items: center;
                flex-wrap: wrap;
                .equipment {
                    margin-top: 10px;
                    width: 75px;
                    height: 28px;
                    border: 1px solid #cccccc;
                    border-radius: 3px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .select {
                        height: 28px;
                        width: 14px;
                        line-height: 28px;
                        /deep/ .el-checkbox {
                            padding: 0 !important;
                        }
                    }
                    .equipment-code {
                        margin-left:5px;
                        text-align: left;
                        height: 28px;
                        width: 45px;
                        line-height: 28px;
                        display: inline-block;
                        font-size: 12px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        cursor: pointer;
                    }
                }
                .empty-item {
                    height: 0px;
                    width: 75px;
                }
            }
            div:nth-child(1) {
                margin-top: 0;
            }
        }
    }
</style>
