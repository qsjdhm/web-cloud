<template>
    <div
        ref="materialRecord"
        class="general-list-page materialRecord"
        :class="{'margin-r': tableInfo.marginRight}"
    >
        <div class="genre-pack clear-float flex-col">
            <!-- 搜索组件 -->
            <vt-search
                v-if="searchConfig.fields && searchConfig.fields.length > 0"
                style="margin-bottom: 5px"
                :search-config="searchConfig"
                @searchData="searchClick"
                @reset="resetClick"
            />
            <div class="genre-pack-header tool-pack clear-float">
                <div class="float-left">
                    <slot name="headOperate" />
                </div>
            </div>
            <div
                ref="tableBox"
                class="general-list-main-pack flex-1 flex-col"
            >
                <el-table
                    ref="multipleTable"
                    v-loading="tableLoading"
                    row-key="id"
                    class="table-general"
                    highlight-current-row
                    element-loading-text="请稍等..."
                    :data="tableList"
                    :height="tableHeight"
                    border
                    stripe
                    tooltip-effect="dark"
                    style="width: 100%"
                    empty-text="暂无数据..."
                    @selection-change="tableSelectionChange"
                >
                    <el-table-column
                        v-if="tableInfo.showSelect"
                        align="center"
                        width="42"
                        type="selection"
                    />
                    <!-- <el-table-column
                        align="center"
                        type="index"
                        :index="(index) => index + 1"
                    /> -->
                    <!-- 循环遍历 start -->
                    <el-table-column
                        v-for="item in tableInfo.propsList"
                        :key="item.prop"
                        :sortable="item.sortable"
                        show-overflow-tooltip
                        :width="item.width"
                        :align="item.align"
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
                            <span v-else-if="item.type && item.type === 'time'">{{ $moment(item.prop).format('YYYY-MM-DD HH:mm:ss') }}</span>
                            <!-- 3. 类型是状态进行处理 -->
                            <el-tag
                                v-else-if="item.props === 'status'"
                                :type="scope.row.status === '1' ?'success' :'info'"
                            >{{ scope.row.status === '1' ?
                                '正常' : '停用' }}
                            </el-tag>
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
import VtSearch from '@vt/VtSearch/VtSearch';
export default {
    name: 'PageTable',
    props: {
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    propsList: [
                        {
                            prop: 'name',
                            label: '分类名字',
                            slot: true, // 默认不传,用户显示插槽
                            width: 80 // 宽度
                        }
                    ],
                    selectInfo: [
                        // 选者框
                        {
                            value: 'status',
                            options: [
                                { label: '正常', value: '1' },
                                { label: '停用', value: '0' }
                            ]
                        }
                    ],
                    title: '标题',
                    showSelect: false, // 是否显示table选者框
                    multipleSelection: false, //是否进行多选
                    api: '', // eg: '模块名'
                    method: '', // 方法名
                    params: {}, // 除了分页,一些特殊字段,
                    marginRight: false // 默认false, 右侧流出tree树形结构边距,后续需要进行重构样式布局
                };
            }
        }
    },
    data() {
        return {
            searchConfig: {
                fields: [
                    {
                        label: '分类名称',
                        type: 'INPUT',
                        key: 'search',
                        placeholder: '请输入分类名称'
                    }
                ]
            },
            selectParams: (() => {
                let params = {};
                if (!this.tableInfo.selectInfo) return false;
                this.tableInfo.selectInfo.map(v => {
                    params[v.value] = '';
                });
                return params;
            })(),
            chosenTableList: [], // 选中数据
            currentData: '',
            searchValue: {
                search: ''
            },
            tableList: [],
            tableHeight: 0,
            tableLoading: false, // 表格loading状态
            total: 0,
            currentPage: 1, // 当前列表页
            pageSize: 50 // 当前列表数量
        };
    },
    watch: {
        /* 坑货 */
        $route: 'routerChange',
        'tableInfo.params.categoryId': {
            handler: function(newValue) {
                this.$clearObject(this.selectParams);
                if (this.tableInfo.title === '设备档案') {
                    this.searchConfig.fields[0].label = '档案编号';
                    this.searchConfig.fields[0].placeholder = '请输入档案编号';
                }
                this.searchValue = '';
            },
            deep: true,
            immediate: true
        }
    },
    async mounted() {
        await this.$sleep(0);
        // 获取表格数据
        this.getTableList();
        // 计算具体值,便于其他组件引用
        let tableBoxH = this.$refs.tableBox.offsetHeight;
        // 计算分页高
        let paginationH = this.$refs.pagination.offsetHeight;
        console.log(paginationH, '2222');
        this.tableHeight = tableBoxH - paginationH;
        console.log(this.tableHeight);
    },
    methods: {
        async getTableList() {
            this.tableLoading = true;
            let params = {
                search: '',
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...this.tableInfo.params,
                ...this.selectParams
            };
            this.$service(this.tableInfo.method, this.tableInfo.api, params)
                .then(res => {
                    if (res.list.length === 0 && res.pageNum !== 1) {
                        this.currentPage -= 1;
                        // 通过当前id获取子节点数据
                        this.getTableList();
                    } else {
                        console.log(res);
                        this.tableList = _.cloneDeep(res.list);
                        this.total = _.cloneDeep(res.total);
                        this.tableLoading = false;
                    }
                })
                .catch(() => {
                    this.tableLoading = false;
                });
        },
        // 当前分页页数发生了变化
        onCurrentChange() {
            this.getTableList();
        },
        // 当前分页数量发生了变化
        onSizeChange() {
            this.currentPage = 1;
            // 通过当前id获取子节点数据
            this.getTableList();
        },
        // 多选值发生了改变
        tableSelectionChange(rows) {
            if (!this.tableInfo.multipleSelection) {
                if (rows.length > 1 && this.tableInfo.showSelect) {
                    this.$refs.multipleTable.clearSelection();
                    this.$refs.multipleTable.toggleRowSelection(rows[1]);
                }
            }
            this.$emit('tableSelectChange', rows);
        },
        clearSelection() {
            this.$refs.multipleTable.clearSelection();
        },
        // 点击了视图查看按钮
        viewClick(id) {
            this.dialogShow = true;
        },
        // 点击了编辑按钮
        editClick(id) {
            this.dialogShow = true;
        },
        // 监控路由变化
        routerChange() {
            this.getTableList();
        },
        searchClick(val) {
            this.searchValue = val;
            this.tableLoading = true;
            let params = {
                search: val.search,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                ...this.tableInfo.params,
                ...this.selectParams
            };
            this.$service(this.tableInfo.method, this.tableInfo.api, params)
                .then(res => {
                    if (res.list.length === 0 && res.pageNum !== 1) {
                        this.currentPage -= 1;
                        // 通过当前id获取子节点数据
                        this.getTableList();
                    } else {
                        console.log(res);
                        this.tableList = _.cloneDeep(res.list);
                        this.total = _.cloneDeep(res.total);
                        this.tableLoading = false;
                    }
                })
                .catch(() => {
                    this.tableLoading = false;
                });
            // this.getTableList()
        },
        resetClick() {
            this.searchValue = {
                search: ''
            };
            // this.$clearObject(this.selectParams)
            this.getTableList();
        },
        // 显示placeholder
        getPlaceholder(val) {
            let placeholder;
            this.tableInfo.propsList.map(v => {
                if (v.prop === val) {
                    placeholder = v.label;
                }
                return false;
            });
            placeholder = '请选择' + placeholder;
            return placeholder;
        }
    }
};
</script>

