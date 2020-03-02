## 业务组件-表格
### 2019年08月29日更新
#### 此组件是针对于表格组件复用性较高，进行二次封装的非业务组件
需要进行以下配置：<br>
1.父组件组件引入<br>
2.业务性较强字段父组件slot插槽实现<br>
3.父组件表格配置<br>
#### <font color="red">已废弃项</font>
1.orderToggle（排序）<br>
原：通过设置 orderToggle 属性来设置是否需要排序<br>
现：默认有排序功能，如果不需要排序功能，请在 fieldList 数组中将不需要排序的字段设置为 sort: false<br>
2.时间日期处理功能<br>
原：通过在 fieldList 中设置 type 和 dateFormate属性来实现<br>
现：请直接通过动态插槽的方式在父级组件处理时间日期格式化功能
#### demo代码
```
<template>
    <Table
        :tableConfig="tableConfig"
        @onPageSizeChange="onPageSizeChange"
        @onCurrentPageChange="onCurrentPageChange"
        @onSortChange="onSortChange"
        @onSelectChange="onSelectChange">
        <!-- 个性化定制内容 -->
        <template slot="code">
            <el-table-column
                label="仓库编码"
                prop="code"
                sortable="custom">
                <template slot-scope="scope">
                    <span>{{ `${scope.row.code}` + 1 }}</span>
                </template>
            </el-table-column>
        </template>
        <!-- 动态插槽，请设置prop，排序是通过prop取值 -->
        <template slot="time">
            <el-table-column
                label="时间"
                prop="time">
                <template slot-scope="scope">
                    {{ dateFormat(scope.row.time, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
        </template>
        <!-- 操作列制定插槽-->
        <template slot="operationColumn">
            <el-table-column
                label="操作"
                align="center"
                width="150">
                <template slot-scope="scope">
                    <el-button type="text" @click="doViewClick(scope.row)">查看</el-button>
                    <el-button type="text" class="margin-r-10" @click="doEditClick(scope.row)">编辑</el-button>
                    <el-button type="text" class="delete-button margin-r-10" @click="doDeleteClick(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </template>
    </Table>
</template>
```
```
<script>
    import Table from '@/components/Table'

    export default {
        components: {
            Table
        },
        data () {
            return {
                /**
                * 配置解释：表格配置项
                * 1.配置项如果想使用element-ui的默认值，可以不用配置
                * 2.height、data、fieldList需配置
                * 3.如果有分页效果，paginationToggle、paginationConfig需配置
                * 4.如果有排序功能，orderToggle需配置（已废弃，设置无效）
                */
                tableConfig: {
                    // 表格高度
                    height: 0,
                    // 表格数据
                    data: [],
                    // 表格是否点击高亮
                    highLightCurrentToggle: false,
                    // 是否有多选功能标识
                    checkedToggle: false,
                    // 是否支持排序功能（已废弃，设置无效）
                    orderToggle: false,
                    /**
                    * 配置解释：列表显示配置
                    * 1.label为表格的每列显示的名称
                    * 2.value为表格的每列显示的值
                    * 3.width为表格的每列的宽度显示
                    * 4.align为表格的每列的对齐方式
                    * 5.如果表格的列需要显示时间的话，请配置type为'time'，并设置时间解析格式dateFormate（已废弃，设置无效）
                    * 6.例如状态、操作这种业务性较强的表格字段，请使用slot插槽，插入到表格组件中一个名为'operationColumn'的插槽中
                    * 7.slot插槽配置的方法可以在父组件直接调用
                    * 8.如果有slot属性，那么在表格组件中设置一个与slot配置相同的命名插槽，可以个性化定制的内容，并且不会影响表格配置的顺序
                    * 9.列表中默认有排序功能，如果某些字段不需要排序功能，请将sortable属性设置为false
                    * 10.已新增动态属性设置功能，element表格组件自带属性都可以通过配置fieldList中的对象进行配置
                    */
                    fieldList: [
                        { label: '仓库编码', value: 'code', width: 100, align: 'center', slot: 'code', sotrable: false },
                        { label: '入库时间', value: 'time', slot: 'time' }
                    ],
                    // 是否显示分页
                    paginationToggle: true,
                    // 分页配置
                    paginationConfig: {
                        total: 0,
                        currentPage: 1,
                        pageSize: 20
                    }
                }
            }
        }
    }
</script>
```
