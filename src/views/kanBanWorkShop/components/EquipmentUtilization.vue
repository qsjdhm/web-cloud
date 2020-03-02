<template>
    <div class="equipment_utilization">
        <div class="title">设备利用率</div>
        <div
            id="charts-1"
            ref="EquimentCharts"
            class="charts"
        />
    </div>
</template>

<script>
     /**
      * @module 设备利用率
      * @author chebin
     */
import Echarts from 'echarts'
export default {
    props: {
        rateOfEquipmentUtilization: {
            type: Number,
            required: true,
        },
        allEquipmentTimeToUtilization: {
            type: Number,
            required: true,
        }
    },
    data () {
        return {
            equimentCharts:''
        }
    },
    watch: {
        rateOfEquipmentUtilization (val) {
            this.renderEcharts(val, 1-val)
        },
        allEquipmentTimeToUtilization (val) {
        }
    },

    mounted () {
    },
    methods: {
        renderEcharts (data, unUsing) {
            this.equimentCharts = Echarts.init(document.getElementById('charts-1'))
            let options = {
                series: [{
                    // color:["#00F5FF","#DCDCDC"],
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                            value: data*100,
                            name: data*100+'%',
                            itemStyle: {
                                normal: {//颜色渐变
                                    color: new Echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#19b2ff'},
                                            {offset: 1, color: '#203b5b'}
                                        ]
                                    )
                                }
                            },
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold',
                                        color:'#fff'
                                    }
                                }
                            },
                        },
                        {
                            value: unUsing*100,
                            name: '设备利用率',
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: '14',
                                        color:'#999',
                                        fontWeight: 'bold'
                                    },
                                    padding: [230, 0, 0, 30]
                                },

                            },
                            itemStyle: {
                                color:'#21243b'
                            }
                        }
                    ]
                }]
            };
            this.equimentCharts.setOption(options)
        }
    }
}
</script>

<style lang="scss" scoped>
    .equipment_utilization {
        position: absolute;
        width: 439px;
        height: 286px;
        bottom: 23px;
        right: 21px;
        .title {
            color: #fff;
            font-size: 16px;
            padding-top: 17px;
            margin-left: 50px;
        }

        .charts {
            width: 300px;
            height: 250px;
            margin: 0 auto;
            margin-top: -20px;
        }
    }
</style>
