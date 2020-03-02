<template>
    <div
        ref="materialRecord"
        class="general-list-page materialRecord"
        :class="{'margin-r': tableInfo.marginRight}"
    >
        <div class="genre-pack clear-float flex-col">
            <div
                v-if="showHeader"
                class="title-pack clear-float pl-15 pr-15"
            >
                <div class="float-left">
                    <span class="page-title-text">{{ tableInfo.title }}</span>
                </div>
                <div class="float-right page-refresh">
                    <span
                        class="pointer"
                        @click="refreshClick"
                    >
                        <svg-icon icon-class="refresh" />
                        <span class="ml-10">刷新</span>
                    </span>
                </div>
            </div>
            <div class="genre-pack-header tool-pack clear-float pl-15 pr-15">
                <div class="float-left">
                    <slot name="headOperate" />
                </div>
                <div class="float-right">
                    <!-- 筛选框 -->
                    <el-select
                        v-for="(item,index) in tableInfo.selectInfo"
                        :key="item.value"
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
                    <!-- 输入框 -->
                    <el-input
                        v-model="searchValue"
                        clearable
                        style="width: 160px;"
                        size="small"
                        placeholder="请输入搜索关键字"
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
            >
                <el-table
                    ref="multipleTable"
                    v-loading="tableLoading"
                    row-key="id"
                    class="table-general"
                    element-loading-text="请稍等..."
                    :data="tableList"
                    :height="tableHeight"
                    stripe
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    empty-text="暂无数据..."
                    @selection-change="tableSelectionChange"
                >
                    <el-table-column
                        v-if="tableInfo.showSelect"
                        align="center"
                        type="selection"
                    />
                    <el-table-column
                        align="center"
                        type="index"
                        :index="(index) => index + 1"
                    />
                    <!-- 循环遍历 start -->
                    <el-table-column
                        v-for="item in tableInfo.propsList"
                        :key="item.prop"
                        :sortable="item.sortable"
                        :show-overflow-tooltip="item.prop !=='operate'"
                        :width="item.width"
                        align="center"
                        :prop="item.prop"
                        :label="item.label"
                    >
                        <template slot-scope="scope">
                            <!-- 1. 展示slot 插槽 -->
                            <slot
                                v-if="item.slot"
                                :name="item.prop"
                                :scope="scope"
                            >友情提示!</slot>
                            <!-- 2.类型是时间 -->
                            <span v-else-if="item.type && item.type === 'time'">
                                {{ item.prop?$moment(scope.row[item.prop]).format('YYYY-MM-DD HH:mm:ss'): '暂无' }}
                            </span>
                            <!-- 3. 类型是状态进行处理 -->
                            <el-tag
                                v-else-if="item.type && item.type === 'status'"
                                :type="scope.row[item.prop] === '1' ?'success' :'info'"
                            >
                                {{ scope.row[item.prop] === '1' ? '正常' : '停用' }}
                            </el-tag>
                            <!-- 4. 类型是状态进行处理 -->
                            <el-switch
                                v-else-if="item.type && item.type === 'handleStatus'"
                                v-model="scope.row[item.prop]"
                                :disabled="!$has($route,'disable')"
                                active-color="#409eff"
                                inactive-color="#dcdfe6"
                                active-value="1"
                                inactive-value="0"
                                @change="enableClick(scope.row,item.api || '')"
                            />
                            <!-- 默认展示的数据 -->
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div ref="pagination">
                    <el-pagination
                        background
                        :total="total"
                        style="text-align: center; margin-top: 12px;margin-bottom: 12px"
                        :page-sizes="[20, 50, 100, 200]"
                        layout="prev, pager, next, sizes, jumper"
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
export default {
    name: 'PageTableV1',
    props: {
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    propsList: [
                        {
                            prop: 'name',
                            label: '分类名字',
                            slot: true,         // 默认不传,用户显示插槽
                            width: 80,           // 宽度
                            type: 'handleStatus',
                            api: {
                                url: '',
                                param: ''
                            }
                        }
                    ],
                    selectInfo: [           // 选者框
                        {
                            value: 'status',
                            options: [
                                {label: '正常', value: '1'},
                                {label: '停用', value: '0'}
                            ]
                        }
                    ],
                    title: '标题',
                    showSelect: false,      // 是否显示table选者框
                    api: '',                // eg: '模块名/方法名'
                    params: {},             // 除了分页,一些特殊字段,
                    marginRight: false     // 默认false, 右侧流出tree树形结构边距,后续需要进行重构样式布局
                }
            }
        }

    },
    data () {
        return {
            /* todo 函数自动执行 */
            selectParams: (() => {
                let params = {}
                if (!this.tableInfo.selectInfo) return false
                this.tableInfo.selectInfo.map((v) => {
                    params[v.value] = ''
                })
                return params
            })(),
            chosenTableList: [],        // 选中数据
            currentData: '',
            searchValue: '',
            tableList: [],
            tableHeight: 0,
            tableLoading: false,        // 表格loading状态
            total: 0,
            currentPage: 1,             // 当前列表页
            pageSize: 20,                // 当前列表数量
            showHeader: true            // 是否展示头部
        }
    },
    watch: {
        /* 坑货 */
        '$route': 'routerChange'
    },
    async mounted () {
        await this.$sleep(0)
        // 获取表格数据
        // this.getTableList()
        // 查看element-ui table height:Table 的高度会受控于外部样式。
        // 计算具体值,便于其他组件引用
        let tableBoxH = this.$refs.tableBox.offsetHeight
        // 计算分页高
        let paginationH = this.$refs.pagination.offsetHeight
        this.tableHeight = tableBoxH - paginationH
    },
    methods: {
        async getTableList () {
            this.tableLoading = true
            let params = {
                search: this.searchValue,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...this.tableInfo.params,
                ...this.selectParams
            }
            this.$service(this.tableInfo.method, this.tableInfo.api, params).then((res) => {
                if (res.list.length === 0 && res.pageNum !== 1) {
                    this.currentPage -= 1
                    // 通过当前id获取子节点数据
                    this.getTableList()
                } else {
                    this.tableList = _.cloneDeep(res.list)
                    this.total = _.cloneDeep(res.total)
                    this.tableLoading = false
                }
            })
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
        tableSelectionChange (rows) {
            if (rows.length > 1 && this.tableInfo.showSelect) {
                this.$refs.multipleTable.clearSelection()
                this.$refs.multipleTable.toggleRowSelection(rows[1])
            }
            this.$emit('tableSelectChange', rows)
        },
        clearSelection () {
            this.$refs.multipleTable.clearSelection()
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
            // 将筛选框内容进行清空
            this.$clearObject(this.selectParams)
            this.searchValue = ''
            this.getTableList()
        },
        // 显示placeholder
        getPlaceholder (val) {
            let placeholder
            this.tableInfo.propsList.map((v) => {
                if (v.prop === val) {
                    placeholder = v.label
                }
                return false
            })
            placeholder = '请选择' + placeholder
            return placeholder
        },
        // 启用,停用事件
        enableClick (row, api) {
            let params = {
                [api.param]: row.id
            }
            this.$fetch(api.url, params).then((res) => {
                if (row.status === '1') {
                    this.$message.success('启用成功')
                } else {
                    this.$message.warning('停用成功')
                }
                this.$refs.generalTableDom.getTableList()
            })
        }
    }
}
</script>

<style lang="scss">
    .margin-r {
        margin-left: 310px;
    }

    .general-list-page {
        position: relative;
        height: 100%;

        .next-genre-pack {
            margin-left: 310px;
            height: 100%;
            border: 1px solid #d2d3d5;
            background-color: #fff;
        }

        .genre-pack {
            height: 100%;
            border: 1px solid #d2d3d5;
            border-radius: 5px;
            background-color: #fff;

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
