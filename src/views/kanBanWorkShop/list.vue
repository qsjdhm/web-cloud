<template>
    <div
        class="page-pack"
    >
        <div
            class="container"
        >
            <div class="top">
                <div class="kan_ban_name">设备管理系统—车间看板</div>
                <div class="real_time">{{ timeNow }}</div>
            </div>
            <div
                class="page_body"
            >
                <!-- 特种机组CNC -->
                <TheSpecialUnit
                    :the-special-unit="equipProcessingStatusVOList"
                />
                <!-- 活动刀组、FX活动刀组CNC -->
                <ActivityKnifeSet :activity-knife-set="equipProcessingStatusVOList" />
                <!-- CNC组  -->
                <CNCGroup :c-n-c-group="equipProcessingStatusVOList" />
                <!-- 东厂CNC组  -->
                <DongChangCNCGroup :dong-chang-c-n-c-group="equipProcessingStatusVOList" />
            </div>
            <div class="page_footer">
                <!-- 设备数量占比 -->
                <EquipmentNumber :equipment-number="equipmentNumberData" />
                <!-- 设备时间占比 -->
                <EquipmentTime :equipment-time-data="equipmentTimeData" />
                <!-- 设备利用率 -->
                <EquipmentUtilization
                    :rate-of-equipment-utilization="rateOfEquipmentUtilization"
                    :all-equipment-time-to-utilization="allEquipmentTimeToUtilization"
                />
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @module 设备管理系统—车间看板
     * @author chebin
     */
import Moment from 'moment'
import TheSpecialUnit from './components/TheSpecialUnit'
import ActivityKnifeSet from './components/ActivityKnifeSet'
import CNCGroup from './components/CNCGroup'
import DongChangCNCGroup from './components/DongChangCNCGroup'
import EquipmentNumber from './components/EquipmentNumber'
import EquipmentTime from './components/EquipmentTime'
import EquipmentUtilization from './components/EquipmentUtilization'
export default {
    name: 'KanBanWorkShop',
    components: {
        TheSpecialUnit,
        ActivityKnifeSet,
        CNCGroup,
        DongChangCNCGroup,
        EquipmentNumber,
        EquipmentTime,
        EquipmentUtilization
    },
    data () {
        return {
            // 当前时间
            timeNow:'',
            // 车间看板数据
            equipProcessingStatusVOList:[],
            //设备数量占比数据
            equipmentNumberData:{},
            // 设备时间占比
            equipmentTimeData: {},
            // 设备利用率
            rateOfEquipmentUtilization: 1,
            //定时器
            timer:'',
            // 轮询请求数据
            dataTimer: '',
            // 设备各种状态时间总数据
            allEquipmentTimeToUtilization:1

        }
    },
    mounted () {
        setTimeout(() => {
            this.getTimmingData()
            this.dataTimer = setInterval(() => {
                this.getTimmingData()
            }, 20000)
            // 实时时间
            this.judgeTimeNow()
        }, 0)
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
        }
        if (this.dataTimer) {
            clearInterval(this.dataTimer)
        }
    },
    methods: {
        // 获取页面数据
        getTimmingData () {
            this.$service('GET', '/SERVICE-BUSINESS/api/kanban/equipInfoList').then(res => {
                this.equipProcessingStatusVOList = _.cloneDeep(res.equipProcessingStatusVOList)
                this.equipmentNumberData = _.cloneDeep(res.equipmentStatusCount)
            })
            this.$service('GET', '/SERVICE-BUSINESS/api/kanban/proportionOfTime').then(res => {
                this.equipmentTimeData = _.cloneDeep(res)
                this.rateOfEquipmentUtilization = Number(res.utilization)
                console.log( Number(res.utilization), ' Number(res.utilization) Number(res.utilization) Number(res.utilization)')
                this.allEquipmentTimeToUtilization = res.IDLING + res.PROCESSING + res.SHUTDOWN
                console.log(typeof this.allEquipmentTimeToUtilization, '222222222222222222')
            })
            console.log('轮询...')
        },
         // 实时时间
        judgeTimeNow () {
            this.timeNow = Moment().format('YYYY-MM-DD HH:mm:ss')
            this.timer = setInterval(() => {
                this.timeNow = Moment().format('YYYY-MM-DD HH:mm:ss')
            }, 1000)
        },
    }
}
</script>

<style lang="scss" scoped>
    .page-pack {
        width: 100%;
        height: 100%;
        background-color: #001927;

        .container {
            position: relative;
            width: 1920px;
            height: 1080px;
            margin: 0 auto;
            background: url('../../assets/kanBan/bg_main.jpg');

            .top {
                position: relative;
                width: 100%;
                .kan_ban_name {
                    margin: 0 auto;
                    text-align: center;
                    padding-top: 30px;
                    font-size: 28px;
                    font-weight: normal;
                    color: #ffffff;
                }
                .real_time {
                    position: absolute;
                    font-size: 28px;
                    font-weight: 700;
                    color: #ffffff;
                    top: 50%;
                    margin-top: -16px;
                    right: 5%;
                }
            }
        }
    }
</style>