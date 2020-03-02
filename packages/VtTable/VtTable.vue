<template>
    <div
        ref="tableBox"
        class="list-box"
    >
        <el-table
            ref="VtTable"
            v-loading="tableConfig.loading"
            max-height="3500"
            :data="tableConfig.data"
            style="flex: 1"
            :height="tableHeight"
            v-bind="setTableAttr()"
            v-on="setTableEvent()"
        >
            <template v-for="(item, index) in tableConfig.columns">
                <!-- 1. 特殊列 如 多选 序号 -->
                <el-table-column
                    v-if="item.hasOwnProperty('type') &&(item.type === 'selection' || item.type === 'index')"
                    :key="index"
                    width="44"
                    v-bind="getColBind(item)"
                />
                <!-- 2、 展开行  -->
                <el-table-column
                    v-else-if="item.hasOwnProperty('type') && item.type === 'expand'"
                    :key="index"
                    v-bind="getColBind(item)"
                >
                    <template slot-scope="scope">
                        <slot
                            name="expand"
                            :data="scope"
                        />
                    </template>
                </el-table-column>
                <!-- 3、 存在formatter 格式化内容的列 -->
                <el-table-column
                    v-else-if="item.formatter"
                    :key="index"
                    show-overflow-tooltip
                    v-bind="getColBind(item)"
                />
                <!-- 时间格式 -->
                <el-table-column
                    v-else-if="item.type=== 'time'"
                    :key="index"
                    width="180"
                    show-overflow-tooltip
                    v-bind="getColBind(item)"
                >
                    <template slot-scope="scope">
                        <div style="text-align: center">{{ scope.row[item.prop]? $moment(scope.row[item.prop]).format('YYYY-MM-DD HH:mm:ss') : '-' }}</div>
                    </template>
                </el-table-column>
                <!-- 查看弹窗按钮 -->
                <el-table-column
                    v-else-if="item.type=== 'view'"
                    :key="index"
                    show-overflow-tooltip
                    v-bind="getColBind(item)"
                >
                    <template slot-scope="scope">
                        <span
                            v-if="$has($route, item.role) || !item.role"
                            class="table-text"
                            @click="onView(scope)"
                        >{{ scope.row[item.prop]? scope.row[item.prop] : '-' }}</span>
                        <span v-else>{{ scope.row[item.prop]? scope.row[item.prop] : '-' }}</span>
                    </template>
                </el-table-column>
                <!--  常用插槽 -->
                <el-table-column
                    v-else-if="item.slotName"
                    :key="index"
                    show-overflow-tooltip
                    v-bind="getColBind(item)"
                >
                    <template slot-scope="scope">
                        <slot
                            :name="item.slotName"
                            :scope="scope"
                        />
                    </template>
                </el-table-column>
                <!-- 4、普通列 -->
                <el-table-column
                    v-else
                    :key="index"
                    show-overflow-tooltip
                    v-bind="getColBind(item)"
                >
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row[item.prop] === '' ||
                                scope.row[item.prop] === null ||
                                scope.row[item.prop] === undefined "
                        >-</span>
                        <span>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <!--  分页 -->
        <div
            v-if="!!tableConfig.pagination && !tableConfig.hiddenPagination"
            ref="paginationBox"
        >
            <el-pagination
                class="pagination-pack"
                v-bind="setPaginationAttr()"
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
            />
        </div>
    </div>
</template>
<script>
/**
 * @module 业务组件表格
 * @author root
 */
import Methods from './tableMehods';

export default {
    name: 'VtTable',
    // 组件将不会把未被注册的props呈现为普通的HTML属性
    inheritAttrs: false,
    props: {
        tableConfig: {
            type: Object,
            required: true
        }
    }, // 不会在组件最外层div设置属性
    data() {
        return {
            tableHeight: null
        };
    },
    async mounted() {
        // 当前有没有传递高度，如果传递高度就采用传递过来的，否者采用默认默认计算
        if (!this.tableConfig.height && this.tableConfig.height !== 0) {
            // 渲染完成后进行设置table的高度
            this.$nextTick(() => {
                if (this.$refs.paginationBox) {
                    let pageHeight = this.$refs.paginationBox.offsetHeight;
                    this.tableHeight =
                        this.$refs.tableBox.offsetHeight - pageHeight;
                }
            });
        } else {
            this.tableHeight = this.tableConfig.height;
        }
    },
    methods: {
        // Methods  处理table的方法
        ...Methods,
        onView(scope) {
            console.log(scope);
            this.$emit('onView', scope);
        },
        // 处理table列绑定属性
        getColBind(col) {
            let attr = {};
            // 判断是否开启排序
            if (this.tableConfig.sortable) {
                attr.sortable = true;
            }
            let bind = Object.assign(attr, col);
            return bind;
        },
        // 设置需要绑定的table属性
        setTableAttr() {
            // 项目table默认属性
            let defaultAttr = {
                'highlight-current-row': true,
                stripe: true,
                border: true,
                // todo table-模块 解决底部滚动条初始无法滚动问题
                'max-height': 3000
            };
            let attr = Object.assign({}, defaultAttr, this.$attrs);
            return attr;
        },
        // 处理table绑定事件
        setTableEvent() {
            let Event = Object.assign({}, this.$listeners);
            return Event;
        },
        // 设置分页属性
        setPaginationAttr() {
            // 项目分页默认属性
            let defaultAttr = {
                background: true,
                'page-sizes': [50, 100, 200, 500],  // 确保 page-sizes中要含有page-siz
                layout: 'total, sizes, prev, pager, next',
                // layout: 'prev, pager, next,sizes,jumper',
                'current-page': 1,
                'page-size': 50
            };
            let attr = Object.assign(
                {},
                defaultAttr,
                this.tableConfig.pagination
            );
            return attr;
        },
        onSizeChange(pageSize) {
            console.log(pageSize);
            this.$emit('onSizeChange', pageSize);
        },
        // 数量变数事件
        onCurrentChange(pageNum) {
            console.log(pageNum);
            this.$emit('onCurrentChange', pageNum);
        }
    }
};
</script>
<style lang="scss" scoped>
.list-box {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;

    /* 解决表头错位问题 */
    /deep/ .el-table th.gutter {
        display: table-cell !important;
    }

    /deep/ .el-table colgroup.gutter {
        display: table-cell !important;
    }
    // 分页样式重置
    /deep/.pagination-pack {
        text-align: center;
        margin: 10px 0 0 0;

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
    // .pagination-pack{
    //     text-align: center;
    //     margin: 10px 0;
    // }
}
</style>
