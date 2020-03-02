<template>
    <div class="search-content">
        <el-row
            :gutter="20"
            :class="[media.type ==='xl' ? 'col-4-8-parent' : '']"
        >
            <template
                v-for="(item, index) in tmpSearchConfig.fields"
            >
                <transition
                    :key="item.key"
                    name="el-fade-in"
                >
                    <el-col
                        v-if="isShow(index)"
                        :key="index"
                        :xl="{span: '4-8'}"
                        :lg="{span: '6'}"
                        :md="{span: '6'}"
                        :sm="{span: '6'}"
                        :xs="{span: '6'}"
                    >
                        <div class="factor">
                            <span
                                v-if="item.label"
                                class="search-span"
                            >{{ item.label }}</span>
                            <!-- 输入框 -->
                            <el-input
                                v-if="item.type === 'INPUT'"
                                v-model="item.value"
                                clearable
                                size="mini"
                                :placeholder="item.placeholder || '请输入'"
                                maxlength="50"
                                @keyup.enter.native="searchClick"
                            />
                            <!-- 下拉选择器 -->
                            <el-select
                                v-if="item.type === 'SELECT'"
                                v-model="item.value"
                                :placeholder="item.placeholder || '请选择'"
                                clearable
                                size="mini"
                                style="width: 100%;"
                            >
                                <el-option
                                    v-for="val in item.options"
                                    :key="val.id"
                                    :label="val.label"
                                    :value="val.value"
                                />
                            </el-select>
                            <!-- 日期选择 -->
                            <el-date-picker
                                v-if="item.type === 'DATE'"
                                v-model="item.value"
                                size="mini"
                                type="date"
                                :placeholder="item.placeholder || '请选择日期'"
                                style="width: 100%"
                            />
                            <!-- 日期,时间选择 -->
                            <el-date-picker
                                v-if="item.type === 'DATETIME'"
                                v-model="item.value"
                                size="mini"
                                type="datetime"
                                :placeholder="item.placeholder || '请选择日期'"
                                style="width: 100%"
                            />
                            <!-- 日期范围 -->
                            <el-date-picker
                                v-if="item.type === 'DATERANGE'"
                                v-model="item.value"
                                size="mini"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width: 100%"
                            />
                        </div>
                    </el-col>
                </transition>
            </template>
            <!--:xl="{span: media.type === 'xl' ? '4-8' : '6'}"-->
            <el-col
                v-if="showtest"
                :offset="operateOffset"
                :xl="{span: '4-8'}"
                :lg="{span: '6'}"
                :md="{span: '6'}"
                :sm="{span: '6'}"
                :xs="{span: '6'}"
            >
                <div class="factor operate">
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-search"
                            @click="searchClick()"
                        >搜 索
                        </el-button>
                        <el-button
                            size="mini"
                            class="bt-class"
                            icon="el-icon-refresh"
                            @click="resetClick"
                        >重 置
                        </el-button>
                    </div>
                    <!-- 先休息一下吧 -->
                    <!--<el-button
                        v-if="searchConfig.fields.length > showNum"
                        style="margin-left: 15px; font-size: 12px;"
                        type="text"
                        @click="expansion(iconName)"
                    >{{ iconName === 'open' ? '展开' : '收起' }}
                        <i :class="iconName === 'open' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"/>
                    </el-button>-->
                </div>
            </el-col>
        </el-row>
        <div
            v-if="searchConfig.fields.length >= 5"
            :class="['semicircle', iconName === 'close'? 'down': '']"
            @click="expansion(iconName)"
        >
            <span class="el-icon-arrow-up" />
        </div>
    </div>
</template>
<script>

// import Methods from '@vt/VtSearch/searchMehods'
/**
 * @author MARS  <wangyunfan@vtstar.net>
 * @description 搜索条件封装
 */
