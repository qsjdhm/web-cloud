<template>
    <div
        id="workOrderDetils"
        class="workOrderDetils"
    >
        <!-- 头部关键信息显示 -->
        <div class="detail_title_pack">
            <div class="title_container">
                <div class="product_name"><span>{{ $route.query.productName }}</span></div>
                <div class="product_batch_No">{{ $route.query.productBatchNo }}</div>
                <div
                    v-if="$route.query.status === 'FINISHED'"
                    class="status"
                ><el-tag type="success">已完成</el-tag></div>
                <div
                    v-if="$route.query.status === 'TO_BE_PRODUCED'"
                    class="status"
                ><el-tag type="danger">待生产</el-tag></div>
                <div
                    v-if="$route.query.status === 'IN_PRODUCTION'"
                    class="status"
                ><el-tag type="warning">生产中</el-tag></div>
                <div class="return-pack">
                    <el-button
                        size="mini"
                        @click="goBackClick"
                    >返回</el-button>
                </div>

            </div>
        </div>
        <!-- 工单信息 -->
        <div class="orderInformation_pack">
            <div class="orderInformation">
                <div class="title_logo" />
                <div class="title_name">工单详细信息</div>
                <div class="workOrderDetail">
                    <el-row :gutter="20">
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">派工单ID</span>
                            <span class="span-value">{{ orderInformation.no }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">工序名称</span>
                            <span class="span-value">{{ orderInformation.processStepName }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">开始时间</span>
                            <span class="span-value">{{ orderInformation.actualStartTime ? $moment(orderInformation.actualStartTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">产品名称</span>
                            <span class="span-value">{{ orderInformation.productName }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">设备编号</span>
                            <span class="span-value">{{ orderInformation.equipNo }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">结束时间</span>
                            <span class="span-value">{{ orderInformation.actualEndTime ? $moment(orderInformation.actualEndTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">生产批号</span>
                            <span class="span-value">{{ orderInformation.productBatchNo }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">生产进度</span>
                            <span class="span-value">{{ orderInformation.alreadyProducedQuantity +'/'+ orderInformation.quantity }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">用时(min)</span>
                            <span class="span-value">{{ orderInformation.duration ? orderInformation.duration : '-' }}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">派工日期</span>
                            <span class="span-value">{{ orderInformation.endDate ? $moment(orderInformation.endDate).format('YYYY-MM-DD') : '-' }}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>

        </div>

        <!-- 生产数据 -->
        <div class="orderInformation_pack product_data_pack">
            <div class="orderInformation">
                <div class="title_logo" />
                <div class="title_name product_name">生产数据</div>
                <div class="about_time">
                    <span
                        class="span-label marg_r10"
                        style="font-size:14px"
                    >开始时间</span>
                    <el-date-picker
                        v-model="productionStartTime"
                        type="datetime"
                        size="mini"
                        placeholder="选择开始日期时间"
                        :picker-options="pickerOptions0"
                        @change="changeStartTime"
                    />
                    <span
                        class="span-label marg_r10"
                        style="margin-left:60px;font-size:14px"
                    >结束时间</span>
                    <el-date-picker
                        v-model="productionEndTime"
                        size="mini"
                        type="datetime"
                        :picker-options="pickerOptions1"
                        placeholder="选择结束日期时间"
                        @change="changeEndTime"
                    />
                    <el-button
                        class="search_time"
                        size="mini"
                        type="primary"
                        icon="el-icon-search"
                        @click="searchByTimeClick()"
                    >搜索</el-button>
                </div>
                <!-- style="height:200px" -->
                <el-row
                    :gutter="20"
                >
                    <el-col :span="12">
                        <Order-Charts
                            ref="orderCharts"
                            :feed-shaft-ratio="feedShaftRatio"
                            :spindle-load="spindleLoad"
                            :create-time="createTime"
                            :echarts-start-time="productionStartTime"
                            :echarts-end-time="productionEndTime"
                        />
                    </el-col>
                    <el-col :span="12">
                        <Collar
                            :normal-time="normalPercentage"
                            :less-than-normal="lessThanNormalPercentage"
                            :more-than-normal="moreThanNormalPercentage"
                            :less-than-normal-duration="lessThanNormalDuration"
                            :normalduration="normalduration"
                            :more-than-normal-duration="moreThanNormalDuration"
                            @renderMarkLine="capOfflineConfirm"
                        />
                    </el-col>
                </el-row>

            </div>
        </div>
        <!-- 生产时序 -->
        <div class="orderInformation_pack product_data_pack">
            <div class="orderInformation">
                <div class="title_logo" />
                <div class="title_name product_name">生产时序</div>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <TimmingCharts
                            :charts-data="productionTimmingData"
                            :order-start-time="productionStartTime"
                            :order-end-time="productionEndTime"
                        />
                    </el-col>
                    <el-col :span="12">
                        <div class="duration-footer">
                            <div
                                v-for="(item, index) in statusList"
                                :key="index"
                                :class="item.name === '状态' ? 'status-bg' : ''"
                                class="status"
                            >
                                <div class="status-top status-bg">
                                    {{ item.name }}
                                </div>
                                <div class="status-main ">
                                    {{ item.duration }}
                                </div>
                                <div class="status-footer">
                                    {{ item.radio }}
                                </div>
                                <div class="status-total">
                                    {{ item.totalDuration }}
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
     /**
     * @module 生产工单详情页
     * @author chebin
     */
import OrderCharts from './components/OrderCharts'
import Collar from './components/Collar'
import TimmingCharts from './components/TimmingCharts'

export default {
    components: {
        OrderCharts,
        Collar,
        TimmingCharts
    },
    data () {
        return {
            // 生产时序图表与表格数据
            productionTimmingData: {},
            statusList: [
                    {
                        name: '状态',
                        duration: '时长/min',
                        radio: '比率',
                        totalDuration: '总时长'
                    },
                    {
                        name: '加工中',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '首检时间',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '设备故障',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '待工待料',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '交接班',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '培训开会',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '换刀具',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '调工装',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '返修',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    },
                    {
                        name: '日常保养',
                        duration: '',
                        radio: '',
                        totalDuration: ''
                    }
                ],
            // 工单信息
            orderInformation: {},
            // 生产数据- 工单开始时间
            productionStartTime: '',
            // 生产数据-工单结束时间
            productionEndTime: '',
            // 生产数据 -图表-进给轴倍率数据
            feedShaftRatio:[],
            // 生产数据-图表-主轴负载
            spindleLoad: [],
            // 生产数据-图表-时间（X）
            createTime: [],
            /*传给子组件*/
            normalPercentage: '', //轴倍率百分比
            lessThanNormalPercentage: '', //轴倍率百分比
            moreThanNormalPercentage: '', //轴倍率百分比
            lessThanNormalDuration:0,//持续时间
            normalduration:0,//持续时间
            moreThanNormalDuration:0,//持续时间
            // 处理时间是否禁用
            pickerOptions0: {
                disabledDate: (time) => {
                    if (this.productionEndTime != "") {
                        return time.getTime() > Date.now() || time.getTime() > this.productionEndTime;
                    } else {
                        return time.getTime() > Date.now();
                    }

                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    return time.getTime() < this.productionStartTime || time.getTime() > Date.now();
                }
            },
        }
    },
    mounted () {
        // 获取工单信息
        this.getOrderInformation()
        this.$refs.orderCharts.renderEcharts()
        //获取页面详情数据
        this.getDetailsData()
        // 获取生产时序图数据
        this.getProductionTimmingData()
        // 获取开始，结束时间， 若后台没传来结束时间则获取当前时间
        this.getProductionTime()
        // 如果页面加载进来有开始跟结束时间 那么直接渲染一次echarts图表
        if (this.productionStartTime && this.productionEndTime) {
            // console.log('可以请求')
            this.searchByTimeClick()
        }
    },
    methods: {
        // 获取工单信息
        getOrderInformation () {
            this.orderInformation = _.cloneDeep(this.$route.query)
        },
        // 返回按钮点击事件
        goBackClick () {
            this.$store.dispatch('tagsView/delView', this.$route.path).then(() => {
                this.$router.push({
                    path: '/ProductionWorkOrder/list'
                })
            })
            // this.$store.dispatch('tagsView/delView', this.$route).then(() => {
            //         this.$router.push({
            //             path: '/programManage/list'
            //         })
            //     })
        },
        // 根据前一页面穿过来的Id获取详情数据
        getDetailsData () {

            let params = {
                productionPlanningId : this.$route.query.id
            }
            this.$service('GET', '/SERVICE-BUSINESS/api/monitor/productionData', params).then(res => {
                // console.log(res);
            })
        },
        // 获取开始结束时间， 若后台没传来结束时间则获取当前时间
        getProductionTime () {
            // if (this.orderInformation.actualEndTime || this.orderInformation.actualStartTime) {
            if (this.orderInformation.actualEndTime) {
                this.productionEndTime = _.cloneDeep(this.$moment(this.orderInformation.actualEndTime).format('YYYY-MM-DD HH:mm:ss'))
                // this.productionStartTime = _.cloneDeep(this.$moment(this.orderInformation.actualStartTime).format('YYYY-MM-DD HH:mm:ss'))
                // console.log(this.productionEndTime)
            }
            if (this.orderInformation.actualStartTime) {
                this.productionStartTime = _.cloneDeep(this.$moment(this.orderInformation.actualStartTime).format('YYYY-MM-DD HH:mm:ss'))
            }
            if (!(this.productionEndTime && this.productionEndTime !== '') && this.productionStartTime !== '') {
                this.productionEndTime = _.cloneDeep(this.$moment(Date.parse(new Date())).format('YYYY-MM-DD HH:mm:ss'))
            }
        },
        // 选择开始时间
        changeStartTime (val) {
            // console.log(val)
        },
        // 选择结束时间
        changeEndTime (val) {
            // console.log(val)
        },
        // 生产数据 根据选择 起止时间进行搜索
        searchByTimeClick() {
            if (this.productionStartTime && this.productionEndTime) {
                let params = {
                    productionPlanningId: this.$route.query.id,
                    startTime: this.$moment(this.productionStartTime).format('YYYY-MM-DD HH:mm:ss'),
                    endTime:  this.$moment(this.productionEndTime).format('YYYY-MM-DD HH:mm:ss')
                }
                // console.log('点击搜索，时间为-', params)
                this.$service('GET', '/SERVICE-BUSINESS/api/monitor/productionData', params).then(res => {
                    if (res.hasOwnProperty('equipmentSystems')) {
                        console.log('这是res =>', res);
                        this.createTime.length = 0;
                        this.feedShaftRatio.length = 0;
                        this.spindleLoad.length = 0;
                        for (let item of res.equipmentSystems) {
                            // this.createTime.push(this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'))
                            this.createTime.push(new Date(item.createTime).getTime())
                            this.feedShaftRatio.push([new Date(item.createTime).getTime(),item.feedShaftRatio])
                            this.spindleLoad.push([new Date(item.createTime).getTime(),item.spindleLoad])
                        }
                    }
                })
            } else {
                this.$message.warning('请选择正确的时间')
            }
        },
        // 组件中输入上下限值后的确认 (From: Collar)
        capOfflineConfirm(cap, offline) {
            if(this.productionStartTime && this.productionEndTime) {
                let params = {
                    productionPlanningId: this.$route.query.id,
                    startTime: this.$moment(this.productionStartTime).format('YYYY-MM-DD HH:mm:ss'),
                    endTime:  this.$moment(this.productionEndTime).format('YYYY-MM-DD HH:mm:ss'),
                    cap: (cap.replace('%', '')/100).toString(),
                    offline: (offline.replace('%', '')/100).toString()
                }
                this.$service('GET', '/SERVICE-BUSINESS/api/monitor/productionData', params).then(res => {
                    this.normalduration = _.cloneDeep(res.feedShaftRatioMap.middle)
                    this.lessThanNormalDuration = _.cloneDeep(res.feedShaftRatioMap.smaller)
                    this.moreThanNormalDuration = _.cloneDeep(res.feedShaftRatioMap.bigger)
                    this.lessThanNormalPercentage = '<'+ offline
                    this.moreThanNormalPercentage = '>'+ cap
                    this.normalPercentage = offline +'-'+ cap
                })
            }else {
                this.$message.warning('请选择正确的时间')
            }
        },
        // 获取生产时序图数据
        getProductionTimmingData () {
            // console.log('路由传来的', this.$route.query)
            let params = {productionId: this.$route.query.id }
            this.$service('GET', '/SERVICE-BUSINESS/api/productionExecutionStatusTimeSeries/productionTimeSeries/{productionId}', params).then(res => {
                this.productionTimmingData = _.cloneDeep(res)
                for (let i = 0; i < this.statusList.length; i++) {
                    this.statusList[1].duration = _.cloneDeep(this.productionTimmingData.table.PROCESSING.duration)
                    this.statusList[1].radio = _.cloneDeep(((this.productionTimmingData.table.PROCESSING.radio) * 100).toFixed(2) + '%')
                    this.statusList[2].duration = _.cloneDeep(this.productionTimmingData.table.FIRST_CHECKING.duration)
                    this.statusList[2].radio = _.cloneDeep(((this.productionTimmingData.table.FIRST_CHECKING.radio) * 100).toFixed(2) + '%')
                    this.statusList[3].duration = _.cloneDeep(this.productionTimmingData.table.EQUIP_FAILURE.duration)
                    this.statusList[3].radio = _.cloneDeep(((this.productionTimmingData.table.EQUIP_FAILURE.radio) * 100).toFixed(2) + '%')
                    this.statusList[4].duration = _.cloneDeep(this.productionTimmingData.table.RESOURCE_WAITING.duration)
                    this.statusList[4].radio = _.cloneDeep(((this.productionTimmingData.table.RESOURCE_WAITING.radio) * 100).toFixed(2) + '%')
                    this.statusList[5].totalDuration = _.cloneDeep(this.productionTimmingData.totalMinutes) + 'min'
                    this.statusList[5].duration = _.cloneDeep(this.productionTimmingData.table.WORKING_SHIFT_EXCHANGING.duration)
                    this.statusList[5].radio = _.cloneDeep(((this.productionTimmingData.table.WORKING_SHIFT_EXCHANGING.radio) * 100).toFixed(2) + '%')
                    this.statusList[6].duration = _.cloneDeep(this.productionTimmingData.table.TRAINING.duration)
                    this.statusList[6].radio = _.cloneDeep(((this.productionTimmingData.table.TRAINING.radio) * 100).toFixed(2) + '%')
                    this.statusList[7].duration = _.cloneDeep(this.productionTimmingData.table.CUTTER_CHANGING.duration)
                    this.statusList[7].radio = _.cloneDeep(((this.productionTimmingData.table.CUTTER_CHANGING.radio) * 100).toFixed(2) + '%')
                    this.statusList[8].duration = _.cloneDeep(this.productionTimmingData.table.PROCESS_EQUIP_CHANGING.duration)
                    this.statusList[8].radio = _.cloneDeep(((this.productionTimmingData.table.PROCESS_EQUIP_CHANGING.radio) * 100).toFixed(2) + '%')
                    this.statusList[9].duration = _.cloneDeep(this.productionTimmingData.table.REWORKING.duration)
                    this.statusList[9].radio = _.cloneDeep(((this.productionTimmingData.table.REWORKING.radio) * 100).toFixed(2) + '%')
                    this.statusList[10].duration = _.cloneDeep(this.productionTimmingData.table.MAINTAINING.duration)
                    this.statusList[10].radio = _.cloneDeep(((this.productionTimmingData.table.MAINTAINING.radio) * 100).toFixed(2) + '%')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

    /deep/ .list-contain {
        display: flex;
        flex-direction: column;
        padding: 0 30px;
    }
    .return-pack {
            float: right;
            // height: 45px;
            line-height: 31px;
            // font-size: 18px;
        }
    // .svg-icon {
    //     font-size: 20px;
    // }
    .search_time {
        margin-left: 40px;
        margin-top: 5px;
    }
    .workOrderDetils {
        // 详情页头
        .detail_title_pack {
            padding: 5px;
            padding-bottom: 0px;
            .title_container {
                width: 100%;
                height: 100%;
                background-color: #fff;
                border-radius: 8px;
                padding: 6px 10px;
                .product_name {
                    display: inline-block;
                    padding-right: 20px;
                    span {
                        font-size: 16px;
                        font-weight: 700;
                    }
                }
                .product_batch_No {
                    display: inline-block;
                    padding-right: 20px;
                }
                .status {
                    display: inline-block;
                }
            }
        }
        // 工单详情信息/生产数据
        .orderInformation_pack {
            padding: 5px;
            padding-bottom: 0px;

            .orderInformation {
                width: 100%;
                height: 100%;
                background-color: #fff;
                border-radius: 8px;
                padding: 5px 10px;;
                position: relative;

                .title_name {
                    display: inline-block;
                    font-weight: 700;
                    font-size: 14px;
                    padding: 5px 0 10px 0;
                }
                .product_name {
                    padding-bottom: 0;
                }

                .title_logo {
                    position: absolute;
                    top: 10px;
                    left: 0px;
                    width: 3px;
                    height: 16px;
                    background-color: #1890ff;
                }
                .about_time {
                    height: 32px;
                    // margin-bottom: 10px;
                    // margin-top: 10px;
                }
                .span-value {
                    font-weight: 700;
                }
            }
        }
        // 生产数据 input样式
        /deep/ .product_data_pack input{
            background-color: #f6f8fe;
        }
        .svg-icon {
            font-size: 20px;
            margin-right: 20px;
            color: #9b9b9b;
        }
        .product_data{
            height: 75px;
        }
        // margin-left: 15px;
        padding-bottom: 50px;
        .text-pack {
                font-weight: 700;
                width: 150px;
                height: 24px;
                font-family: PingFang-SC-Medium;
                font-size: 16px;
                // font-weight: 700;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #222222;
            }
        .order_details {
            position: relative;
            height: 220px;
            line-height: 220px;
            padding-bottom: 0 !important;

            .title_logo {
                // position: absolute;
                // left: 0;
                width: 5px;
                height: 20px;
                background-color: #1890ff;
            }
            .workOrderDetail {
                width: 1088px;
                height: 100px;
                padding-top: 20px;
                /deep/ .span-label {
                    margin-right: 70px;
                }
            }
        }
        .production_data {
            height: 162px;

            .production_time {
                padding-top: 20px;
            }
        }

        .orderDataCharts {
            width: 100%;
            height: 310px;
        }
        .start_end_time {
            height: 100px;
            line-height: 75px;
        }
        //生产时序
        .production_processes {
            width: 100%;
            height: 300px;
        }
        .all_time {
            padding-top: 10px;
            width: 150px;
            float: right;
            font-size: 18px;
        }
        .duration-footer {
            // margin-top: 45px;
            // padding: 15px;
            // height: 135px;
            width: 100%;
            background: #FFF;
            display: flex;
            border-radius: 8px 8px 8px 0;

            .status {
                width: 9%;
                height: 100%;
                font-size: 14px;
                text-align: center;

                .status-top {
                    height: 36px;
                    line-height: 36px;
                }
                .status-main {
                    width: 100%;
                    height: 38px;
                    line-height: 38px;
                    border: 1px solid #f6f8fe;
                }
                .status-footer {
                    height: 38px;
                    line-height: 38px;
                    border: 1px solid #f6f8fe;
                }
                .status-total {
                    height: 38px;
                    line-height: 38px;
                    border-bottom: 1px solid #f6f8fe;
                }
            }
            .status-bg {
                background: #f6f8fe;
            }
        }
        .pb_0 {
            padding-bottom: 0;
        }
        .pad_right_0 {
            padding-right: 0;
        }
        .pad_left_0 {
            padding-left: 0;
        }
        .marg_r10 {
            margin-right: 10px;
        }
    }
</style>
