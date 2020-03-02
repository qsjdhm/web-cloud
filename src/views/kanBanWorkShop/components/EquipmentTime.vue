<template>
    <div class="equipment_time">
        <div class="title">设备时间占比</div>
        <div
            id="charts-2"
            ref="EquimentCharts"
            class="charts"
        />
        <div class="legend">
            <div class="doing_part">
                <div class="logo" />
                <div class="right_part">
                    <div class="number">{{ equimentDoingPercentage ? equimentDoingPercentage : 0 + '%' }}</div>
                    <div class="text">{{ '设备加工中' }}</div>
                </div>
            </div>
            <div class="free_part">
                <div class="logo" />
                <div class="right_part">
                    <div class="number">{{ equimentFreePercentage ? equimentFreePercentage : 0 + '%' }}</div>
                    <div class="text">{{ '设备空闲' }}</div>
                </div>
            </div>
            <div class="stop_part">
                <div class="logo" />
                <div class="right_part">
                    <div class="number">{{ equimentStopPercentage ? equimentStopPercentage : 0 + '%' }}</div>
                    <div class="text">{{ '设备关机' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @module 设备时间占比
     * @author chebin
     */
import Echarts from 'echarts'
export default {
    props: {
        equipmentTimeData: {
            type: Object,
            required:true
        }
    },
    data () {
        return {
            equimentCharts:'',
            equipmentFreePercentage:'25%',
            equipmentDoingPercentage:'38%',
            equipmentStopPercentage:'37%',
            // 总时间
            allTime: null,
            // 设备加工中比例
            equimentDoingPercentage: '',
            // 设备空闲比例
            equimentFreePercentage: '',
            // 设备关机比例
            equimentStopPercentage: ''
        }
    },
    watch: {
       equipmentTimeData (val) {

           this.allTime = val.IDLING+val.PROCESSING+val.SHUTDOWN
           if (this.allTime > 0) {
               this.equimentDoingPercentage = ((val.PROCESSING/this.allTime)*100).toFixed(2)+'%'
               this.equimentFreePercentage = ((val.IDLING/this.allTime)*100).toFixed(2)+'%'
               this.equimentStopPercentage = ((val.SHUTDOWN/this.allTime)*100).toFixed(2)+'%'
               this.renderEcharts(this.equimentDoingPercentage, this.equimentFreePercentage, this.equimentStopPercentage, {value:val.PROCESSING,name:"设备加工中"}, {value:val.IDLING,name:"设备空闲"}, {value:val.SHUTDOWN,name:"设备关机"})

           }

       },
       immediate: true
    },
    mounted () {
    },
    methods: {
        renderEcharts (doing, free, stop, doingNub, freeNub, stopNub) {
            this.equimentCharts = Echarts.init(document.getElementById('charts-2'))
            let options = {
                tooltip:{
                    trigger: 'item',
                    formatter: function(params) {
                       var relVal = "";
                        let marker = "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:"+ params.data.label.color +";'></span>"
                        relVal +=  params.data.statusName.name +'<br/>'+marker +params.value +"秒"+ ' : ' + params.name;
                        return relVal;
                    }
                },
                legend: {
                    show:false,
                    orient: 'vertical',
                    data: ['设备加工中','设备空闲','设备关机'],
                    // color:'#ffffff',
                    icon:"circle",
                    top: "30%",
                    left: '85%',
                    textStyle: {
                        color:'#fff'
                    },
                    width:50,
                    padding: [0, 5],
                    itemGap: 50,
                },
                series : [
                    {
                        name: '设备时间占比',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '60%'],
                        data:[
                            {
                                value:doingNub.value,
                                name:doing,
                                statusName:doingNub,
                                label: {
                                    color: '#4cff97'
                                },
                                itemStyle: {
                                normal: {//颜色渐变
                                    color: new Echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            // {offset: 0, color: '#ff8800'},
                                            {offset: 0, color: '#3b5f56'},
                                            {offset: 1, color: '#4cff97'}
                                        ]
                                    )
                                }
                            }},
                            {
                             value:freeNub.value,
                             name:free,
                             statusName:freeNub,
                             label: {
                                 color: '#ff8800'
                             },
                             itemStyle: {
                                normal: {//颜色渐变
                                    color: new Echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#ff8800'},
                                            {offset: 1, color: '#684428'}
                                        ]
                                    )
                                }
                            }},
                            {
                            value:stopNub.value,
                            name:stop,
                            statusName:stopNub,
                            label: {
                                color: '#ff4c6a'
                            },
                            itemStyle: {
                                normal: {//颜色渐变
                                    color: new Echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color:'#6e3643'},
                                            {offset: 1, color: '#ff4c6a'}
                                        ]
                                    )
                                }
                            }},
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            this.equimentCharts.setOption(options)
        }
    }
}
</script>

<style lang="scss" scoped>
    .equipment_time {
        position: absolute;
        bottom: 23px;
        left: 740px;
        width: 699px;
        height: 286px;
        .title {
            color: #fff;
            font-size: 16px;
            padding-top: 17px;
            margin-left: 50px;
        }

        .charts {
            width: 700px;
            height: 250px;
            margin-left: -100px;
            margin-top: -20px;
        }

        .legend {
            position: absolute;
            width: 135px;
            // display: flex;
            height: 171px;
            top:60px;
            right: 60px;
            color: #fff;
            .right_part {
                    width: 100px;
                    height: 50px;
                    .number {
                        font-size: 24px;
                        font-family: PingFang-SC-Medium;
                    }
                    .text {
                        font-size: 12px;
                        font-family: PingFang-SC-Medium;
                        margin-top: 5px;
                        color: #ccc;
                    }
                }
            .doing_part {
                display: flex;
                margin-bottom: 20px;
                .logo {
                    background: url('../../../assets/kanBan/doing.png') no-repeat;
                    width: 19px;
                    height: 20px;
                    margin-top: 12px;
                    margin-right: 10px;
                }

            }
            .free_part {
                display: flex;
                margin-bottom: 20px;
                .logo {
                    background: url('../../../assets/kanBan/free.png') no-repeat;
                    width: 19px;
                    height: 20px;
                    margin-top: 12px;
                    margin-right: 10px;
                }

            }
            .stop_part {
                display: flex;
                .logo {
                    background: url('../../../assets/kanBan/stop.png') repeat;
                    width: 19px;
                    height: 20px;
                    margin-top: 12px;
                    margin-right: 10px;
                }

            }
        }
    }
</style>
