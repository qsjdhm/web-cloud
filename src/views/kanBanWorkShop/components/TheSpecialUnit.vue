<template>
    <div
        class="the_special_unit"
    >
        <div class="title">特种机组CNC</div>
        <div class="part">
            <div
                v-if="X075 !== null"
                :class="judgeEquipmentStatus(X075.status)"
            >
                <span class="the_percentage">{{ floatNumberResolve(X075.completionRate) }}</span>
                <span class="station_name">X075</span>
            </div>
            <!-- <div
                :class="judgeEquipmentStatus(testtesttest.status)"
            >
                <span class="the_percentage">{{ testtesttest ? floatNumberResolve(testtesttest.completionRate) : 0+'%' }}</span>
                <span class="station_name">test-test-test</span>
            </div> -->
            <div
                v-if="X076 !== null"
                :class="judgeEquipmentStatus(X076.status)"
            >
                <span class="the_percentage">{{ floatNumberResolve(X076.completionRate) }}</span>
                <span class="station_name">X076</span>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * @module 特种机组CNC
 * @author chebin
 */
import Math from '@/utils/calculation'
export default {
    props: {
        theSpecialUnit:{
            type: Array,
            required: true
        }
    },
    data () {
        return {
            // X075
            X075: {status: 'UNKNOWN', completionRate: '0%'},
            // X076
            X076: {status: 'UNKNOWN', completionRate: '0%'},
            // testtesttest: {status: 'UNKNOWN', completionRate: 0}
        }
    },
    watch: {
        theSpecialUnit () {
            // 设备数据解析
            this.resolveEquiptInfo()
        }
    },
    mounted () {
    },
    methods:{
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
            if(!status){
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
            this.theSpecialUnit.forEach((item, index) => {
                if (item.equipNo === 'X075') {
                    this.X075 = item
                }
                if (item.equipNo === 'X076') {
                    this.X076 = item
                }
                // if (item.equipNo === 'test-test-test') {
                //     this.testtesttest = item
                // }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .the_special_unit {
        margin-top: 40px;
        margin-left: 20px;
        width: 392px;
        height: 290px;
        .title {
            color: #fff;
            font-size: 16px;
            padding-top: 17px;
            margin-left: 50px;
        }
        .free {
            position: relative;
            color: #fff;
            width: 150px;
            height: 100px;
            line-height: 100px;
            background:url('../../../assets/kanBan/The_special_unit_Free.png') no-repeat;
            margin: 20px auto;


        }
        .doing {
            position: relative;
            color: #fff;
            width: 150px;
            height: 100px;
            line-height: 100px;
            background:url('../../../assets/kanBan/The_special_unit_Doing.png') no-repeat;
            margin: 20px auto;
        }
        .stop {
            position: relative;
            color: #fff;
            width: 150px;
            height: 100px;
            line-height: 100px;
            background:url('../../../assets/kanBan/The_special_unit_Stop.png') no-repeat;
            margin: 20px auto;
        }
            .the_percentage {
                position: absolute;
                margin: 0 auto;
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 26px;
                font-weight: 700;
                top: -13px;
            }
            .station_name {
                position: absolute;
                margin: 0 auto;
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 18px;
                top: 25px;
            }
    }
</style>
