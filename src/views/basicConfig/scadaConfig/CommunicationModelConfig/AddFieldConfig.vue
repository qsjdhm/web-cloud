<template>
    <!-- 模态框中的点击新增后的弹框 -->
    <el-dialog
        v-drag-dialog
        title="新增字段配置"
        :show-close="false"
        width="800px"
        :visible.sync="addFieldConfigDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <PageTable
            ref="addFieldConfigDialogList"
            :configuration="addFieldConfigConfiguration"
            :data-list="addTemplateItemList"
            border
            @onSelectChange="comDialogTableOnSelectChange"
        />
        <span slot="footer">
            <el-button
                size="mini"
                icon="el-icon-circle-close"
                @click="CancelClick()"
            >取消</el-button>
            <el-button
                size="mini"
                type="primary"
                icon="el-icon-circle-check"
                @click="ConfirmClick()"
            >确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
import PageTable from '@/components/Table/index';
export default {
    components: {
        PageTable
    },
    props: {
        addTemplateItemList: {
            type: Array,
            required: true
        },
        //表格默认显示的数据
        defaultTemplateData: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            // 模态框状态
            addFieldConfigDialog: false,
            // 字段配置表格配置项
            addFieldConfigConfiguration: {
                propsList: [
                    {
                        prop: 'fieldName',
                        label: '名称',
                        // slot: true,
                        sortable: true,
                        'min-width': 100,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldBizName',
                        label: '业务名称',
                        // slot: true,
                        sortable: true,
                        'min-width': 130,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldType',
                        label: '类型',
                        // slot: true,
                        sortable: true,
                        'min-width': 130,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldDesc',
                        label: '描述',
                        // slot: true,
                        sortable: true,
                        'min-width': 100,
                        fixed: 'left'
                    }
                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 20 // 当前列表数量
                },
                tableHeight: '400', // 表格高度
                paginationPack: false, //是否展示分页
                showSelect: true, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false // 加载标识
            },
            // 数据模板表格数据
            addFieldConfigDialogList: [],
            // 数据模板勾选的数据
            selectedTableTemplateList: []
        }
    },
    methods: {
        // 获取模板字段配置列表
        getModelFieldConfigList () {
        },
        // 多选
        comDialogTableOnSelectChange (selectValue) {
            this.selectedTableTemplateList.length = 0;
            this.selectedTableTemplateList = selectValue;
        },
        //取消
        CancelClick () {
            this.addFieldConfigDialog = false;
        },
        // 确认
        ConfirmClick () {
            if (this.selectedTableTemplateList.length === 0) {
                this.$message.warning('请勾选要配置的数据')
            } else {
                let flag = true;
                for (let item of this.selectedTableTemplateList) {
                    for (let i of this.defaultTemplateData) {
                        if (item.id === i.id) {
                            this.$message.error('所选数据中包含已经配置的数据，请检查')
                            flag = false
                        }
                    }
                }
                if (flag === true) {
                    this.addFieldConfigDialog = false
                    this.$message.success('添加成功！')
                    for (let item of this.selectedTableTemplateList) {
                        item.name = '';
                        this.defaultTemplateData.push(item)
                    }
                    let configTableList = this.defaultTemplateData
                    this.$emit('ConfirmClick', configTableList)
                } else {
                    this.addFieldConfigDialog = true
                }
            }
        }
    }
}
</script>

<style>

</style>