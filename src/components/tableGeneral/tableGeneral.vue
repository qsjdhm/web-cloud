<template>
    <div
        ref="materialRecord"
        class="general-list-page materialRecord"
        :class="{'margin-r': otherProps.marginRight}"
    >
        <div class="genre-pack clear-float flex-col">
            <div class="title-pack clear-float pl-15 pr-15">
                <div class="float-left">
                    <span class="page-title-text">{{ otherProps.title }}</span>
                </div>
                <div class="float-right page-refresh">
                    <span
                        class="pointer"
                        @click="refreshClick"
                    >
                        <svg-icon
                            ref="refresh"
                            class="refresh"
                            icon-class="refresh"
                        />
                        <span class="ml-10">刷新</span>
                    </span>
                </div>
            </div>
            <div class="genre-pack-header tool-pack clear-float pl-15 pr-15">
                <div class="float-left">
                    <slot name="headOperate" />
                </div>
                <div class="float-right">
                    <el-select
                        v-for="(item, index) in otherProps.selectInfo"
                        :key="index"
                        v-model="selectParams[item.value]"
                        style="margin-left: 5px;width:150px"
                        size="small"
                        clearable
                        :placeholder="getPlaceholder(item.value)"
                        @change="getTableList()"
                    >
                        <el-option
                            v-for="(childItem, childIndex) in item.options"
                            :key="childIndex"
                            :label="childItem.label"
                            :value="childItem.value"
                        />
                    </el-select>
                    <el-input
                        v-model="searchValue"
                        clearable
                        style="width: 160px;"
                        size="small"
                        placeholder="请输入编码或名称"
                        @input="getTableList()"
                    />
                    <el-button
                        size="small"
                        icon="el-icon-search"
                        @click="searchClick"
                    >搜索</el-button>
                    <el-button
                        size="small"
                        @click="resetClick"
                    >重置</el-button>
                </div>
            </div>
            <div
                ref="tableBox"
                class="general-list-main-pack pl-15 pr-15 flex-1 flex-col"
                :class="{multipleClass: otherProps.multiple}"
            >
                <el-table
                    ref="multipleTable"
                    v-loading="tableLoading"
                    row-key="id"
                    class="table-general"
                    element-loading-text="请稍等..."
                    :data="tableList"
                    height="380"
                    stripe
                    border
                    tooltip-effect="dark"
                    highlight-current-row
                    style="width: 100%"
                    empty-text="暂无数据..."
                    @selection-change="tableSelectionChange"
                >
                    <el-table-column
                        v-if="otherProps.showSelect"
                        reserve-selection
                        class="selectClass"
                        align="center"
                        type="selection"
                    />
                    <!-- 循环遍历 start -->
                    <el-table-column
                        v-for="item in propsList"
                        :key="item.prop"
                        :sortable="item.sortable"
                        :width="item.width"
                        :align="item.align"
                        :prop="item.prop"
                        :label="item.label"
                    >
                        <template slot-scope="scope">
                            <slot
                                v-if="item.showSlot"
                                :name="item.prop"
                                :scope="scope"
                            >友情提示!</slot>
                            <el-tag
                                v-else-if="item.prop === 'status' && item.showType === 'status'"
                                :type="scope.row.status === '1' ?'success' :'info'"
                            >{{ scope.row.status === '1' ?
                                '正常' : '停用' }}
                            </el-tag>
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>
                    <!-- 循环遍历  end-->
                </el-table>
                <!-- layout="prev, pager, next, sizes, jumper" -->
                <div ref="pagination">
                    <el-pagination
                        background
                        :total="total"
                        style="text-align: center; margin-top: 12px;margin-bottom: 12px"
                        :page-sizes="[50, 100, 200, 500]"
                        layout="total, sizes, prev, pager, next"
                        :current-page.sync="currentPage"
                        :page-size.sync="pageSize"
                        @size-change="onSizeChange"
                        @current-change="onCurrentChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /*
    *  该逐渐不在进行维护，停止使用该组件,请转pageTable
    *  */
    export default {
        name: 'TableGeneral',
        props: {
            propsList: {
                type: Array,
                default: () => [
                    {
                        prop: 'name',
                        label: '分类名字',
                        showSlot: true, // 是否进行通过slot进行定制, true: 进行通过slot,这里具名插槽的名字为传递prop的名字;默认传否
                        width: 80,     // 宽度
                        showType: 'status'
                    }
                ]
            },
            otherProps: {
                type: Object,
                default: () => {
                    return {
                        multiple: false,
                        version: 'v1',      // 兼容新的请求方法
                        api: '',          // 表格进行请求的接口
                        params: {},                                     // 接口请求的参数
                        method: '',
                        title: '物料档案',                              // 表格顶部标题名字
                        showSelect: false,                           // 是否显示表格选择框
                        marginRight: false,                           // 是否有左边距
                        selectInfo: [           // 选者框
                            {
                                value: 'status',
                                options: [
                                    {label: '正常', value: '1'},
                                    {label: '停用', value: '0'}
                                ]
                            }
                        ]
                    }
                }
            }
        },
        data () {
            return {
                selectParams: (() => {
                    let params = {}
                    if (!this.otherProps.selectInfo) return false
                    this.otherProps.selectInfo.map((v) => {
                        params[v.value] = v.default ? v.default : ''
                    })
                    return params
                })(),
                chosenTableList: [], // 选中数据
                currentData: '',
                searchValue: '',
                tableList: [],
                tableHeight: 0,
                tableLoading: false,  // 表格loading状态
                total: 0,
                currentPage: 1, // 当前列表页
                pageSize: 50// 当前列表数量
            }
        },
        watch: {
            /* todo 坑货 */
            '$route': 'routerChange',
            'otherProps.params.categoryId': {
                handler: function (newValue) {
                    let writeList = []
                    if (this.otherProps.selectInfo) {
                        this.otherProps.selectInfo.map((item) => {
                            if (item.default) writeList.push(item.value)
                        })
                    }
                    this.$clearObject(this.selectParams, writeList)
                    this.searchValue = ''
                },
                deep: true,
                immediate: true
            },
            'otherProps.selectInfo': {
                handler (val) {
                },
                deep: true,
                immediate: true
            }
        },
        created () {
        },
        mounted () {
            // 获取表格数据
            // this.getTableList()
            // 计算具体值,便于其他组件引用
            this.setHeight()
        },
        methods: {
            // 显示placeholder,对应table props名称
            getPlaceholder (val) {
                let placeholder
                this.propsList.map((v) => {
                    if (v.prop === val) {
                        placeholder = v.label
                    }
                    return false
                })
                placeholder = '请选择' + placeholder
                return placeholder
            },
            async getTableList () {
                this.tableLoading = true
                let params = {
                    search: this.searchValue,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    ...this.otherProps.params,
                    ...this.selectParams
                }
                let res
                if (this.otherProps.version === 'v1') {
                    res = await this.$service(this.otherProps.method, this.otherProps.api, params)
                } else {
                    res = await this.$service(this.otherProps.method, this.otherProps.api, params)
                }
                // if (this.otherProps.version === 'v1') {
                //     res = await this.$fetch(this.otherProps.api, params)
                // } else {
                //     res = await this.$store.dispatch(this.otherProps.api, params)
                // }

                if (res.list.length === 0 && res.pageNum !== 1) {
                    this.currentPage -= 1
                    this.getTableList()
                    // 通过当前id获取子节点数据
                } else {
                    this.tableList = _.cloneDeep(res.list)
                    this.total = _.cloneDeep(res.total)
                    this.tableLoading = false
                }
            },
            // 当前分页页数发生了变化
            onCurrentChange () {
                this.getTableList()
            },
            // 当前分页数量发生了变化
            onSizeChange () {
                this.currentPage = 1
                // 通过当前id获取子节点数据
                this.getTableList()
            },
            // 多选值发生了改变
            // 一直保留的右侧table选中的记录
            // 通过树形结构进行存储选中内容
            tableSelectionChange (rows) {
                if (this.otherProps.multiple) {
                    this.$emit('tableSelectChange', rows)
                } else {
                    // 两种方式实现单选
                    // this.$refs.multipleTable.toggleRowSelection(rows[0], false)
                    if (rows.length > 1 && this.otherProps.showSelect) {
                        // this.$refs.multipleTable.clearSelection()
                        // this.$refs.multipleTable.toggleRowSelection(rows[1])
                        this.$refs.multipleTable.toggleRowSelection(rows[0], false)
                        rows.splice(0, 1)
                    }
                    this.$emit('tableSelectChange', rows)
                }
            },
            clearSelection () {
                this.$refs.multipleTable.clearSelection()
                this.tableList = []
            },
            // 点击了视图查看按钮
            viewClick (id) {
                this.dialogShow = true
            },
            // 点击了编辑按钮
            editClick (id) {
                this.dialogShow = true
            },
            // 页面刷新功能
            refreshClick () {
                let deg = this.$refs.refresh.$el.style.transform.match(/\d+/)
                    ? this.$refs.refresh.$el.style.transform.match(/\d+/)[0]
                    : 0
                this.$refs.refresh.$el.style.transform = `rotate(${Number(deg) + 1}turn)`
                this.getTableList()
            },
            // 监控路由变化
            routerChange () {
                this.getTableList()
            },
            searchClick () {
                this.getTableList()
            },
            resetClick () {
                this.searchValue = ''
                this.$clearObject(this.selectParams)
                this.getTableList()
            },
            async setHeight () {
                await this.$sleep(0)
                let tableBoxH = this.$refs.tableBox.offsetHeight
                let paginationH = this.$refs.pagination.offsetHeight
                this.tableHeight = tableBoxH - paginationH
            }
        }
    }
