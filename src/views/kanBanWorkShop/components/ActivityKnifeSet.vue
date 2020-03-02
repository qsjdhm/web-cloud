<template>
    <div
        class="activity_knife_set"
    >
        <div class="title">活动刀组、FX活动刀组CNC</div>
        <div class="part_one">
            <div
                :class="judgeEquipmentStatus(X130.status)"
            >
                <span class="the_percentage">{{ floatNumberResolve(X130.completionRate) }}</span>
                <span class="station_name">X130</span>
            </div>
            <div
                :class="judgeEquipmentStatus(X124.status)"
            >
                <span class="the_percentage">{{ floatNumberResolve(X124.completionRate) }}</span>
                <span class="station_name">X124</span>
            </div>
            <div
                :class="judgeEquipmentStatus(X079.status)"
            >
                <span class="the_percentage">{{ floatNumberResolve(X079.completionRate) }}</span>
                <span class="station_name">X079</span>
            </div>
        </div>
        <div class="part_two">
            <div
                :class="judgeEquipmentStatus(X131.status)"
            >
                <span class="the_percentage">{{ floatNumberResolve(X131.completionRate) }}</span>
                <span class="station_name">X131</span>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @module 活动刀组、FX活动刀组CNC
     * @author chebin
     */
import Math from '@/utils/calculation'
export default {
    props: {
        activityKnifeSet: {
            type: Array,
            required:true
        }
    },
    data () {
        return {
            X130: {status: 'UNKNOWN', completionRate: '0%'},
            X124: {status: 'UNKNOWN', completionRate: '0%'},
            X079: {status: 'UNKNOWN', completionRate: '0%'},
            X131: {status: 'UNKNOWN', completionRate: '0%'}
        }
    },
    watch: {
        activityKnifeSet () {
            // 设备数据解析
            this.resolveEquiptInfo()
        }
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
                return 'doing'
            }
            if (status === 'IDLING') {
                return 'free'
            }
            if (status === 'SHUTDOWN') {
                return 'stop'
            }
            /**
             * 模拟数据，需修改
             */
            if (status === 'UNKNOWN') {
                return 'stop'
            }
        },
        // 设备数据解析
        resolveEquiptInfo () {
            this.activityKnifeSet.forEach((item, index) => {
                if (item.equipNo === 'X130') {
                    this.X130 = item
                }
                if (item.equipNo === 'X124') {
                    this.X124 = item
                }
                if (item.equipNo === 'X131') {
                    this.X131 = item
                }
                if (item.equipNo === 'X079') {
                    this.X079 = item
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .activity_knife_set {
        width: 392px;
        height: 340px;
        margin-top: 20px;
        margin-left: 20px;
        .title {
            color: #fff;
            font-size: 16px;
            padding-top: 17px;
            margin-left: 50px;
        }
        .part_one {
            margin-top: 34px;
            color: #fff;
            .free {
                position: relative;
                display: inline-block;
                width: 100px;
                height: 100px;
                margin-left: 20px;
                background:url('../../../assets/kanBan/CNC_Free.png') no-repeat;
            }
            .doing {
                position: relative;
                display: inline-block;
                width: 100px;
                height: 100px;
                margin-left: 20px;
                background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
            }
            .stop {
                position: relative;
                display: inline-block;
                width: 100px;
                height: 100px;
                margin-left: 20px;
                background:url('../../../assets/kanBan/CNC_Stop.png') no-repeat;
            }
        }
        .part_two {
            margin-top: 20px;
            margin-left: 32%;
            color: #fff;
            .doing {
                position: relative;
                width: 100px;
                height: 100px;
                background:url('../../../assets/kanBan/CNC_Doing.png') no-repeat;
            }
            .stop {
                position: relative;
                display: inline-block;
                width: 100px;
                height: 100px;
                margin-left: 20px;
                background:url('../../../assets/kanBan/CNC_Stop.png') no-repeat;
            }
            .free {
                position: relative;
                display: inline-block;
                width: 100px;
                height: 100px;
                margin-left: 20px;
                background:url('../../../assets/kanBan/CNC_Free.png') no-repeat;
            }
        }
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
    }
</style>
