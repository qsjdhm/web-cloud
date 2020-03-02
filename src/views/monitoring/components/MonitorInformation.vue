<!--监控信息组件 -->
<template>
    <div class="monitor-page">
        <!-- 设备监控信息 -->
        <div class="monitor-information">
            <common-title
                :options="{text: '监控信息', MLPx: 10}"
            />
            <div class="information-box">
                <el-row :gutter="20">
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">设备编号</span>
                        <span class="span-value">{{ equipmentRunningStatus.equipmentNo === '' || equipmentRunningStatus.equipmentNo === null ? '-' : equipmentRunningStatus.equipmentNo }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">主轴负载</span>
                        <span class="span-value">{{ equipmentRunningStatus.spindleLoad === '' || equipmentRunningStatus.spindleLoad === null ? '-' : equipmentRunningStatus.spindleLoad }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">主轴转速(r/min)</span>
                        <span class="span-value">{{ equipmentRunningStatus.spindleSpeed === '' || equipmentRunningStatus.spindleSpeed === null ? '-' : equipmentRunningStatus.spindleSpeed }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">进给倍率</span>
                        <span class="span-value">{{ equipmentRunningStatus.feedShaftRatio === '' || equipmentRunningStatus.feedShaftRatio === null ? '-' : equipmentRunningStatus.feedShaftRatio }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">加工模式</span>
                        <span class="span-value">{{ equipmentRunningStatus.runningMode === '' || equipmentRunningStatus.runningMode === null ? '-' : equipmentRunningStatus.runningMode }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">设备状态</span>
                        <span class="span-value">
                            <span
                                v-for="(item, index) in tagStatus"
                                :key="index"
                            >
                                <el-tag
                                    v-if="item.en === equipmentRunningStatus.processingStatus"
                                    :key="index"
                                    :type="item.type"
                                >
                                    {{ item.cn }}
                                </el-tag>
                                <!-- <el-tag
                                    v-else
                                    type="info"
                                >
                                    -
                                </el-tag> -->
                            </span>
                        </span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 生产信息 -->
        <div
            v-for="(item, index) in productionInfo"
            :key="index"
            class="production-information"
        >
            <common-title
                :options="{text: '生产信息', MLPx: 10}"
            />
            <div class="information-box">
                <el-row :gutter="20">
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">派工单ID</span>
                        <span class="span-value">{{ item.no === '' || item.no === null ? '-' : item.no }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">工序名称</span>
                        <span class="span-value">{{ item.processStepName === '' || item.processStepName === null ? '-' : item.processStepName }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">产品名称</span>
                        <span class="span-value">{{ item.productName === '' || item.productName === null ? '-' : item.productName }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">产品批号</span>
                        <span class="span-value">{{ item.productBatchNo === '' || item.productBatchNo === null ? '-' : item.productBatchNo }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">工装编号</span>
                        <span class="span-value">
                            <span v-if="item.processEquips.length === 0">-</span>
                            <span
                                v-for="(row, rowIndex) in item.processEquips"
                                v-else
                                :key="rowIndex"
                            >
                                {{ row.processEquipNo === null ? '-' : row.processEquipNo }}
                                <span v-if="item.processEquips.length > 1 && rowIndex !== item.processEquips.length - 1">,</span>
                            </span>
                        </span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">操作者</span>
                        <span class="span-value">{{ item.executionPerson === '' || item.executionPerson === null ? '-' : item.executionPerson }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">开始时间</span>
                        <span class="span-value">{{ item.actualStartTime === '' || item.actualStartTime === null ? '-' : $moment(item.actualStartTime).format('YYYY-MM-DD HH:mm') }}</span>
                    </el-col>
                    <el-col
                        :span="8"
                        class="detail-title"
                    >
                        <span class="span-label">生产进度</span>
                        <!--                                 :percentage="(Number(item.productQuantity)/Number(item.quantity)) * 100" -->
                        <span class="span-value">
                            <span v-if="item.quantity !== 0">
                                <el-progress
                                    :text-inside="true"
                                    :stroke-width="13"
                                    :percentage="Number(((Number(item.productQuantity)/Number(item.quantity)) * 100).toFixed(0))"
                                />
                                <p>{{ item.productQuantity }}/{{ item.quantity }}</p>
                            </span>
                            <span
                                v-else
                            >
                                <el-progress
                                    :text-inside="true"
                                    :stroke-width="13"
                                    :percentage="0"
                                />
                                <p>0/0</p>
                            </span>
                        </span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 设备时序 -->
        <div class="device-timing">
            <common-title
                :options="{text: '设备时序'}"
            >
                <template slot="rightPack">
                    <div>
                        <el-date-picker
                            v-model="timingTime"
                            style="width: 360px;"
                            class="mr-10"
                            type="datetimerange"
                            range-separator="至"
                            size="mini"
                            :picker-options="pickerOptions"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            popper-class="popperTime"
                            @change="timingChange(timingTime)"
                        />
                        <el-button
                            v-has="{role: 'timingExport'}"
                            type="primary"
                            size="mini"
                            icon="el-icon-edit-outline"
                            @click="timingExportClick"
                        >导出</el-button>
                    </div>
                </template>
            </common-title>
            <div class="timing-box">
                <div class="timing-box-left">
                    <div
                        id="main"
                        ref="chartsMain"
                    />
                </div>
                <div class="timing-box-right">
                    <el-row
                        :gutter="20"
                        class="el-row-text"
                    >
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            时间稼动率
                        </el-col>
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            性能稼动率
                        </el-col>
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            良品率
                        </el-col>
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            OEE
                        </el-col>
                    </el-row>
                    <el-row
                        :gutter="20"
                        class="mt-20"
                    >
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            {{ equipmentTimeSeries.timeUtilization }}
                        </el-col>
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            {{ equipmentTimeSeries.performanceUtilization }}
                        </el-col>
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            {{ equipmentTimeSeries.goodProductRate }}
                        </el-col>
                        <el-col
                            :span="6"
                            class="right-text"
                        >
                            {{ equipmentTimeSeries.oee }}
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <!-- 设备统计 -->
        <div class="device-statistics mt-5">
            <common-title
                :options="{text: '设备统计'}"
            >
                <template slot="rightPack">
                    <div>
                        <el-date-picker
                            v-model="statisticsTime"
                            style="width: 360px;"
                            popper-class="popperTime"
                            class="mr-10"
                            :picker-options="pickerOptionsStatistic"
                            type="datetimerange"
                            range-separator="至"
                            size="mini"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="statisticsTimeChange(statisticsTime)"
                        />
                        <el-button
                            v-has="{role: 'statisticsExport'}"
                            type="primary"
                            size="mini"
                            icon="el-icon-edit-outline"
                            @click="statisticsExportClick"
                        >导出</el-button>
                    </div>
                </template>
            </common-title>
            <div class="statistics-box">
                <div class="box-left">
                    <div class="duration-top">
                        <div
                            id="duration"
                            ref="chartsLine"
                        />
                    </div>
                    <div class="duration-footer">
                        <div
                            v-for="(item, index) in equipmentStatic"
                            :key="index"
                            :class="item.name === '状态' ? 'status-bg' : ''"
                            class="status"
                        >
                            <div class="status-top status-bg">
                                {{ item.name }}
                            </div>
                            <div class="status-main">
                                {{ item.duration }}
                            </div>
                            <div class="status-footer">
                                {{ item.radio }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-right">
                    <div
                        id="status"
                        ref="chartsPie"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @module 设备监控-设备监控信息
     * @author 齐闯
    */
    import request from '@/utils/request'
    import Echarts from 'echarts'
    // ?防抖
    import debounce from 'lodash/debounce'
    import CommonTitle from '@/components/CommonsTitle/index'
    // ?动态监听窗口变化
    import { addListener, removeListener } from 'resize-detector'
    export default {
        components: {
            CommonTitle
        },
        props: {
            fatherId: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                // 设备时序 限制选择时间不能超过两天
                pickerOptions: {
                    // onPick当type="datetimerange"时有效
                    onPick: ({ maxDate, minDate }) => {
                        this.timingTime= minDate.getTime()
                        if (maxDate) {
                            this.timingTime= [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date()]
                        }
                    },
                    disabledDate: (time) => {
                        if (this.timingTime !== '' && this.timingTime !== null) {
                            let tow = 2 * 24 * 3600 * 1000 //重点是在这里计算相差几天
                            let minTime = this.timingTime - tow
                            let maxTime = this.timingTime + tow

                            if (maxTime > new Date()) {
                                maxTime = new Date()
                            }
                            return time.getTime() < minTime || time.getTime() > maxTime
                        }
                        return time.getTime() > new Date()
                    }
                },
                 // 设备统计 限制选择时间不能超过两天
                pickerOptionsStatistic: {
                    onPick: ({ maxDate, minDate }) => {
                        this.statisticsTime = minDate.getTime()
                        if (maxDate) {
                            this.statisticsTime = [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date()]
                        }
                    },
                    disabledDate: (time) => {
                        if (this.statisticsTime!='' && this.statisticsTime !== null) {
                            let tow = 2 * 24 * 3600 * 1000 //重点是在这里计算相差几天
                            let minTime = this.statisticsTime - tow
                            let maxTime = this.statisticsTime + tow
                            return time.getTime() < minTime || time.getTime() > maxTime
                        }
                        return time.getTime() > new Date()
                    }
                },
                // 设备状态
                tagStatus: [
                    {en: 'PROCESSING', cn: '加工中', type: ''},
                    {en: 'IDLING', cn: '空闲', type: 'warning'},
                    {en: 'SHUTDOWN', cn: '停用', type: 'success'},
                    {en: 'UNKNOWN', cn: '其它', type: 'info'},
                ],
                timingTime: [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date()],                         // 设备时序时间选择值
                statisticsTime: [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date()],                     // 设备统计时间选择值
                chart: '',                              // 柱状图值
                chartStatus: '',                        // 设备状态监控窗口大小的值
                chartTiming: '',                        // 设备时序监控窗口大小的值
                productionInfo: [],                     // 设备生产信息数据
                durationList: [],                       // 柱状图Y轴数据
                processingStatusProportion: [],         // 甘特图X轴百分比数据
                equipmentStatic: [
                    {
                        name: '状态',
                        duration: "时长",
                        radio: '比例'
                    },
                    {
                        duration: '-',
                        name: '加工中',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '首检时间',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '设备故障',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '待工待料',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '交接班',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '培训开会',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '换刀具',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '调工装',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '返修',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '日常保养',
                        radio: '-'
                    },
                    {
                        duration: '-',
                        name: '无任务停机',
                        radio: '-'
                    }
                ],                                      // 设备统计设备状态数据
                equipmentTimeSeries: {},                // 设备时序数据
                equipmentTimeSeriesList: [],                                      // 设备时序默认数据
                startTime: new Date(new Date(new Date().toLocaleDateString()).getTime()),//今天零点时间
                timer: null,
                equipmentRunningStatus: {
                    equipmentNo: '22',
                    runningMode: '33',
                    feedShaftRatio: '44',
                    spindleSpeed: '55',
                    spindleLoad: '66'
                },                                       // 设备监控信息
            }
        },
        watch: {
            'fatherId': {
                handler (val) {
                    this.fatherId = _.cloneDeep(val)
                    if (val !== '') {
                        this.timer = setInterval(() => {
                            this.getMoitoring();
                            //生产信息
                            this.getProduction();
                        }, 5000);
                        this.getMoitoring();
                        //生产信息
                        this.getProduction();
                        //设备时序
                        this.getDeviceTiming();
                        //设备统计
                        this.getDeviceStatistics();
                    }
                },
                deep: true,
                immediate: true
            }
        },
        destroyed() {
            // 清空定时器
            clearInterval(this.timer);
        },
        created () {
            this.resize = debounce(this.resize, 150)
        },
        async mounted() {
            addListener(this.$refs.chartsLine, this.resize)
            addListener(this.$refs.chartsPie, this.resize)
            addListener(this.$refs.chartsMain, this.resize)
        },
        beforeDestroy () {
            // ?组件销毁之前, 移除事件监听
            removeListener(this.$refs.chartsLine, this.resize)
            removeListener(this.$refs.chartsPie, this.resize)
            removeListener(this.$refs.chartsMain, this.resize)
            // ?销毁 chart 实例, 防止内存泄漏
            this.chart.dispose()
            this.chart = null
            this.chartStatus.dispose()
            this.chartStatus = null
            this.chartTiming.dispose()
            this.chartTiming = null
        },
        methods: {
            timingChange (value) {
                if (value === null) {
                    this.timingTime = '';
                    this.getDeviceTiming();
                } else {
                    this.getDeviceTiming();
                }
            },
            //状态时间选择事件
            statisticsTimeChange (val) {
                // this.getDeviceStatistics();
                if (val === null) {
                    this.statisticsTime = '';
                    this.getDeviceStatistics();
                } else {
                    this.getDeviceStatistics();
                }
            },
            //加工模式样式重置
            runningMode (row) {
                switch (row) {
                    case 'SHUTDOWN':
                        return '停机';
                    case 'IDLING':
                        return '待机/运行完成/空闲';
                    case 'PROCESSING':
                        return '正常运行';
                    case 'UNKNOWN':
                        return '其它';
                    default:
                        return '-'
                }
            },
            resize () {
                this.chart.resize()
                this.chartStatus.resize()
                this.chartTiming.resize()
            },
            //持续时长柱状图
            myChart (data) {
                this.chart = Echarts.init(document.getElementById('duration'));

                // 指定图表的配置项和数据
                let option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '10%',
                        bottom: '6%',
                        top: '16%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            name: '设备状态',
                            data : ['加工', '首检时间', '设备故障', '待工待料', '交接班', '培训开会', '换刀具', '调工装', '返修', '日常保养', '无任务停机'],
                            // axisTick: {
                            //     alignWithLabel: true
                            // },
                            axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color:'#ccc',
                                    width:'1'
                                }
                            },
                            axisLabel: {
                                interval: 0,//横轴信息全部显示
                                rotate: -20,//-15度角倾斜显示
                                margin: 16,
                                textStyle: {
                                    color: '#000'
                                }
                            },
                            nameTextStyle:{ //文字样式
                                color: '#222'
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name: '持续时长(min)',
                            axisLine: {
                                lineStyle: {
                                    type: 'solid',
                                    color:'#fff',
                                    width:'1'
                                }
                            },
                            splitLine:{
                                show: true, // X轴线 颜色类型的修改
                                lineStyle: {
                                    type: 'dashed',
                                    color: '#ccc'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#222'
                                }
                            },
                            nameTextStyle:{ //文字样式
                                color: '#222'
                            }
                        }
                    ],
                    series : [
                        {
                            type:'bar',
                            barWidth: '18%',
                            itemStyle: {
                                // emphasis: {
                                //     barBorderRadius: 30
                                // },
                                normal: {
                                    barBorderRadius:[5, 5, 0, 0],
                                    color: function (params) {
                                        let colorList = [
                                            ['rgba(65,218,143, 0.8)', 'rgba(65,218,143, 0.8)'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(255,185,91, 0.8', 'rgba(255,185,91, 0.8'],
                                            ['rgba(208,2,27, 0.8)', 'rgba(208,2,27, 0.8)']
                                        ];
                                        let colorItem = colorList[params.dataIndex];
                                        return new Echarts.graphic.LinearGradient(0,0,1,0,[
                                            {
                                                offset: 0,
                                                color: colorItem[0]
                                            },
                                            {
                                                offset: 1,
                                                color: colorItem[1]
                                            },
                                        ],false);
                                    }
                                }
                            },
                            data: data
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                this.chart.setOption(option);
            },
            //状态饼图图表
            statusCharts (row) {
                this.chartStatus = Echarts.init(document.getElementById('status'));

                // 指定图表的配置项和数据
                let option = {
                    // color: ['rgba(65,218,143, 0.8)', 'blue', 'rgba(208,2,27, 0.8)'],
                    color: ['rgba(65,218,143, 0.8)', 'rgba(255,185,91, 0.8)', 'rgba(208,2,27, 0.8)'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {d}% "
                    },
                    legend: {
                        show: true,
                        // selectedMode: false,
                        orient: 'vertical',
                        x: 'left',
                        data:['加工中', '空闲', '停机']
                    },
                    series: [
                        {
                            name: '状态',
                            type:'pie',
                            radius: ['40%', '60%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                        fontWeight: 'bold'
                                    },
                                    formatter: function (params) {
                                        return (params.value).toFixed(2) + '%'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: row
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                this.chartStatus.setOption(option);
                this.chartStatus.dispatchAction({type: 'highlight', dataIndex: 0})
            },
            //设备时序甘特图
            cryClick (data) {
                let self = this;
                // 初始化echart
                this.chartTiming = Echarts.init(document.getElementById('main'));
                this.chartTiming.clear();
                // 各状态的颜色
                let colors = ['#41DA8F', '#FFB95B', '#D0021B', '#CCCCCC'];
                // 四种状态
                let state = ['加工中', '空闲', '停机', '其它'];
                //  {en: 'UNKNOWN', cn: '其它', type: 'info'},
                // echart配置
                let opt = {
                    color: colors,
                    tooltip: {
                        // 鼠标移动显示框
                        formatter: function (params) {
                            return `<div>状态：${params.name}<br/>开始时间：${self.$moment(params.value[1]).format('HH:mm')}<br/>结束时间：${params.value[2] === 'null' ? '未结束' : self.$moment(params.value[2]).format('HH:mm')}<br/>持续时间：${params.value[3] === 'null' ? '暂无' : params.value[3]}<br/></div>`;
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            height: 27,
                            end: 30,
                            top: 143,
                            filterMode: 'empty',
                            showDataShadow: false
                        }
                    ],
                    // dataZoom: [{
                    //     type: 'slider',
                    //     filterMode: 'weakFilter',
                    //     showDataShadow: false,
                    //     end: 30,
                    //     top: 140,
                    //     height: 10,
                    //     borderColor: 'transparent',
                    //     backgroundColor: '#e2e2e2',
                    //     handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                    //     handleSize: 20,
                    //     handleStyle: {
                    //         shadowBlur: 6,
                    //         shadowOffsetX: 1,
                    //         shadowOffsetY: 2,
                    //         shadowColor: '#aaa'
                    //     },
                    //     labelFormatter: ''
                    // }, {
                    //     type: 'inside',
                    //     filterMode: 'weakFilter'
                    // }],
                    legend: {
                        data: state,
                        top: '2%',
                        right: '4%',
                        selectedMode: false, // 图例设为不可点击
                        textStyle: {
                            color: '#000'
                        }
                    },
                    grid: {
                        left: '7%',
                        right: '7%',
                        top: '20%',
                        bottom: '20%',
                        containLabel: true
                    },
                    xAxis: {
                        // 维度X,
                        //name: '',                     // x轴名称
                        type: 'time',                   // 时间显示类型
                        nameLocation: 'end',            // 名称显示位置
                        min: self.timingTime[0],
                        // min: self.timingTime === '' || self.timingTime === null ? self.startTime : self.timingTime[0],              // 坐标轴最小刻度值
                        max: self.timingTime === '' || self.timingTime === null ? new Date() : self.timingTime[1],              // 坐标轴最大刻度值
                        minInterval: 1,                 // 划分间隔为整数形式
                        // maxInterval: 3600 * 1 * 1000 * 12, // 间隔时间为12个小时
                        interval: 60*60*1000,
                        axisLabel: {
                            margin: 10,
                            interval: 100000,
                            showMinLabel: true,
                            showMaxLabel: true,
                            formatter: function (val) {
                                // console.log(self.$moment(val).format('MM-DD HH:mm'))
                                let data;
                                if (self.processingStatusProportion.length === 0) {
                                    return `${self.$moment(val).format('HH:mm')} \n ${self.$moment(val).format('MM-DD')} \n ` + '0%'
                                } else {
                                    self.processingStatusProportion.map((item, index) => {
                                        if (self.$moment(item.time).format('YYYY-MM-DD HH') === self.$moment(val).format('YYYY-MM-DD HH')) {
                                            data = `${self.$moment(val).format('HH:mm')} \n ${self.$moment(val).format('MM-DD')} \n ` + (item.proportion * 100).toFixed(2) + '%';
                                        }
                                        // } else {
                                        //     data = `${self.$moment(val).format('HH:mm')} \n ${self.$moment(val).format('MM-DD')} \n ` + '0%' ;
                                        // }
                                    })
                                    return data;
                                }
                                // return `${self.$moment(val).format('HH:mm')} \n ${self.$moment(val).format('MM-DD')} \n ` + '10%';
                            }
                        },
                        axisLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        // 维度Y
                        data: [],
                        axisLine: {
                            show: false
                        }
                    },
                    series: [
                        // 用空bar来显示四个图例 这个是下面的四个解释图形文字的有几个就写几个跟上上的会自动找上面的配置项中的state项
                        {name: state[0], type: 'bar', data: []},
                        {name: state[1], type: 'bar', data: []},
                        {name: state[2], type: 'bar', data: []},
                        {name: state[3], type: 'bar', data: []},
                        {
                            type: 'custom',
                            // 写自己的图形渲染逻辑
                            renderItem: self.renderItem,
                            encode: {
                                // 表示维度1，2映射到X轴上
                                x: [1, 2],
                                y: 0
                            },
                            // 主要的数据配置
                            // itemStyle 矩阵渲染样式
                            // name 矩阵状态名
                            // value 第一个对应维度X 第二个对应维度Y 第三个对应其他维度
                            data: data
                            // data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00']
                        }
                    ]
                };
                this.chartTiming.setOption(opt);
            },
            // echarts 图形渲染逻辑
            renderItem (params, api) {
                let categoryIndex = api.value(0);
                let start = api.coord([api.value(1), categoryIndex]);
                let end = api.coord([api.value(2), categoryIndex]);
                // 控制各种状态的甘特图的高度
                let height = 100;
                return {
                    type: 'rect',
                    shape: Echarts.graphic.clipRectByRect({
                        x: start[0],
                        y: start[1] - height / 2,
                        width: end[0] - start[0],
                        height: height
                    }, {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height
                    }),
                    style: api.style()
                };
            },
            // 解析数据
            recombinationData (data) {
                let echartsList = [];
                for (let item of data) {
                    // 定义要传给echarts的data数据
                    let itemStyle = '';
                    let name = '';
                    let value = [];
                    // 设备状态判断
                    if (item.status === 'PROCESSING') {
                        itemStyle =  { normal: { color: '#41DA8F' } };
                        name = '加工中';
                    } else if (item.status === 'IDLING') {
                        itemStyle =  { normal: { color: '#FFB95B' } };
                        name = '空闲';
                    } else if (item.status === 'SHUTDOWN') {
                        itemStyle =  { normal: { color: '#D0021B' } };
                        name = '停机';
                    } else if (item.status === 'UNKNOWN') {
                        itemStyle =  { normal: { color: '#CCCCCC' } };
                        name = '其它';
                    }
                    value.push(0);
                    value.push(new Date(item.startTime).getTime());
                    // value.push(this.$moment(new Date(item.startTime).getTime()).format('HH:mm'));
                    // echarts 不能传null
                    if (item.endTime === null) {
                        value.push('null');
                    } else {
                        value.push(new Date(item.endTime).getTime());
                        // value.push(this.$moment(new Date(item.endTime).getTime()).format('HH:mm'));
                    }
                    if (item.startTime !== null && item.endTime !== null) {
                        let time = new Date(item.endTime).getTime() - new Date(item.startTime).getTime();
                        let hour = Math.floor(time / (1000 * 60 * 60));
                        let hourSurplus = time % (1000 * 60 * 60);
                        let minute = Math.floor(hourSurplus / (1000 * 60));
                        let minuteSurplus = hourSurplus % (1000 * 60);
                        let second = Math.floor(minuteSurplus / 1000);
                        let timeSurplus = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
                        // let timeSurplus = `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
                        value.push(timeSurplus);
                    } else {
                        value.push('null');
                    }
                    // 将转换完的数据插入定义好的甘特图数据容器中
                    echartsList.push({
                        itemStyle: itemStyle,
                        name: name,
                        value: value
                    });
                }
                this.cryClick(echartsList);
            },
            //设备监控信息-监控信息数据
            async getMoitoring () {
                let params = {
                    equipmentNo: this.fatherId
                }
                let res = await this.$service('get', '/SERVICE-BUSINESS/api/monitor/equipmentRunningStatus', params);
                if (res !== null) {
                    this.equipmentRunningStatus = res;
                }
            },
            //生产信息
            async getProduction () {
                let params = {
                    equipmentNo: this.fatherId
                }
                let res = await this.$service('get', '/SERVICE-BUSINESS/api/monitor/productionInfo', params);
                if (res.length !== 0) {
                    this.productionInfo = _.cloneDeep(res)
                }
                else {
                    this.productionInfo = [
                        {
                            no: '',
                            processStepName: '',
                            productNo: '',
                            productBatchNo: '',
                            actualStartTime: '',
                            processEquips: [
                                {
                                    processEquipName: null,
                                    processEquipNo: null
                                }
                            ],
                            executionPerson: '',
                            createTime: '',
                            productQuantity: 0,
                            quantity: 0
                        }
                    ]
                }
            },
            //设备时序数据
            async getDeviceTiming () {
                let params = {
                    startTime: this.timingTime === '' || this.timingTime === null ? this.$moment(this.startTime).format('YYYY-MM-DD HH') : this.$moment(this.timingTime[0]).format('YYYY-MM-DD HH'),
                    endTime: this.timingTime === '' || this.timingTime === null ? this.$moment(new Date()).format('YYYY-MM-DD HH') : this.$moment(this.timingTime[1]).format('YYYY-MM-DD HH'),
                    equipmentNo: this.fatherId
                }
                let res = await this.$service('get', '/SERVICE-BUSINESS/api/monitor/equipmentTimeSeries', params);
                this.equipmentTimeSeries = _.cloneDeep(res.oee);
                if (res.processingStatusProportion.length !== 0) {
                    this.processingStatusProportion = _.cloneDeep(res.processingStatusProportion);
                    let obj = {
                        proportion: 0,
                        time: this.timingTime === '' || this.timingTime === null ? this.$moment(this.startTime).format('YYYY-MM-DD HH') : this.$moment(this.timingTime[0]).format('YYYY-MM-DD HH')
                    }
                    this.processingStatusProportion.unshift(obj);
                }
                this.recombinationData(res.equipmentTimeSeries);
            },
            //设备统计
            async getDeviceStatistics () {
                //获取当前零点时间
                let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
                let params = {
                    startTime: this.statisticsTime === '' || this.statisticsTime === null ? this.$moment(startTime).format('YYYY-MM-DD HH:mm:ss') : this.$moment(this.statisticsTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                    endTime: this.statisticsTime === '' || this.statisticsTime === null ? this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : this.$moment(this.statisticsTime[1]).format('YYYY-MM-DD HH:mm:ss'),
                    equipmentNo: this.fatherId
                }
                let res = await this.$service('get', '/SERVICE-BUSINESS/api/monitor/equipmentStatic', params);
                let data = [
                    {value: res.pieChat.PROCESSING, name:'加工中'},
                    {value: res.pieChat.DEBUG_WAITING, name:'空闲'},
                    {value: res.pieChat.NO_TASKING, name:'停机'}
                ]
                this.statusCharts(data);
                let obj = {
                    name: '状态',
                    duration: "时长",
                    radio: '比例'
                }
                this.equipmentStatic[0] = obj
                this.equipmentStatic[1].radio = (res.result.PROCESSING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[1].duration = res.result.PROCESSING.duration
                this.durationList[0] = res.result.PROCESSING.duration
                this.equipmentStatic[1].name = '加工中'
                this.equipmentStatic[2].radio = (res.result.FIRST_CHECKING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[2].duration = res.result.FIRST_CHECKING.duration
                this.durationList[1] = res.result.FIRST_CHECKING.duration
                this.equipmentStatic[2].name = '首检时间'
                this.equipmentStatic[3].radio = (res.result.EQUIP_FAILURE.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[3].duration = res.result.EQUIP_FAILURE.duration
                this.durationList[2] = res.result.EQUIP_FAILURE.duration
                this.equipmentStatic[3].name = '设备故障'
                this.equipmentStatic[4].radio = (res.result.RESOURCE_WAITING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[4].duration = res.result.RESOURCE_WAITING.duration
                this.durationList[3] = res.result.RESOURCE_WAITING.duration
                this.equipmentStatic[4].name = '待工待料'
                this.equipmentStatic[5].radio = (res.result.WORKING_SHIFT_EXCHANGING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[5].duration = res.result.WORKING_SHIFT_EXCHANGING.duration
                this.durationList[4] = res.result.WORKING_SHIFT_EXCHANGING.duration
                this.equipmentStatic[5].name = '交接班'
                this.equipmentStatic[6].radio = (res.result.TRAINING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[6].duration = res.result.TRAINING.duration
                this.durationList[5] = res.result.TRAINING.duration
                this.equipmentStatic[6].name = '培训开会'
                this.equipmentStatic[7].radio = (res.result.CUTTER_CHANGING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[7].duration = res.result.CUTTER_CHANGING.duration
                this.durationList[6] = res.result.CUTTER_CHANGING.duration
                this.equipmentStatic[7].name = '换刀具'
                this.equipmentStatic[8].radio = (res.result.PROCESS_EQUIP_CHANGING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[8].duration = res.result.PROCESS_EQUIP_CHANGING.duration
                this.durationList[7] = res.result.PROCESS_EQUIP_CHANGING.duration
                this.equipmentStatic[8].name = '调工装'
                this.equipmentStatic[9].radio = (res.result.REWORKING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[9].duration = res.result.REWORKING.duration
                this.durationList[8] = res.result.REWORKING.duration
                this.equipmentStatic[9].name = '返修'
                this.equipmentStatic[10].radio = (res.result.MAINTAINING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[10].duration = res.result.MAINTAINING.duration
                this.durationList[9] = res.result.MAINTAINING.duration
                this.equipmentStatic[10].name = '日常保养'
                this.equipmentStatic[11].radio = (res.result.NO_TASKING.radio * 100).toFixed(2) + '%'
                this.equipmentStatic[11].duration = res.result.NO_TASKING.duration
                this.durationList[10] = res.result.NO_TASKING.duration
                this.equipmentStatic[11].name = '无任务停机'
                this.myChart(this.durationList)
            },
            //设备统计导出功能
            async statisticsExportClick () {
                try {
                    let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    let params = {
                        startTime: this.statisticsTime === '' || this.statisticsTime === null ? startTime : this.statisticsTime[0],
                        endTime: this.statisticsTime === '' || this.statisticsTime === null ? new Date() : this.statisticsTime[1],
                        equipmentNo: this.fatherId
                    }
                    let res = await request({
                    url: `${process.env.VUE_APP_BASE_API}/SERVICE-BUSINESS/api/export/equipmentStatics`,
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
                } catch (error) {
                    throw error
                }
            },
            //设备时序导出功能
            async timingExportClick () {
                try {
                    let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    let params = {
                        startTime: this.timingTime === '' || this.timingTime === null ? startTime : this.timingTime[0],
                        endTime: this.timingTime === '' || this.timingTime === null ? new Date() : this.timingTime[1],
                        equipmentNo: this.fatherId
                    }
                    let res = await request({
                    url: `${process.env.VUE_APP_BASE_API}/SERVICE-BUSINESS/api/export/equipmentTimeSeries`,
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
                } catch (error) {
                    throw error
                }
            }
        }
    }
</script>

<style>
.popperTime {
    margin-left: -210px!important;
}
</style>
<style lang="scss" scoped>
.monitor-page {
    width: 100%;
    height: 100%;
    overflow-y: auto;

    //监控信息
    .monitor-information {
        background: #fff;
        min-height: 98px;
        padding: 0 10px;
        border-radius: 4px;

        .information-header {
            height: 34px;
            line-height: 34px;
            color: #222222;
            border-bottom: 1px solid #F1F1F1;
        }

        .information-box {
            width: 100%;
            min-height: 60px;
        }
    }
    // 生产信息
    .production-information {
        background: #fff;
        min-height: 130px;
        padding: 0 10px;
        border-radius: 4px;
        margin-top: 5px;

        .information-header {
            height: 34px;
            line-height: 34px;
            color: #222222;
            border-bottom: 1px solid #F1F1F1;
        }

        .information-box {
            width: 100%;
            min-height: 60px;
        }
    }
    //设备时序
    .device-timing {
        width: 100%;
        height: 200px;
        background: #fff;
        border-radius: 4px;
        // padding: 0 10px 0 0;
        margin-top: 5px;

        .timing-header {
            height: 40px;
            line-height: 40px;
            color: #222222;
            border-bottom: 1px solid #F1F1F1;

            .float-right {
                float: right;

                /deep/.popperTime {
                    margin-left: -100px;
                }
            }
        }
        .timing-box {
            width: 100%;
            height: 165px;
            display: flex;

            .timing-box-left {
                width: 56%;
                height: 100%;

                #main{
                    width: 100%;
                    height: 165px;
                }
            }
            .timing-box-right {
                width: 44%;
                height: 100%;
                padding: 10px 10px;

                .el-row-text {
                    padding: 0 10px 0 0;
                    min-height: 36px;
                    line-height: 36px;
                    background-color: #f3f6fe;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #222222;
                }

                .right-text {
                    text-align: center;
                }
            }
        }
    }
    //设备统计样式
    .device-statistics {
        width: 100%;
        height: 400px;
        border-radius: 4px;

        .statistics-header {
            padding: 5px 10px;
            height: 50px;
            line-height: 40px;
            color: #222222;
            background: #fff;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #F1F1F1;

            .float-right {
                float: right;

                /deep/.popperTime {
                    margin-left: -100px;
                }
            }
        }

        .statistics-box {
            width: 100%;
            height: 380px;
            display: flex;

            .box-left {
                width: 70%;
                height: 100%;

                .duration-top {
                    width: 100%;
                    height: 235px;
                    background: #fff;
                    border-radius: 0 0 4px 4px;

                    #duration {
                        width: 100%;
                        height: 215px;
                    }
                }
                .duration-footer {
                    margin-top: 5px;
                    padding: 10px;
                    height: 140px;
                    width: 100%;
                    background: #FFF;
                    display: flex;
                    border-radius: 4px 4px 4px 0;

                    .status {
                        width: 9%;
                        height: 100%;
                        font-size: 12px;
                        text-align: center;

                        .status-top {
                            height: 36px;
                            line-height: 36px;
                        }
                        .status-main {
                            width: 100%;
                            height: 36px;
                            line-height: 36px;
                        }
                        .status-footer {
                            height: 36px;
                            line-height: 36px;
                        }
                    }
                    .status-bg {
                        background: #f3f6fe;
                    }
                }
            }
            .box-right {
                width: 29.5%;
                margin-left: 5px;
                height: 100%;
                background: #fff;
                border-radius: 0 4px 4px 4px;
                padding: 30px 20px 20px;

                #status {
                    width: 100%;
                    height: 340px;
                }
            }
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
    /deep/.el-progress-bar__innerText {
        color: #111 !important;
    }
}
</style>
