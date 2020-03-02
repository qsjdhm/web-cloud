<template>
    <div class="equipment-utilization-chart-pack">
        <common-title
            :options="{text: '设备利用率分析'}"
        />
        <div id="equipmentUtilizationChart" />
    </div>
</template>

<script>
    /**
     * @module 设备利用率图表
     * @author 李志鸣
     */
    import Echart from 'echarts'
    import Math from '@/utils/calculation'
    import CommonTitle from '@/components/CommonsTitle'

    export default {
        name: 'StatisticsCenterEquipmentUtilizationChart',
        components: {
            CommonTitle
        },
        props: {
            equipmentUtilizationChartData: {
                type: Object,
                required: true
            }
        },
        data () {
            return {}
        },
        watch: {
            equipmentUtilizationChartData: {
                handler (newVal, oldVal) {
                    // 渲染图表
                    this.renderChart()
                },
                deep: true
            }
        },
        methods: {
            // 渲染图表
            renderChart () {
                let domItem = document.getElementById('equipmentUtilizationChart')
                Echart.dispose(domItem)
                let echart = Echart.init(domItem)
                let echartData = [
                    {
                        value: Math.numberOperation(this.equipmentUtilizationChartData.usage * 100),
                        name:'利用率'
                    },
                    {
                        value: Math.numberOperation(this.equipmentUtilizationChartData.idle * 100),
                        name: '',
                        itemStyle: {
                            normal: {color: '#edeef6'},
                            emphasis: {color: '#edeef6'}
                        }
                    }
                ]
                let options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.marker + ' ' + params.name + ' ' + params.value + '%'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        left: '75%',
                        top: 'center',
                        data: ['利用率', ''],
                        show: true,
                        itemGap: 30
                    },
                    color: ['#438afe', '#edeef6'],
                    series: [
                        {
                            type:'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    },
                                    formatter: function (params) {
                                        return params.value + '%'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: echartData,
                            itemStyle: {
                                borderColor: '#ffffff',
                                borderWidth: 5
                            }
                        }
                    ]
                }
                echart.setOption(options)
                echart.dispatchAction({ type: 'highlight', dataIndex: 0 })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .equipment-utilization-chart-pack{
        height: 100%;
        width: 100%;
        background-color: #ffffff;
        border-radius: 4px;
        #equipmentUtilizationChart {
            height: 243px;
            width: 100%;
        }
    }
</style>
