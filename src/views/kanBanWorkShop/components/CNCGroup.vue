<template>
    <div
        class="CNC_group"
    >
        <div class="title">CNC组</div>
        <!-- 三种状态显示 -->
        <div class="equipment_status">
            <div class="doing_status">
                <img src="../../../assets/kanBan/doing.png">
                <span>加工中</span>
            </div>
            <div class="stop_status">
                <img src="../../../assets/kanBan/free.png">
                <span>空闲</span>
            </div>
            <div class="free_status">
                <img src="../../../assets/kanBan/stop.png">
                <span>关机</span>
            </div>
        </div>
        <!-- 设备 -->
        <div class="equipments">
            <!-- 第一列 -->
            <div class="column_first">
                <div
                    :class="judgeEquipmentStatus(X141.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X141.completionRate) }}</span>
                    <span class="station_name">X141</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X096.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X096.completionRate) }}</span>
                    <span class="station_name">X096</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X084.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X084.completionRate) }}</span>
                    <span class="station_name">X084</span>
                </div>
                <div
                    :class="judgeEquipmentStatusLong(X085.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X085.completionRate) }}</span>
                    <span class="station_name">X085</span>
                </div>
                <div
                    :class="judgeEquipmentStatusLong(X086.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X086.completionRate) }}</span>
                    <span class="station_name">X086</span>
                </div>
            </div>
            <!-- 第二列 -->
            <div class="column_second">
                <div
                    :class="judgeEquipmentStatus(X081.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X081.completionRate) }}</span>
                    <span class="station_name">X081</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X137.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X137.completionRate) }}</span>
                    <span class="station_name">X137</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X120.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X120.completionRate) }}</span>
                    <span class="station_name">X120</span>
                </div>
                <div
                    v-if="false"
                    :class="judgeEquipmentStatus(jxs.status)"
                >
                    <span class="the_percentage transfer_arm">机械手</span>
                    <span class="station_name" />
                </div>
                <div
                    :class="judgeEquipmentStatus(X119.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X119.completionRate) }}</span>
                    <span class="station_name">X119</span>
                </div>
            </div>
            <!-- 第三列 -->
            <div class="column_third">
                <div
                    :class="judgeEquipmentStatus(X127.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X127.completionRate) }}</span>
                    <span class="station_name">X127</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X117.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X117.completionRate) }}</span>
                    <span class="station_name">X117</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X091.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X091.completionRate) }}</span>
                    <span class="station_name">X091</span>
                </div>
            </div>
            <!-- 第四列 -->
            <div class="column_fourth">
                <div
                    :class="judgeEquipmentStatus(X139.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X139.completionRate) }}</span>
                    <span class="station_name">X139</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X128.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X128.completionRate) }}</span>
                    <span class="station_name">X128</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X107.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X107.completionRate) }}</span>
                    <span class="station_name">X107</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X116.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X116.completionRate) }}</span>
                    <span class="station_name">X116</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X106.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X106.completionRate) }}</span>
                    <span class="station_name">X106</span>
                </div>
            </div>
            <!-- 第五列 -->
            <div class="column_fifth">
                <div
                    :class="judgeEquipmentStatus(X122.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X122.completionRate) }}</span>
                    <span class="station_name">X122</span>
                </div>
                <div
                    :class="judgeEquipmentStatusHigh(X098.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X098.completionRate) }}</span>
                    <span class="station_name">X098</span>
                </div>
            </div>
            <!-- 第六列 -->
            <div class="column_sixth">
                <div
                    :class="judgeEquipmentStatusLong(X089.status)"
                    class="X089"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X089.completionRate) }}</span>
                    <span class="station_name">X089</span>
                </div>
                <div
                    :class="judgeEquipmentStatusLong(X053.status)"
                    class="X053"
                >
                    <span class="the_percentage ">{{ floatNumberResolve(X053.completionRate) }}</span>
                    <span class="station_name">X053</span>
                </div>
                <div
                    :class="judgeEquipmentStatusLong(X054.status)"
                    class="X054"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X054.completionRate) }}</span>
                    <span class="station_name">X054</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
     /**
     * @module CNC组
     * @author chebin
     */