export default {
    name: 'VtSearch',
    inheritAttrs: false,
    props: {
        searchConfig: {
            type: Object,
            default: () => {
            }
        },
    },
    data() {
        const defaultShowNum = 5
        const showNum = this.searchConfig.showNum || defaultShowNum
        return {
            showtest: true,
            media: {},
            showNum: 5,  // 显示个数
            tepShowNum: showNum,
            iconName: 'close',
            tmpSearchConfig: {},       // 由于父级传递过来，不能直接修改，需要临时缓存，用于重置按钮的时候使用
            // 点击重置按钮，进行设置的值
            defaultSearchConfig: {
                fields: [],
                ..._.cloneDeep(this.searchConfig)
            },
            searchParams: {},   // 转化成传递参数
            operateOffset: 6  // 默认偏移量
        }
    },
    computed: {
        // media(val) {
        //     this.demo(val)
        //     return
        // }
    },
    watch: {
        searchConfig: {
            handler(val) {
                this.tmpSearchConfig = val
            },
            deep: true,
            immediate: true
        },
        '$store.getters.media': {
            handler(val) {
                this.media = val
                this.demo()
                // console.log(this.operateOffset)
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        // 默认组件加载的时候，就触发搜索
        if (this.searchConfig.initTrigger) {
            this.searchClick()
        }
    },
    methods: {
        isShow(index) {
            if (this.iconName === 'close') {
                return index < (this.media.type === 'xl' ? 4 : 3);
            } else {
                return true
            }
        },
        /**
         * @method 搜索
         * @type searchBtn: 点击搜索按钮触发； searchCache: 缓存事件触发
         */
        searchClick(type = 'searchBtn') {
            this.searchParams = this.getSearchParams(this.tmpSearchConfig)
            this.$emit('searchClick', this.searchParams, type)
        },
        // ...Methods,
        /**
         * @method 判断按钮展开收起
         * @param {String} val 展开收起标识符
         */
        expansion(val) {
            this.showtest = false
            if (val === 'open') {
                this.iconName = 'close'
                // this.tepShowNum = 10
            } else {
                this.iconName = 'open'
                // this.tepShowNum = this.showNum
            }
            this.demo()
        },
        demo() {
            let colAllowNum = 4    // 当前e-col容纳多少
            if (this.media.type === 'xl') {
                colAllowNum = 5
            } else {
                colAllowNum = 4
            }
            // console.log(colAllowNum)
            // 偏移个数: 小于4当前容纳总个数 - 当前行的个数
            // 偏移个数: 如果大于等于 4情况，进行取余数处理
            let colLength = this.tmpSearchConfig.fields.length
            // 当前处于关闭状态
            if (this.iconName === 'close') {
                colLength = colLength - (this.media.type === 'xl' ? 2 : 3)
            }
            if (colLength < colAllowNum) {
                // ▄█▀█● 由于element-UI没有提供一行五列情况，这里需要特殊处理向下取证，底部有css进行处理el-col-offset-9
                this.operateOffset = Math.floor((colAllowNum - colLength - 1) * (24 / colAllowNum))
            } else if (colLength >= colAllowNum) {
                this.operateOffset = Math.floor((colAllowNum - colLength % colAllowNum - 1) * (24 / colAllowNum))
            }
            // this.$nextTick(() => {
            //     this.showtest = true
            // })
            setTimeout(() => {
                this.showtest = true
            },300)
        },
        /**
         * @method 重置
         */
        resetClick() {
            this.tmpSearchConfig = _.cloneDeep(this.defaultSearchConfig)
            this.searchParams = this.getSearchParams(this.tmpSearchConfig)
            this.$emit('reset', this.searchParams)
        },
        /**
         * @description 对searchConfig>fields数组中的key,value。放入一个对象中 {key:value}
         * @param data
         * @returns {{ key1: value1,key2:value2 }}
         */
        getSearchParams(data) {
            let target = {}
            data.fields.map(item => {
                // 对特殊字段，如开始时间和结束时间，需要分割字段
                if (item.splitField) {
                    target[item.splitField[0]] = (item.value && this.$moment(item.value[0]).format('YYYY-MM-DD HH:mm:ss')) || null
                    target[item.splitField[1]] = (item.value && this.$moment(item.value[1]).format('YYYY-MM-DD HH:mm:ss')) || null
                } else {
                    // 正常情况，默认设置null
                    target[item.key] = item.value || null
                }
            })
            return target
        }
    }
}
</script>
<style lang="scss">
@media only screen and (min-width: 768px) {
    .el-col-sm-4-8 {
        width: 20%
    }

    .el-col-sm-offset-4-8 {
        margin-left: 20%
    }

    .el-col-sm-pull-4-8 {
        position: relative;
        right: 20%
    }

    .el-col-sm-push-4-8 {
        position: relative;
        left: 20%
    }
}

@media only screen and (min-width: 992px) {
    .el-col-md-4-8 {
        width: 20%
    }

    .el-col-md-offset-4-8 {
        margin-left: 20%
    }

    .el-col-md-pull-4-8 {
        position: relative;
        right: 20%
    }

    .el-col-md-push-4-8 {
        position: relative;
        left: 20%
    }

}

@media only screen and (min-width: 1200px) {

    .el-col-lg-4-8 {
        width: 20%
    }

    .el-col-lg-offset-4-8 {
        margin-left: 20%
    }

    .el-col-lg-pull-4-8 {
        position: relative;
        right: 20%
    }

    .el-col-lg-push-4-8 {
        position: relative;
        left: 20%
    }

}

@media only screen and (min-width: 1920px) {
    .el-col-xl-4-8 {
        width: 20%
    }

    .el-col-xl-offset-4-8 {
        margin-left: 20%
    }

    .el-col-xl-pull-4-8 {
        position: relative;
        right: 20%
    }

    .el-col-xl-push-4-8 {
        position: relative;
        left: 20%
    }

}
</style>
<style lang="scss" scoped>
// 每个元素高度
$height: 43px;
/* =================被坑的不要不要 start================== */
/* 这里针对 el-row 一行五个的特殊处理，element-UI不支持，小哥哥只能自己搞 */
.col-4-8-parent {
    .el-col-offset-14 {
        margin-left: 60%;
    }

    .el-col-offset-9 {
        margin-left: 40%;
    }

    .el-col-offset-4 {
        margin-left: 20%;
    }
}

/* ================= 被坑的不要不要  end ================= */
/* 被坑的不要不要的，end */
.search-content {
    background: #fff;
    padding: 5px 10px 3px 10px;
    text-align: right;
    position: relative;

    &:hover .semicircle {
        display: block;
    }

    .semicircle {
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 32px;
        height: 16px;
        text-align: center;
        color: #999999;
        background-color: #ffffff;
        box-shadow: 0px -3px 8px 0px rgba(29, 58, 102, 0.08);
        /*border:1px solid black;*/
        border: 1px solid #e8e8e8;
        border-radius: 100px 100px 0 0;

        &:hover {
            border: 1px solid #409eff;
            color: #409eff;
        }
    }

    .down {
        bottom: -16px;
        border-radius: 0 0 100px 100px;

        & > span {
            position: absolute;
            left: -1px;
            right: 0;
            top: -3px;
            margin: auto;
            transform: rotate(180deg);
        }
    }

    .operate {
        display: flex;
        justify-content: flex-end;
        /*justify-content: space-between;*/
        min-width: 235px;
        text-align: right;

        & > div {
            margin-bottom: 3px;
            height: $height;
            line-height: $height;
        }
    }

    .factor {
        display: -webkit-flex;
        display: flex;
        align-items: center;
        height: $height;
        line-height: $height;
        margin-right: 5px;

        .search-span {
            display: inline-block;
            justify-self: end;
            width: 120px;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            text-align: left;
        }
    }

    .bt-class {
        border: 1px solid #66B1ff;
        color: #3792ff;
    }
}
</style>