<style lang="scss" scoped>
.margin-r {
    margin-left: 265px;
}

.general-list-page {
    position: relative;
    height: 100%;

    .el-table__body tr.current-row > td {
        background: #69a1fe !important;
        padding: 0 !important;
        color: #fff;

        span {
            color: #fff !important;
            // background: #fff !important;
        }
        .table-text {
            border-bottom: 1px solid #fff;
        }
        div {
            color: #fff !important;
        }
    }
    // .el-table__body tr.current-row > td {
    //     background: #69A1FE !important;

    //     .table-text {
    //         border-bottom: 1px solid #fff;
    //     }
    // }

    /deep/.current-row td {
        background-color: #69a1fe !important;
        color: #fff;

        .table-text {
            border-bottom: 1px solid #fff;
        }
        span {
            color: #fff !important;
            // background: #fff !important;
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
                        border: none;
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
    .next-genre-pack {
        margin-left: 265px;
        height: 100%;
        border: 1px solid #d2d3d5;
        background-color: #fff;
    }

    .genre-pack {
        height: 100%;
        // border: 1px solid #d2d3d5;
        border-radius: 8px;
        // background-color: #fff;

        .general-list-main-pack {
            background-color: #fff;
            padding: 0 10px;
            border-radius: 0 0 8px 8px;
        }
        .genre-pack-header {
            background-color: #fff;
            padding: 0 10px;
            border-radius: 8px 8px 0 0;
        }

        .title-pack {
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #d2d3d5;
        }

        .tool-pack {
            padding-top: 10px;
            padding-bottom: 10px;

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
            color: #f47476;
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
