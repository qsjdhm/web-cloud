<template>
    <div class="card-pack">
        <!-- <div class="card-title-pack clear-float pl-15 pr-15">
            <div class="float-left">
                <span class="card-title-text">{{ otherProps.title }}</span>
            </div>
        </div> -->
        <div class="card-tool-pack clear-float pl-15 pr-15">
            <div class="float-left">
                <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addParameterClick"
                >新增</el-button>
            </div>
        </div>
        <div class="card-content-pack">
            <el-table
                stripe
                border
                style="width: 100%"
                empty-text="暂无数据"
                :data="tableList"
            >
                <el-table-column
                    v-for="item in propsList"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    align="center"
                >
                    <template slot-scope="scope">
                        <slot
                            v-if="item.showSlot"
                            :name="item.prop"
                            :scope="scope"
                        >友情提示!</slot>
                        <div
                            v-else-if="item.type !== 'view'"
                            class="input-box"
                        >
                            <!-- <span class="required-remark">*</span> -->
                            <el-input
                                v-model="scope.row[item.prop]"
                                :placeholder="item.placeholder"
                                size="small"
                                :maxlength="$global.string"
                            />
                        </div>
                        <!-- 当现实是查看是否 -->
                        <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
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
*  表格进行新增处理表格不在维护请留意
* */
// import CommonTitle from '../../view/basicConfig/CommonTtile'
export default {
    name: 'NewTableCard',
    props: {
        // props属性列表
        propsList: {
            type: Array,
            default: () => [
                {
                    prop: '',
                    label: '',
                    type: '',  // add: '' edit:编辑; view: 查看
                    showSlot: false //  是否显示插槽
                }
            ]
        },
        // 表格数据显示
        tableList: {  // 用于table数据
            type: Array,
            default: () => []
        },
        otherProps: {
            type: Object,
            default: () => {
                return {
                    title: '包装规格'
                }
            }
        }
    },
    data () {
        return {}
    },
    mounted () {
        if (this.$route.query.type === 'add') {
            this.addParameterClick()
        }
    },
    methods: {
        // 添加参数信息点击事件,将propsList传递过来数据进行遍历赋值
        addParameterClick () {
            let addObj = {}
            this.propsList.map(v => {
                addObj[v.prop] = ''
            })
            this.tableList.unshift(addObj)
        },
        // 删除某一项参数点击事件
        deleteParameterClick (index) {
            this.tableList.splice(index, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
    .card-pack {
        margin-bottom: 15px;

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
            height: 38px;
            line-height: 38px;
            border: 1px solid #d2d3d5;
            background: #f6f6f6;

            .card-title-text {
                font-size: 14px;
                font-weight: bold;
            }
        }

        .card-tool-pack {
            padding: 15px 15px 0 15px;
            border-left: 1px solid #d2d3d5;
            border-right: 1px solid #d2d3d5;
        }

        .card-content-pack {
            @include rdc-box-sizing;
            padding: 15px;
            width: 100%;
            height: 100%;
            border-left: 1px solid #d2d3d5;
            border-right: 1px solid #d2d3d5;
            border-bottom: 1px solid #d2d3d5;


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