</script>

<style lang="scss" scoped>
    .general-list-main-pack {
        /deep/ .el-table__header-wrapper {
            .has-gutter > tr:first-child > th:first-child > div > .el-checkbox {
                display: none;
            }
        }
        // 分页样式重置
        /deep/.el-pagination {
            .el-pager li {
                border-radius: 6px !important;
            }
            button {
                border-radius: 6px !important;
            }
            .el-pagination__sizes {

                .el-select {
                    .el-input {

                        .el-input__inner {

                            border: none ;
                            border-radius: 6px;
                            color: #606266;
                            background: #f4f4f5;
                            padding-right: 5px;
                        }
                        .el-input__suffix {
                            display: none;
                        }
                    }
                }
            }
        }
        // 滚动条的宽度
        /deep/ .el-table__body-wrapper::-webkit-scrollbar {
            width: 6px; // 横向滚动条
            height: 6px; // 纵向滚动条 必写
        }
        // 滚动条的滑块
        /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
            background-color: #ddd;
            border-radius: 3px;
        }
    }
    .multipleClass {
        /deep/ .el-table__header-wrapper {
            .has-gutter > tr:first-child > th:first-child > div > .el-checkbox {
                display: block!important;
            }
        }
    }

    .refresh {
        transition: all 1s;
    }

    .margin-r {
        margin-left: 310px;
    }

    .general-list-page {
        position: relative;
        height: 100%;
        /* todo /deep/ 导致页面卡主 */
        /*/deep/ thead{
            display: none;
        }*/
        .next-genre-pack {
            margin-left: 310px;
            height: 100%;
            border: 1px solid #d2d3d5;
            background-color: #fff;
        }

        .genre-pack {
            height: 100%;
            border: 1px solid #d2d3d5;
            background-color: #fff;
            border-radius: $borderRadius;

            .title-pack {
                height: 38px;
                line-height: 38px;
                border-bottom: 1px solid #d2d3d5;
            }

            .tool-pack {
                padding-top: 16px;
                padding-bottom: 16px;

                .tool-tag {
                    height: 32px;
                    line-height: 32px;
                    font-size: 14px;
                }
            }

            /* 状态提示背景色 start */
            .status-green {
                background-color: $btnGreenDarken;
            }

            .status-yellow {
                background-color: $btnYellowDarken;
            }

            /* 状态提醒背景色 end */
            /* 编辑按钮 */
            .edit-button {
                color: $btnBlueDarken;
            }

            /* 启动 */
            .open-button {
                color: $btnGreenDarken;
            }

            /* 停用 */
            .close-button {
                color: $btnYellowDarken;
            }

            .status-circle {
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 6px;
                margin-right: 5px;
                vertical-align: middle;
            }

            .delete-button {
                color: #F47476;
            }

            .view-span {
                color: #1284fa;
                border-bottom: 1px solid #1284fa;

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
</style>
