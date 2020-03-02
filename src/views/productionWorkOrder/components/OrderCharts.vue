<template>
    <div class="order_charts">
        <div
            id="orderCharts"
            ref="orderCharts"
        />
    </div>
</template>

<script>
import Echarts from 'echarts';
import Public from './public';
// ?防抖
import debounce from 'lodash/debounce';
// ?动态监听窗口变化
import { addListener, removeListener } from 'resize-detector';
export default {
    props: {
        // 生产数据 -图表-进给轴倍率数据
        feedShaftRatio: {
            type: Array,
            required: true
        },
        // 生产数据-图表-主轴负载
        spindleLoad: {
            type: Array,
            required: true
        },
        // 生产数据-图表-时间（X）
        createTime: {
            type: null,
            required: true
        },
        // 图表-开始时间
        echartsStartTime: {
            type: null,
            required: true
        },
        // 图表-结束时间
        echartsEndTime: {
            type: null,
            required: true
        }
    },
    data() {
        return {
            chartStatus: '',
            // 上限值
            upperLimitValue: '',
            // 下限值
            lowerLimitValue: '',
            //生产数据监控窗口大小的值
            orderCharts: ''
        };
    },
    watch: {
        createTime(newval, oldval) {
            console.log(new Date(this.createTime).getTime(), '22222');
            this.renderEcharts();
        },
        spindleLoad(newval, oldval) {
            console.log('主轴负载', this.spindleLoad);
            this.renderEcharts();
        },
        feedShaftRatio(newval, oldval) {
            this.renderEcharts();
            console.log('进给轴倍率', this.feedShaftRatio);
        },
        echartsEndTime(newval, oldval) {
            console.log('变化了', 'end', this.echartsEndTime);
            // console.log(newval,'newval')
            // console.log(oldval,'oldval')
            this.renderEcharts();
        },
        echartsStartTime(newval, oldval) {
            // console.log('变化了', 'start', new Date(this.echartsStartTime).getTime())
            // console.log(newval,'newvalend')
            // console.log(oldval,'oldvalend')
            this.renderEcharts();
            console.log('变化了', 'end', this.echartsStartTime);
            console.log(new Date(this.echartsStartTime).getTime(), '1111');
        },
        immediate: true
    },
    mounted() {
        // this.renderEcharts();
        addListener(this.$refs.orderCharts, this.resize);
    },
    created() {
        this.resize = debounce(this.resize, 150);
        let self = this;
        Public.$on('getupperLimitValue', value => {
            // console.log(value)
            // console.log(this.upperLimitValue, '222222')
            this.upperLimitValue = (value.replace('%', '') / 100).toString();
            this.renderEcharts();
        });
        Public.$on('getlowerLimitValue', value1 => {
            // console.log(value1)
            // console.log(this.lowerLimitValue, '222222')
            this.lowerLimitValue = (value1.replace('%', '') / 100).toString();
            this.renderEcharts();
        });
    },
    beforeDestroy() {
        // ?组件销毁之前, 移除事件监听
        removeListener(this.$refs.orderCharts, this.resize);
        this.orderCharts.dispose();
        this.orderCharts = null;
    },
    methods: {
        resize() {
            // this.chart.resize()
            this.orderCharts.resize();
        },
        renderEcharts() {
            this.orderCharts = Echarts.init(
                document.getElementById('orderCharts')
            );
            this.orderCharts.clear();

            // echarts.dispose(domItem)
            // let echart = echarts.init(domItem)
            var charts = {
                // unit: '户数',
                names: ['进给轴倍率', '主轴负载']
                // lineX:new Date(this.createTime).getTime(),
            };
            let opt = {
                // backgroundColor:'#0d235e',
                tooltip: {
                    show: true,
                    trigger: 'axis'
                    // formatter:function(a){
                    //     console.log(a)
                    //     return `${marker} ${a[0].seriesName} `
                    // }
                },
                legend: {
                    data: charts.names,
                    textStyle: {
                        fontSize: 12
                        // color: 'rgb(0,253,255,0.6)'
                    },
                    top: '5%',
                    right: '4%'
                },
                grid: {
                    top: '25%',
                    left: '6%',
                    right: '6%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    // data: charts.lineX,
                    // min: new Date(this.echartsStartTime).getTime() ,              // 坐标轴最小刻度值
                    min: new Date(this.echartsStartTime).getTime(), // 坐标轴最小刻度值
                    max: new Date(this.echartsEndTime).getTime(),
                    maxInterval: 1000 * 60 * 30, // 间隔时间为半小时
                    axisLabel: {}
                },
                yAxis: {
                    name: charts.unit,
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            // color: 'rgb(0,253,255,0.6)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            // color: 'rgb(23,255,243,0.3)'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            // color: 'rgb(0,253,255,0.6)'
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        height: 27,
                        end: 30,
                        top: 213,
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
                //     top: 220,
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
                series: [
                    {
                        name: '主轴负载',
                        type: 'line',
                        color: '#ffb95b',
                        // "smooth": true,
                        areaStyle: {
                            normal: {
                                color: {
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    type: 'linear',
                                    global: false,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: '#ffb95b'
                                        },
                                        {
                                            offset: 0.8,
                                            color: '#ffffff'
                                        }
                                    ]
                                },
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10
                            }
                        },
                        // "symbol": "circle",
                        symbolSize: 10,
                        data: this.spindleLoad,
                        markLine: {
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        type: 'dashed',
                                        color:
                                            this.upperLimitValue ||
                                            this.lowerLimitValue
                                                ? 'red'
                                                : 'transparent'
                                    },
                                    label: { show: true, position: 'end' }
                                }
                            },
                            silent: true,
                            data: [
                                {
                                    yAxis: Number(this.upperLimitValue) * 100
                                },
                                {
                                    yAxis: Number(this.lowerLimitValue) * 100
                                }
                            ]
                        }
                    },
                    {
                        name: '进给轴倍率',
                        type: 'line',
                        color: '#438afe',
                        // "smooth": true,
                        areaStyle: {
                            normal: {
                                color: {
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    type: 'linear',
                                    global: false,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: '#438afe'
                                        },
                                        {
                                            offset: 0.8,
                                            color: '#ffffff'
                                        }
                                    ]
                                },
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10
                            }
                        },
                        // "symbol": "circle",
                        symbolSize: 10,
                        data: this.feedShaftRatio
                    }
                ]
            };
            this.orderCharts.setOption(opt);
        }
    }
};
</script>

<style scoped lang="scss">
.order_charts {
    // padding-right: 40px;
    #orderCharts {
        width: 100%;
        height: 250px;
        padding-top: 10px;
    }
}
</style>