import Math from '@/utils/calculation'
export default {
    props: {
        cNCGroup: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            X141: {status: 'UNKNOWN', completionRate: 0},
            X096: {status: 'UNKNOWN', completionRate: 0},
            X084: {status: 'UNKNOWN', completionRate: 0},
            X085: {status: 'UNKNOWN', completionRate: 0},
            X086: {status: 'UNKNOWN', completionRate: 0},
            X081: {status: 'UNKNOWN', completionRate: 0},
            X137: {status: 'UNKNOWN', completionRate: 0},
            X120: {status: 'UNKNOWN', completionRate: 0},
            X119: {status: 'UNKNOWN', completionRate: 0},
            X127: {status: 'UNKNOWN', completionRate: 0},
            X117: {status: 'UNKNOWN', completionRate: 0},
            X091: {status: 'UNKNOWN', completionRate: 0},
            X139: {status: 'UNKNOWN', completionRate: 0},
            X128: {status: 'UNKNOWN', completionRate: 0},
            X107: {status: 'UNKNOWN', completionRate: 0},
            X116: {status: 'UNKNOWN', completionRate: 0},
            X106: {status: 'UNKNOWN', completionRate: 0},
            X122: {status: 'UNKNOWN', completionRate: 0},
            X098: {status: 'UNKNOWN', completionRate: 0},
            X089: {status: 'UNKNOWN', completionRate: 0},
            X053: {status: 'UNKNOWN', completionRate: 0},
            X054: {status: 'UNKNOWN', completionRate: 0},
            jxs: {status: 'UNKNOWN',}
        }
    },
    watch: {
        cNCGroup () {
            // 设备数据解析
            this.resolveEquiptInfo()
        },
        immediate: true
    },
    mounted () {
    },
    methods: {
        // 小数精度计算
        floatNumberResolve (number) {
            return `${Math.numberOperation(number * 100)}%`
        },
        // 根据设备不同状态来显示不同的样式
        judgeEquipmentStatus(status) {
            if (status === 'PROCESSING') {
                return 'small_doing'
            }
            if (status === 'IDLING') {
                return 'small_free'
            }
            if (status === 'SHUTDOWN') {
                return 'small_stop'
            }
            /**
             * 模拟数据，需修改
             */
            if (status === 'UNKNOWN') {
                return 'small_stop'
            }
        },
        // 根据设备不同状态来显示不同的样式(判断比较特殊设备：特点 宽的)
        judgeEquipmentStatusLong(status) {
            if (status === 'PROCESSING') {
                return 'long_doing'
            }
            if (status === 'IDLING') {
                return 'long_free'
            }
            if (status === 'SHUTDOWN') {
                return 'long_stop'
            }
            /**
             * 模拟数据，需修改
             */
            if (status === 'UNKNOWN') {
                return 'long_stop'
            }
        },
        // 根据设备不同状态来显示不同的样式(判断比较特殊设备：特点 高的)
        judgeEquipmentStatusHigh(status) {
            if (status === 'PROCESSING') {
                return 'high_doing'
            }
            if (status === 'IDLING') {
                return 'high_free'
            }
            if (status === 'SHUTDOWN') {
                return 'high_stop'
            }
            /**
             * 模拟数据，需修改
             */
            if (status === 'UNKNOWN') {
                return 'high_stop'
            }
        },
        // 设备数据解析
        resolveEquiptInfo () {
            this.cNCGroup.forEach((item, index) => {
                if (item.equipNo === 'X141') {
                    console.log(item)
                    this.X141 = item
                }
                if (item.equipNo === 'X096') {
                    this.X096 = item
                }
                if (item.equipNo === 'X084') {
                    this.X084 = item
                }
                if (item.equipNo === 'X085') {
                    this.X085 = item
                }
                if (item.equipNo === 'X086') {
                    this.X086 = item
                }
                if (item.equipNo === 'X081') {
                    this.X081 = item
                }
                if (item.equipNo === 'X137') {
                    this.X137 = item
                }
                if (item.equipNo === 'X120') {
                    this.X120 = item
                }
                if (item.equipNo === 'X119') {
                    this.X119 = item
                }
                if (item.equipNo === 'X127') {
                    this.X127 = item
                }
                if (item.equipNo === 'X117') {
                    this.X117 = item
                }
                if (item.equipNo === 'X091') {
                    this.X091 = item
                }
                if (item.equipNo === 'X139') {
                    this.X139 = item
                }
                if (item.equipNo === 'X128') {
                    this.X128 = item
                }
                if (item.equipNo === 'X107') {
                    this.X107 = item
                }
                if (item.equipNo === 'X116') {
                    this.X116 = item
                }
                if (item.equipNo === 'X106') {
                    this.X106 = item
                }
                if (item.equipNo === 'X122') {
                    this.X122 = item
                }
                if (item.equipNo === 'X098') {
                    this.X098 = item
                }
                if (item.equipNo === 'X089') {
                    this.X089 = item
                }
                if (item.equipNo === 'X053') {
                    this.X053 = item
                }
                if (item.equipNo === 'X054') {
                    this.X054 = item
                }
                if (item.equipNo === 'jxs') {
                    this.jxs = item
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .CNC_group {
        position: absolute;
        width: 1110px;
        height: 650px;
        top: 102px;
        left: 431px;

        .title {
            color: #fff;
            font-size: 16px;
            padding-top: 17px;
            margin-left: 50px;
        }

        .equipment_status {
            margin-left: 805px;
            margin-top: -18px;
            div {
                display: inline-block;
                margin-right: 20px;

                img {
                    vertical-align: sub;
                }
                span {
                    color: #fff;
                }
            }
        }

        .equipments {
            position: relative;
            padding: 0 60px;
            padding-top: 20px;
            margin-left: 20px;
            color: #fff;

            // 设备里面数据共用的样式
            .the_percentage {
                position: absolute;
                margin: 0 auto;
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 26px;
                font-weight: 700;
                top: 22px;
            }
            .station_name {
                position: absolute;
                margin: 0 auto;
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 18px;
                top: 66px;
            }
            // 机械手单独样式
            .transfer_arm {
                font-weight: normal;
                font-size: 22px
            }
            // 第一列
            .column_first {

                .small_free {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Free.png') no-repeat;
                }
                .small_doing {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
                }
                .small_stop {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Stop.png') no-repeat;
                }
                .long_doing {
                    position: relative;
                    width: 150px;
                    height: 100px;
                    margin-bottom: 20px;
                    background:url('../../../assets/kanBan/The_special_unit_Doing.png') no-repeat;
                }
                .long_stop {
                    position: relative;
                    width: 150px;
                    height: 100px;
                    margin-bottom: 20px;
                    background:url('../../../assets/kanBan/The_special_unit_Stop.png') no-repeat;
                }
                .long_free {
                    position: relative;
                    width: 150px;
                    height: 100px;
                    margin-bottom: 20px;
                    background:url('../../../assets/kanBan/The_special_unit_Free.png') no-repeat;
                }
            }
            // 第二列
            .column_second {
                padding-top: 20px;
                position: absolute;
                top: 0;
                left: 211px;

                .small_doing {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
                }
                .small_stop {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Stop.png') no-repeat;
                }
                .small_free {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Free.png') no-repeat;
                }
            }
            // 第三列
            .column_third {
                padding-top: 20px;
                position: absolute;
                top: 0;
                left: 362px;

                .small_doing {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    margin-top: 60px;
                    background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
                }
                .small_stop {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Stop.png') no-repeat;
                }
                .small_free {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 80px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Free.png') no-repeat;
                }
            }
            // 第四列
            .column_fourth {
                padding-top: 20px;
                position: absolute;
                top: 0;
                left: 512px;
                .small_doing {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
                }
                .small_stop {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Stop.png') no-repeat;
                }
                .small_free {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Free.png') no-repeat;
                }
            }
            // 第五列
            .column_fifth {
                padding-top: 20px;
                position: absolute;
                top: 0;
                left: 662px;
                .small_doing {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
                }
                .small_stop {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Stop.png') no-repeat;
                }
                .small_free {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Free.png') no-repeat;
                }
                // .small_doing {
                //     position: relative;
                //     width: 100px;
                //     height: 100px;
                //     margin-bottom:110px;
                //     margin-left: 50px;
                //     margin-top: 150px;
                //     background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
                // }
                .high_free {
                    position: relative;
                    width: 100px;
                    height: 170px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Free_02.png') no-repeat;

                    .the_percentage {
                        position: absolute;
                        margin: 0 auto;
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 700;
                        top: 55px;
                    }
                    .station_name {
                        position: absolute;
                        margin: 0 auto;
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                        font-size: 18px;
                        top: 127px;
                    }
                }
                .high_doing {
                    position: relative;
                    width: 100px;
                    height: 170px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Doing_02.png') no-repeat;

                    .the_percentage {
                        position: absolute;
                        margin: 0 auto;
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 700;
                        top: 55px;
                    }
                    .station_name {
                        position: absolute;
                        margin: 0 auto;
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                        font-size: 18px;
                        top: 127px;
                    }
                }
                .high_stop {
                    position: relative;
                    width: 100px;
                    height: 170px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/CNC_Stop_02.png') no-repeat;

                    .the_percentage {
                        position: absolute;
                        margin: 0 auto;
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 700;
                        top: 55px;
                    }
                    .station_name {
                        position: absolute;
                        margin: 0 auto;
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                        font-size: 18px;
                        top: 127px;
                    }
                }
            }

            // 第六列
            .column_sixth {
                padding-top: 20px;
                position: absolute;
                top: 0;
                left: 812px;

                .long_doing {
                    position: relative;
                    width: 150px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    margin-top: 240px;
                    background:url('../../../assets/kanBan/The_special_unit_Doing.png') no-repeat;
                }
                .long_stop {
                    position: relative;
                    width: 150px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/The_special_unit_Stop.png') no-repeat;
                }
                .long_free {
                    position: relative;
                    width: 150px;
                    height: 100px;
                    margin-bottom: 20px;
                    margin-left: 50px;
                    background:url('../../../assets/kanBan/The_special_unit_Free.png') no-repeat;
                }
                .X089 {
                    margin-top: 240px;
                }
                .X053 {
                    margin-top: 0px;
                }
                .X054 {
                    margin-top: 0px;
                }
            }
        }
    }
</style>
