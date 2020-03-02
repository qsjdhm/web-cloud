<template>
    <div class="card-pack">
        <!-- <div class="card-title-pack clear-float">
            <div class="float-left">
                <span class="card-title-text">{{ tableInfo.title }}</span>
            </div>
        </div> -->
        <!-- <div class="common-title-pack">
            <div class="guide-pack">
                <div class="line" />
                <div class="text-pack">{{ tableInfo.title }}</div>
            </div>
        </div> -->
        <common-title
            :options="{text: tableInfo.title, MLPx: 10}"
        />
        <div
            v-if="tableInfo.tableStatus !== 'view'"
            class="card-tool-pack clear-float pl-10 pr-10"
        >
            <div style="margin-bottom:10px;float:right;margin-top:-35px">
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="addParameterClick"
                >新增</el-button>
            </div>
        </div>
        <div class="card-content-pack">
            <el-table
                stripe
                border
                style="width: 100%"
                empty-text="暂无数据显示"
                :data="tableList"
            >
                <el-table-column
                    v-for="item in tableInfo.propsList"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    align="center"
                >
                    <template slot-scope="scope">
                        <slot
                            v-if="item.slot"
                            :name="item.prop"
                            :scope="scope"
                        >友情提示!</slot>
                        <div
                            v-else-if="tableInfo.tableStatus !== 'view'"
                            class="input-box"
                        >
                            <!-- <span class="required-remark">*</span> -->
                            <el-input
                                v-model.trim="scope.row[item.prop]"
                                :disabled="tableInfo.tableStatus === 'view'"
                                :placeholder="item.placeholder"
                                size="mini"
                                :maxlength="$global.string"
                            />
                        </div>
                        <!-- 当现实是查看是否 -->
                        <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableInfo.tableStatus !== 'view'"
                    label="操作"
                    width="60"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            class="delete-button"
                            @click="deleteParameterClick(scope.$index)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
/*
*  该组件正在使用
* */
import CommonTitle from '@/components/CommonsTitle/index'
export default {
    name: 'TableAdd',
    components: {
        CommonTitle
    },
    props: {
        // props属性列表
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    propsList: {
                        prop: 'name',
                        label: '分类名字',
                        slot: true,         // 默认不传,用户显示插槽
                        width: 80           // 宽度
                    },
                    tableAddType: 'input',  // 表格添加方式,默认通过输入框进行添加.通过的
                    title: '标题',
                    tableData: '',
                    tableStatus: 'add',    // 当前处于状态 add ,edit ,view
                    showSelect: false      // 是否显示table选者框
                }
            }
        }
    },
    data () {
        return {
            tableList: []
        }
    },
    watch: {
        'tableInfo.tableData': {
            handler (val) {
                this.tableList = val
            },
            deep: true
        }
    },
    mounted () {
    },
    methods: {
        // 添加参数信息点击事件,将propsList传递过来数据进行遍历赋值
        addParameterClick () {
            let addObj = {}
            this.tableInfo.propsList.map(v => {
                addObj[v.prop] = ''
            })
            this.tableList.unshift(addObj)
        },
        // 删除某一项参数点击事件
        deleteParameterClick (index) {
            this.tableList.splice(index, 1)
        },
        clearData () {
            // console.log('%c ' + 'sb', 'color: red')
            this.$set(this, 'tableList', [])
            this.$set(this.tableInfo, 'tableData', [])
        }
    }
}
</script>

<style lang="scss" scoped>
    .card-pack {
        // margin-bottom: 10px;

        .input-box {
            display: -webkit-flex;
            display: flex;
            align-items: center;
        }

        .required-remark {
            color: #f56c6c;
            margin-right: 10px;
        }

        .card-title-pack {
            height: 32px;
            line-height: 32px;
            // border: 1px solid #d2d3d5;
            // background: #f6f6f6;

            .card-title-text {
                font-size: 14px;
                font-weight: bold;
            }
        }

        .card-tool-pack {
            padding: 10px 10px 0 10px;
        }

        .card-content-pack {
            box-sizing: border-box;
            // padding: 10px;
            width: 100%;
            height: 100%;
            // border-left: 1px solid #d2d3d5;
            // border-right: 1px solid #d2d3d5;
            // border-bottom: 1px solid #d2d3d5;


            .img-dialog {

                .el-dialog {

                    .el-dialog__header {

                        .el-dialog__headerbtn {
                            top: 4px !important;
                        }
                    }
                }
            }
        }
    }
</style>

