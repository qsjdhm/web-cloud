<template>
    <div class="Collar">
        <el-row
            type="flex"
            justify="space-between"
        >
            <el-col :span="8">
                <!-- 上限值 -->
                <el-input
                    v-model.trim="cap"
                    clearable
                    style="width:228px"
                    size="mini"
                    :maxlength="this.$global.number"
                    placeholder="上限值(例:30%)"
                    @input="inputValChange"
                    @blur="capBlur"
                />
            </el-col>
            <div style="line-height:28px;margin:0 5px">—</div>
            <el-col :span="8">

                <el-input
                    v-model.trim="offline"
                    clearable
                    style="width:228px"
                    size="mini"
                    :maxlength="this.$global.number"
                    placeholder="下限值(例:10%)"
                    @input="valueChange"
                    @blur="offlineBlur"
                />
            </el-col>

            <el-col
                :span="4"
                style="text-align: right"
            >
                <el-button
                    size="mini"
                    icon="el-icon-circle-check"
                    class="confirm_btn"
                    @click="renderMarkLine"
                >确定</el-button>
            </el-col>
            <el-col :span="16" />
        </el-row>
        <el-row :gutter="10">
            <el-col
                :span="8"
                class="detail-title shaft_multiplier"
            >
                <span class="span-value fon_18">进给轴倍率</span>

            </el-col>
            <el-col
                :span="8"
                class="detail-title keep_time"
            >
                <span class="span-value fon_18">持续时间</span>
            </el-col>
            <el-col :span="8">
                <span />
            </el-col>
        </el-row>
        <el-row :gutter="30">
            <el-col
                :span="8"
                class="detail-title"
            >
                <span class="span-label ml_141"> {{ lessThanNormal ? lessThanNormal : '-' }} </span>
            </el-col>
            <el-col
                :span="8"
                class="detail-title"
            >
                <span class="span-label ml_141">{{ lessThanNormalDuration ? lessThanNormalDuration + 'min' : '-' }}</span>
            </el-col>
            <el-col :span="8">
                <span />
            </el-col>
        </el-row>
        <el-row :gutter="30">
            <el-col
                :span="8"
                class="detail-title"
            >
                <span class="span-label ml_141">{{ normalTime ? normalTime : '-' }}</span>
            </el-col>
            <el-col
                :span="8"
                class="detail-title"
            >
                <span class="span-label ml_141">{{ normalduration ? normalduration + 'min' : '-' }}</span>
            </el-col>
            <el-col :span="8">
                <span />
            </el-col>
        </el-row>
        <el-row :gutter="30">
            <el-col
                :span="8"
                class="detail-title"
            >
                <span class="span-label ml_141">{{ moreThanNormal ? moreThanNormal : '-' }}</span>
            </el-col>
            <el-col
                :span="8"
                class="detail-title"
            >
                <span class="span-label ml_141">{{ moreThanNormalDuration ? moreThanNormalDuration + 'min' : '-' }}</span>
            </el-col>
            <el-col :span="8">
                <span />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Public from './public'
export default {
    props:{
        normalTime: {
            type:String,
            required:true
        }, //轴倍率时间=标准
        lessThanNormal: {
            type:String,
            required:true
        }, //轴倍率时间<标准
        moreThanNormal: {
            type:String,
            required:true
        }, //轴倍率时间>标准
        lessThanNormalDuration:{
            type:Number,
            required:true
        },//持续时间<标准
        normalduration:{
            type:Number,
            required:true
        },//持续时间=标准
        moreThanNormalDuration:{
            type:Number,
            required:true
        },//持续时间>标准
    },
    data () {
        return {
            input: '',
            // 上限值
            cap: null,
            // 下限值
            offline: null
        }
    },
    methods: {
        renderMarkLine () {
            if (this.cap && this.offline) {
                Public.$emit('getupperLimitValue', (this.cap))
                Public.$emit('getlowerLimitValue', (this.offline))
                console.log(this.cap)
                console.log(this.offline)
                // this.$service('GET', '/SERVICE-BUSINESS/api/monitor/productionData', params)
                this.$emit('renderMarkLine', this.cap, this.offline)
            } else {
                this.$message.warning('请输入上限或下限值')
            }
        },
        inputValChange (val) {
        },
        valueChange (a) {
        },
        offlineBlur () {
            let rgb = /^(100|[1-9]\d|\d)(.\d{1,2})?%$/
            let rule = new RegExp(rgb)
            if (!rule.test(this.offline)) {
                console.log(rule.test(this.offline))
                this.$message.warning('只可以输入百分制的数')
                this.offline = ''
            }
        },
        capBlur () {
            console.log(this.cap)
            let rgb = /^(100|[1-9]\d|\d)(.\d{1,2})?%$/
            let rule = new RegExp(rgb)
            if (!rule.test(this.cap)) {
                console.log(rule.test(this.cap))
                this.$message.warning('只可以输入百分制的数')
                this.cap = ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .Collar {
        overflow: hidden;
        padding-top: 10px;
        .shaft_multiplier, .keep_time{
            padding-top: 5px;
            // width: 332px;
            height: 30px;
            line-height: 30px;
            background-color: #f6f8fe;
            border-radius: 6px;
            // margin-bottom: 10px;
        }
        .collar_input {
            width: 212px;
            height: 38px;
            line-height: 38px;
            margin-right: 100px;
        }
        .down_collar_input {
            width: 212px;
            height: 38px;
            line-height: 38px;
            margin-right: 100px;
        }
        .confirm_btn {
            // text-align: center;
            // width: 70px;
            // height: 32px;
        }
        .fon_18 {
            font-size: 14px;
            // font-weight: 700;
            margin-left: 124px;
        }
        .ml_141 {
            margin-left: 141px;
            font-size: 16px;
            padding-top: 10px;
        }
        .mb_20 {
            margin-bottom: 15px;
        }
        .ml_50 {
            margin-left: 50px;
        }
        .mr_20 {
            margin-right: 20px;
        }
        .el-row {
            margin-bottom: 10px;
            &:last-child {
            margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .dis_inline_block {
            display: inline-block;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
    }
</style>