<template>
    <div class="equipment_number">
        <div class="title">设备数量占比</div>
        <div
            id="charts"
            ref="EquimentCharts"
            class="charts"
        />
        <div class="legend">
            <div class="doing_part">
                <div class="logo" />
                <div class="number">{{ equipmentNumber.PROCESSING + '台' }}</div>
                <div class="text">{{ '设备加工中' }}</div>
            </div>
            <div class="free_part">
                <div class="logo" />
                <div class="number">{{ equipmentNumber.IDLING + '台' }}</div>
                <div class="text">{{ '设备空闲' }}</div>
            </div>
            <div class="stop_part">
                <div class="logo" />
                <div class="number">{{ equipmentNumber.SHUTDOWN + '台' }}</div>
                <div class="text">{{ '设备关机' }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @module 设备数量占比
     * @author chebin
     */
import Echarts from 'echarts'
import Math from '@/utils/calculation'
export default {
    props:{
        equipmentNumber: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            equimentCharts:'',
            equipmentFreePercentage:'25%',
            equipmentDoingPercentage:'38%',
            equipmentStopPercentage:'37%',
            //总设备数
            allEquipmentNum: null

        }
    },
    watch: {
        equipmentNumber (val) {
            this.allEquipmentNum = this.equipmentNumber.IDLING + this.equipmentNumber.PROCESSING + this.equipmentNumber.SHUTDOWN
            this.renderEcharts(val, this.allEquipmentNum)
        }
    },
    mounted () {
    },
    methods: {
        // 小数精度计算
        floatNumberResolve (number) {
            return `${Math.numberOperation(number * 100)}%`
        },
        renderEcharts (data, all) {
            let self = this;
            this.equimentCharts = Echarts.init(document.getElementById('charts'))
            // this.chartTiming.clear();
            let options = {
                tooltip : {
                    trigger: 'item',
                    formatter:function(params){
                        // console.log(params)
                        var relVal = "";
                        let marker = "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:"+ params.data.label.color +";'></span>"
                 //  for (var i = 0, l = params.length; i < l; i++) {//有多种柱子时，用循环
                         relVal +=  params.data.statusName.name +'<br/>'+marker +params.value +"台"+ ' : ' + params.name;
                     //   }
                        return relVal;
                    }
                },
                legend: {
                    show: false,
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
                        name: '设备数量占比',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '60%'],
                        data:[
                            {
                                value: data.PROCESSING,
                                // value:this.equipmentNumber.PROCESSING,
                                name: (((data.PROCESSING/all)*100).toFixed(2)) + '%',
                                // name: '无',
                                statusName:{name:"设备加工中"},
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
                            {value:data.IDLING,
                             name:((((data.IDLING)/all)*100).toFixed(2)) + '%',
                            //  name:'无',
                            statusName:{name:"设备空闲"},
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
                            {value: data.SHUTDOWN,
                            name: ((((data.SHUTDOWN)/all)*100).toFixed(2)) + '%',
                            // name: '无',
                            statusName:{name:"设备关机"},
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
    .equipment_number {
        position: relative;
        width: 700px;
        height: 286px;
        margin-top: 20px;
        margin-left: 22px;
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
            width: 85px;
            height: 37px;
            top: 100px;
            right: 100px;
            color: #fff;

            .number {
                display: inline-block;
                font-size: 24px;
                font-family: BebasNeue-Regular;
                font-weight: normal;
                font-stretch: normal;
            }

            .text {
                display: inline-block;
                font-size: 12px;
                font-family: PingFang-SC-Medium;
                font-weight: normal;
                font-stretch: normal;
                margin-left: 24px;
                margin-top: 5px;
                color: #ccc;
            }
            .doing_part {
                width: 100%;
                margin-top: -50px;
                .logo {
                    background: url('../../../assets/kanBan/doing.png');
                    display: inline-block;
                    width: 19px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    vertical-align: -webkit-baseline-middle;
                }
            }
            .free_part {
                width: 100%;
                margin-top: 20px;
                .logo {
                    background: url('../../../assets/kanBan/free.png');
                    display: inline-block;
                    width: 19px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    vertical-align: -webkit-baseline-middle;
                }

            }
            .stop_part {
                width: 100%;
                margin-top: 20px;
                .logo {
                    background: url('../../../assets/kanBan/stop.png');
                    display: inline-block;
                    width: 19px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    vertical-align: -webkit-baseline-middle;
                }

            }
        }
    }
</style>
