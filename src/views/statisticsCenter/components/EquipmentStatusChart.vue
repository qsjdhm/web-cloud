<template>
    <div class="equipment-status-chart-pack">
        <common-title
            :options="{text: '设备状态分析'}"
        />
        <div id="equipmentStatusChart" />
    </div>
</template>

<script>
    /**
     * @module 设备状态图表
     * @author 李志鸣
     */
    import Echarts from 'echarts'
    import Math from '@/utils/calculation'
    import CommonTitle from '@/components/CommonsTitle'

    export default {
        name: 'StatisticsCenterEquipmentStatusChart',
        components: {
            CommonTitle
        },
        props: {
            equipmentStatusChartData: {
                type: null,
                required: true
            }
        },
        data () {
            return {}
        },
        watch: {
            equipmentStatusChartData: {
                handler (newVal, oldVal) {
                    // 渲染饼图
                    this.renderChart()
                },
                deep: true
            }
        },
        methods: {
            // 渲染饼图
            renderChart () {
                let domItem = document.getElementById('equipmentStatusChart')
                Echarts.dispose(domItem)
                let echart = Echarts.init(domItem)
                let echartData = [
                    {name:'加工中', value: Math.numberOperation(this.equipmentStatusChartData.processing * 100)},
                    {name:'关机', value: Math.numberOperation(this.equipmentStatusChartData.shutdown * 100)},
                    {name:'调试/待机', value: Math.numberOperation(this.equipmentStatusChartData.idle * 100)}
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
                        data: ['加工中', '关机', '调试/待机'],
                        show: true,
                        itemGap: 30
                    },
                    color: ['#41da8f', '#d2000d', '#ffb95b'],
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
                            data:echartData,
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
    .equipment-status-chart-pack {
        height: 100%;
        width: 100%;
        background-color: #ffffff;
        border-radius: 0 0 4px 4px;
        #equipmentStatusChart {
            width: 100%;
            height: 243px;
        }
    }
</style>
