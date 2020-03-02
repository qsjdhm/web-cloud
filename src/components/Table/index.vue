<template>
    <div
        v-if="tableForceUpdateToggle"
        class="table-pack"
    >
        <!-- :highlight-current-row="configuration.highLightCurrentToggle" -->
        <el-table
            ref="table"
            v-loading="configuration.loading"
            :data="dataList"
            style="width: 100%"
            tooltip-effect="dark"
            empty-text="暂无数据..."
            :height="configuration.tableHeight"
            highlight-current-row
            :radio="configuration.radio"
            v-bind="setTableAttr()"
            @row-click="doTableRowClick"
            @sort-change="onSortChange"
            @selection-change="onSelectChange"
        >
            <el-table-column
                v-if="configuration.showSelect"
                type="selection"
                width="45"
                fixed
                align="center"
            />
            <el-table-column
                v-if="configuration.showIndex"
                align="center"
                type="index"
                fixed
                width="45"
            />
            <!-- 正常表格 -->
            <el-table-column
                v-for="(column, index) in configuration.propsList"
                :key="index"
                show-overflow-tooltip
                :label="column.label"
                v-bind="getColBind(column)"
            >
                <template slot-scope="scope">
                    <!-- 1. 展示slot 插槽 -->
                    <slot
                        v-if="column.slot"
                        :name="column.prop"
                        :scope="scope"
                    >-</slot>
                    <!-- 默认展示的数据 -->
                    <span v-else>
                        {{ scope.row[column.prop] === null || scope.row[column.prop] === '' || scope.row[column.prop] === undefined ? '-' : scope.row[column.prop] }}
                    </span>
                </template>
            </el-table-column>
            <!-- 预留字段及其他功能插槽 -->
            <!--<slot name="operationColumn" />-->
        </el-table>
        <!-- 分页 -->
        <div
            v-if="configuration.paginationPack"
            class="pagination-pack"
        >
            <!--                 layout="prev, pager, next, sizes, jumper"\ -->
            <el-pagination
                background
                :total="configuration.pagination.total"
                style="text-align: center; margin-top: 10px;"
                :page-sizes="[50, 100, 200, 500]"
                layout="total, sizes, prev, pager, next"
                :current-page.sync="configuration.pagination.pageNum"
                :page-size.sync="configuration.pagination.pageSize"
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        configuration: {
            type: Object,
            required: true,
            radio: false,
            pageSizes: [50, 100, 200, 500]
        },
        dataList: {
            type: Array,
            default: null
        } // 表格的数据列表
    },
    data() {
        return {
            // 表格强制刷新开关
            tableForceUpdateToggle: true
        };
    },
    watch: {
        configuration: {
            handler(newVal, oldVal) {
                console.log('\x1B[32m%s\x1B[0m', '配置');
                console.log(newVal.tableHeight);
                this.configuration = newVal;
            },
            deep: true,
            immediate: true
        },
        'configuration.propsList': {
            handler(newVal, oldVal) {
                // 当数据有所变动时，强制刷新表格组件
                this.tableForceUpdateToggle = false;
                this.$nextTick(() => {
                    this.tableForceUpdateToggle = true;
                });
            }
        },
        $route(to, from) {
            // 如果路由发生变化时，强制刷新表格组件
            this.tableForceUpdateToggle = false;
            this.$nextTick(() => {
                this.tableForceUpdateToggle = true;
            });
        }
    },
    mounted() {},
    methods: {
        // 页数变化事件
        onSizeChange(pageSize) {
            this.configuration.pagination.pageSize = pageSize;
            this.$emit('onSizeChange', pageSize);
        },
        // 数量变数事件
        onCurrentChange(pageNum) {
            // this.configuration.pagination.pageSize = 1
            this.configuration.pagination.pageNum = pageNum;
            this.$emit('onCurrentChange', pageNum);
        },
        // 表格数据点击事件
        doTableRowClick(tableNodeValue) {
            this.$emit('doTableRowClick', tableNodeValue);
        },
        // 触发表格排序功能
        onSortChange(sortValue) {
            this.$emit('onSortChange', sortValue);
        },
        // 排序功能
        formatter(row, column) {
            return row.address;
        },
        // 触发表格多选功能
        onSelectChange(selectValue) {
            if (selectValue.length > 1 && this.configuration.radio === true) {
                this.$refs.table.toggleRowSelection(selectValue[0], false);
                selectValue.splice(0, 1);
            }
            this.$emit('onSelectChange', selectValue);
        },
        // 解析属性
        setTableAttr() {
            // 项目table默认属性
            let defaultAttr = {
                stripe: true,
                border: false
            };
            let attr = Object.assign(defaultAttr, this.$attrs);
            return attr;
        },
        // 处理table列绑定属性
        getColBind(col) {
            let attr = {};
            let row = _.cloneDeep(col);
            // 判断是否开启排序
            if (this.configuration.sortable) {
                attr.sortable = true;
            }
            if (row.slot) {
                delete row.slot;
            }
            let bind = Object.assign(attr, row);
            return bind;
        }
    }
};
</script>

<style lang="scss">
.table-pack {
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
    /deep/.el-table--medium th,
    .el-table--medium td {
        height: 33px;
        line-height: 33px;
        padding: 0px !important;
    }
    .cell {
        height: 32px !important;
        line-height: 32px !important;
    }
    // /deep/.current-row td  {
    //     background-color: #69A1FE !important;
    //     color: #fff;

    //     span {
    //         color: #fff !important;
    //         // background: #fff !important;
    //     }
    // }

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
}
</style>
