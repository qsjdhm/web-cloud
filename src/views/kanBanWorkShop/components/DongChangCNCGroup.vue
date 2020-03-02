<template>
    <div
        class="dong_chang_CNC_Group"
    >
        <div class="title">东厂CNC组</div>
        <!-- 设备 -->
        <div class="equipments">
            <!-- 第一列 -->
            <div class="column_first">
                <div
                    :class="judgeEquipmentStatus(X125.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X125.completionRate) }}</span>
                    <span class="station_name">X125</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X126.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X126.completionRate) }}</span>
                    <span class="station_name">X126</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X136.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X136.completionRate) }}</span>
                    <span class="station_name">X136</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X082.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X082.completionRate) }}</span>
                    <span class="station_name">X082</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X140.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X140.completionRate) }}</span>
                    <span class="station_name">X140</span>
                </div>
            </div>
            <!-- 第二列 -->
            <div
                class="column_second"
            >
                <div
                    :class="judgeEquipmentStatus(X115.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X115.completionRate) }}</span>
                    <span class="station_name">X115</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X129.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X129.completionRate) }}</span>
                    <span class="station_name">X129</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X138.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X138.completionRate) }}</span>
                    <span class="station_name">X138</span>
                </div>
                <div
                    :class="judgeEquipmentStatus(X114.status)"
                >
                    <span class="the_percentage">{{ floatNumberResolve(X114.completionRate) }}</span>
                    <span class="station_name">X114</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @module 东厂CNC组
     * @author chebin
     */
import Math from '@/utils/calculation'
export default {
    props: {
        dongChangCNCGroup: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            X125:{status: 'UNKNOWN', completionRate: '0%'},
            X126:{status: 'UNKNOWN', completionRate: '0%'},
            X136:{status: 'UNKNOWN', completionRate: '0%'},
            X082:{status: 'UNKNOWN', completionRate: '0%'},
            X140:{status: 'UNKNOWN', completionRate: '0%'},
            X115:{status: 'UNKNOWN', completionRate: '0%'},
            X129:{status: 'UNKNOWN', completionRate: '0%'},
            X138:{status: 'UNKNOWN', completionRate: '0%'},
            X114:{status: 'UNKNOWN', completionRate: '0%'},
        }
    },
     watch: {
        dongChangCNCGroup () {
            // 设备数据解析
            this.resolveEquiptInfo()
        }
    },
    methods: {
        // 小数精度计算
        floatNumberResolve (number) {
            return `${Math.numberOperation(number * 100)}%`
        },
        // 根据设备不同状态来显示不同的样式
        judgeEquipmentStatus(status) {
            if (!status) {
                console.log('无status')
            }
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
        // 设备数据解析
        resolveEquiptInfo () {
            console.log(this.dongChangCNCGroup)
            this.dongChangCNCGroup.forEach((item, index) => {
                if (item.equipNo === 'X125') {
                    this.X125 = item
                }
                if (item.equipNo === 'X126') {
                    this.X126 = item
                }
                if (item.equipNo === 'X136') {
                    this.X136 = item
                }
                if (item.equipNo === 'X082') {
                    this.X082 = item
                }
                if (item.equipNo === 'X140') {
                    this.X140 = item
                }
                if (item.equipNo === 'X115') {
                    this.X115 = item
                }
                if (item.equipNo === 'X129') {
                    this.X129 = item
                }
                if (item.equipNo === 'X138') {
                    this.X138 = item
                }
                if (item.equipNo === 'X114') {
                    this.X114 = item
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .dong_chang_CNC_Group {
        position: absolute;
        width: 336px;
        height: 650px;
        top: 102px;
        right: 21px;

        .title {
            color: #fff;
            font-size: 16px;
            padding-top: 17px;
            margin-left: 50px;
        }

        .equipments {
            padding-top: 20px;
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

            .column_first {

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
            .column_second {
                margin-left: 60px;
                position: absolute;
                top: 174px;
                left: 94px;

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
        }
    }
</style>
