<template>
    <div
        id="timmingCharts"
        class="timmingCharts"
    >
        <div class="timing-box-left">
            <div
                id="main"
                ref="chartsMain"
            />
        </div>
    </div>
</template>

<script>
import Echarts from 'echarts';
// ?防抖
import debounce from 'lodash/debounce';
// ?动态监听窗口变化
import { addListener, removeListener } from 'resize-detector';

export default {
    props: {
        //甘特图数据
        chartsData: {
            type: Object,
            required: true
        },
        //工单开始时间
        orderStartTime: {
            type: null,
            required: true
        },
        // 工单结束时间
        orderEndTime: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            chart: '',
            chartTiming: '', //设备时序监控窗口大小的值
            chartTimingData: {},
            // minTime:'',
            // maxTime:'',
            statusList: [
                {
                    name: '状态',
                    duration: '时长/min',
                    value: '比率'
                },
                {
                    name: '加工中',
                    duration: '320',
                    value: '60%'
                },
                {
                    name: '首检时间',
                    duration: '20',
                    value: '3.2%'
                },
                {
                    name: '设备故障',
                    duration: '10',
                    value: '14%'
                },
                {
                    name: '待工带料',
                    duration: '60',
                    value: '10%'
                },
                {
                    name: '交接班',
                    duration: '100',
                    value: '11%'
                },
                {
                    name: '培训开会',
                    duration: '100',
                    value: '3.2%'
                },
                {
                    name: '换刀具',
                    duration: '90',
                    value: '19%'
                },
                {
                    name: '调工装',
                    duration: '27',
                    value: '21%'
                },
                {
                    name: '返修',
                    duration: '29',
                    value: '11%'
                },
                {
                    name: '日常保养',
                    duration: '29',
                    value: '51%'
                }
            ]
        };
    },
    watch: {
        chartsData(newval, oldval) {
            // console.log('newval', newval)
            // console.log('oldval', oldval)
            this.chartTimingData.startTime = _.cloneDeep(newval.startTime);
            this.chartTimingData.endTime = _.cloneDeep(newval.endTime);
            this.chartTimingData.graph = _.cloneDeep(newval.graph);
            this.recombinationData(this.chartTimingData.graph);
            // console.log(new Date(this.chartTimingData.startTime).getTime(), '[[[]]]][][[]]')
        },
        immediate: true
    },
    created() {
        this.resize = debounce(this.resize, 150);
        console.log('this.ressssssssssssss', this.resize)
    },
    mounted() {
        console.log(this.chartTimingData, 'chartsData');
        addListener(this.$refs.chartsMain, this.resize);
        // this.cryClick ()
        // this.recombinationData(this.machineFunctionList)
        // console.log(this.chartTimingData.startTime, 'new Date(this.chartTimingData.startTime).getTime()')
    },
    beforeDestroy() {
        removeListener(this.$refs.chartsMain, this.resize);
        // this.chart.dispose()
        // this.chart = null
        // ?销毁 chart 实例, 防止内存泄漏
        // this.chart.dispose()
        // this.chart = null
        this.chartTiming.dispose();
        this.chartTiming = null;
    },
    methods: {
        resize() {
            this.chartTiming.resize();
        },
        //设备时序甘特图
        cryClick(data) {
            let self = this;
            // 初始化echart
            this.chartTiming = Echarts.init(document.getElementById('main'));
            this.chartTiming.clear();
            // 各状态的颜色
            let colors = ['#41DA8F', '#FFB95B'];
            // 2种状态
            let state = ['加工中', '调试或停机'];
            // echart配置
            let opt = {
                color: colors,
                tooltip: {
                    // 鼠标移动显示框
                    formatter: function(params) {
                        console.log(params)
                        return `<div>状态：${
                            params.name
                        }<br/>开始时间：${self
                            .$moment(params.value[1])
                            .format('HH:mm')}<br/>结束时间：${
                            params.value[2] === 'null'
                                ? '未结束'
                                : self.$moment(params.value[2]).format('HH:mm')
                        }<br/>持续时间：${
                            params.value[3] === 'null'
                                ? '暂无'
                                : params.value[3]
                        }<br/></div>`;
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
                //     // start: 90,
                //     end:10,
                //     id: 'workOrderDetils',
                //     type: 'slider',
                //     filterMode: 'weakFilter',
                //     showDataShadow: true,
                //     top: 160,
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
                //     // id: 'timmingCharts',
                //     type: 'inside',
                //     filterMode: 'weakFilter'
                // }],
                legend: {
                    data: state,
                    top: '10%',
                    right: '5%',
                    selectedMode: false, // 图例设为不可点击
                    textStyle: {
                        color: '#000'
                    }
                },
                grid: {
                    left: '6%',
                    right: '6%',
                    top: '25%',
                    bottom: '18%',
                    containLabel: true
                },
                xAxis: {
                    // 维度X,
                    scale: true,
                    //name: '',                     // x轴名称
                    type: 'time', // 时间显示类型
                    nameLocation: 'end', // 名称显示位置
                    // min: 1559617000000,              // 坐标轴最小刻度值
                    min: new Date(this.chartTimingData.startTime).getTime(), // 坐标轴最小刻度值
                    max: new Date(this.chartTimingData.endTime).getTime(), // 坐标轴最大刻度值
                    // max: 1559629000000,              // 坐标轴最大刻度值
                    minInterval: 1, // 划分间隔为整数形式
                    // maxInterval: 3600 * 1 * 1000 * 12, // 间隔时间为24个小时
                    maxInterval: 1000 * 60 * 30, // 间隔时间为半小时
                    axisLabel: {
                        margin: 10,
                        interval: 100000,
                        showMinLabel: true,
                        showMaxLabel: true
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
                    { name: state[0], type: 'bar', data: [] },
                    { name: state[1], type: 'bar', data: [] },
                    { name: state[2], type: 'bar', data: [] },
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
        renderItem(params, api) {
            // console.log('params', params)
            let categoryIndex = api.value(0);
            let start = api.coord([api.value(1), categoryIndex]);
            let end = api.coord([api.value(2), categoryIndex]);
            // 控制各种状态的甘特图的高度
            let height = 100;
            return {
                type: 'rect',
                shape: Echarts.graphic.clipRectByRect(
                    {
                        x: start[0],
                        y: start[1] - height / 2,
                        width: end[0] - start[0],
                        height: height
                    },
                    {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height
                    }
                ),
                style: api.style()
            };
        },
        // 解析数据
        recombinationData(data) {
            // console.log('data',data)
            let echartsList = [];
            for (let item of data) {
                // 定义要传给echarts的data数据
                let itemStyle = '';
                let name = '';
                let value = [];
                // 设备状态判断
                if (item.status === 'PROCESSING') {
                    itemStyle = { normal: { color: '#41DA8F' } };
                    name = '加工中';
                } else if (item.status === 'PAUSE') {
                    itemStyle = { normal: { color: '#FFB95B' } };
                    name = '调试或停机';
                }
                value.push(0);
                // console.log(new Date(item.startTime).getTime(), '2222222211111111')
                value.push(new Date(item.startTime).getTime());
                // console.log('value', value)
                // echarts 不能传null
                if (item.endTime === null) {
                    value.push('null');
                } else {
                    value.push(new Date(item.endTime).getTime());
                }
                if (item.startTime !== null && item.endTime !== null) {
                    // console.log('==?', item.startTime)
                    // console.log('====!', item.endTime)
                    // console.log('====!', item.duration)

                    let time =
                        new Date(item.endTime).getTime() -
                        new Date(item.startTime).getTime();
                    // console.log(time, 'time')
                    // console.log(new Date('2019-06-04T12:48:51.000+0000').getTime(),'a2b')
                    let hour = Math.floor(time / (1000 * 60 * 60));
                    let hourSurplus = time % (1000 * 60 * 60);
                    // console.log('-----', hourSurplus)
                    let minute = Math.floor(hourSurplus / (1000 * 60));
                    let minuteSurplus = hourSurplus % (1000 * 60);
                    let second = Math.floor(minuteSurplus / 1000);
                    let timeSurplus = `${hour < 10 ? '0' + hour : hour}:${
                        minute < 10 ? '0' + minute : minute
                    }:${second < 10 ? '0' + second : second}`;
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
        }
    }
};
</script>

<style lang="scss" scoped>
.timmingCharts {
    // width: 780px;
    width: 100%;
    height: 180px;
    display: flex;
    .timing-box-left {
        width: 100%;
        height: 100%;
        #main {
            width: 100%;
            // height: 160px;
            height: 175px;
            // margin-bottom: 100px;
        }
    }
    .duration-footer {
        // margin-top: 15px;
        padding: 15px;
        // height: 135px;
        width: 100%;
        background: #fff;
        display: flex;
        border-radius: 8px 8px 8px 0;

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
            background: #f9f9f9;
        }
    }
}
</style>