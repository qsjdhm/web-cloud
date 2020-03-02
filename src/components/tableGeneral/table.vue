<template>
    <div>
        <el-table
            ref="generalTableDom"
            v-loading="configuration.loading"
            row-key="id"
            :data="dataList"
            :height="height"
            :stripe="configuration.stripe"
            :border="configuration.border"
            tooltip-effect="dark"
            style="width: 100%"
            empty-text="暂无数据..."
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                v-if="configuration.showIndex"
                align="center"
                type="index"
                width="50"
            />
            <el-table-column
                v-if="configuration.showSelect"
                align="left"
                type="selection"
            />
            <el-table-column
                align="center"
                type="index"
                :index="(index) => index + 1"
            />
            <!-- 循环遍历 start -->
            <el-table-column
                v-for="column in configuration.propsList"
                v-if="!column.fixed"
                :key="column.prop"
                show-overflow-tooltip
                :width="column.width"
                align="left"
                :sortable="column.sortable"
                :prop="column.prop"
                :label="column.label"
            >
                <template slot-scope="scope">
                    <!-- 1. 展示slot 插槽 -->
                    <slot
                        v-if="column.slot"
                        :name="column.prop"
                        :scope="scope"
                    >-</slot>
                    <!-- 默认展示的数据 -->
                    <span v-else-if="scope.row[column.prop] === '' || scope.row[column.prop] === null">-</span>
                    <span v-else>{{ scope.row[column.prop] }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column v-if="configuration.operates.list.length > 0" label="操作" align="center" :width="configuration.operates.width">-->
            <!--<template slot-scope="scope">-->
            <!--<div class="operate-group">-->
            <!--<template v-for="(btn, key) in configuration.operates.list">-->
            <!--<el-button v-if="btn.show" :type="btn.type" :size="btn.size" :icon="btn.icon" :disabled="btn.disabled" @click.native.prevent="btn.method(key,scope.row)">{{ btn.label }}-->
            <!--</el-button>-->
            <!--</template>-->
            <!--</div>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!-- 分页 -->
        </el-table>
        <div
            v-if="configuration.paginationPack"
            class="pagination-pack"
        >
            <el-pagination
                background
                :total="configuration.pagination.total"
                style="text-align: center; margin-top: 12px;"
                :page-sizes="[20, 50, 100, 200]"
                layout="prev, pager, next, sizes, jumper"
                :current-page.sync="configuration.pagination.pageNum"
                :page-size.sync="configuration.pagination.pageSize"
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
            />
        </div>
    </div>
</template>

<script>
    // 引入自己的工具类
    import date from '@/utils/date.js'
    export default {
        props: {
            configuration: {
                type: Object,
                default: () => {
                    return {
                        selectList: [],
                        propsList: [
                            {
                                prop: 'name',
                                label: '分类名字',
                                slot: true,         // 默认不传,用户显示插槽
                                width: 80           // 宽度
                            }
                        ],  // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
                        operates: {}, // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
                        pagination: {},          // 分页参数配置
                        paginationPack: false,   // 是否展示分页
                        showSelect: false,     // 是否显示table选者框
                        showIndex: false,      // 是否显示行号
                        loading: false,        // 是否显示loading
                        stripe: false // 是否为斑马纹 table
                    }
                }
            },
            dataList: {
                type: Array,
                default: []
            },                  // 表格的数据列表
            height: {}          // 表格高度
        },
        data () {
            return {
            }
        },
        watch: {
        },
        async mounted () {
        },
        methods: {
            // 排序功能
            formatter (row, column) {
                return row.address;
            },
            // 多行选中
            handleSelectionChange (val) {
                this.$emit('handleSelectionChange', val)
            },
            // 页数变化事件
            onSizeChange (pageSize) {
                this.configuration.pagination.pageSize = pageSize
                this.$emit('onSizeChange', pageSize)
            },
            // 数量变数事件
            onCurrentChange (pageNum) {
                this.configuration.pagination.pageNum = pageNum
                this.$emit('onCurrentChange', pageNum)
            },
            // 表格默认选择事件
            selectChange (rows) {
                let newArr = this.dataList.filter(item => rows.includes(item.id))
                newArr.forEach(row => {
                    this.$refs.generalTableDom.toggleRowSelection(row, true);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-table--border {
        border-bottom: 1px solid #EBEEF5!important;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
