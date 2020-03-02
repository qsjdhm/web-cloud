<!-- 系统管理> 字典管理 -->
<template>
    <vt-page type="one">
        <bs-table
            ref="BsTable"
            :bs-data="bsData"
            @onView="viewClick"
        >
            <!-- 插槽套插槽 -->
            <template #operateHeader>
                <el-button
                    v-waves
                    v-has="{role: 'add'}"
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    @click="addClick()"
                >新增
                </el-button>
            </template>
            <!-- table中插槽-->
            <template #updateTime="{scope}">
                <span>{{ $moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
            <template #status="{scope}">
                <div style="text-align: center">
                    <switch-status
                        :request="{
                            api: '/SERVICE-SYSTEM/api/dict/status',
                            method: 'put',
                            params: {id: scope.row.id}
                        }"
                        role="disabled"
                        :status="scope.row.status"
                        @updateTable="$refs.BsTable.initTable()"
                    />
                </div>
            </template>
            <template #operate="{scope}">
                <el-button
                    v-has="{role: 'edit'}"
                    type="text"
                    @click="editClick(scope.row)"
                >编辑
                </el-button>
                <el-button
                    v-has="{role: 'set'}"
                    type="text"
                    @click="addDictItem(scope.row)"
                >配置
                </el-button>
            </template>
        </bs-table>
        <!-- 新增 或 添加字典-->
        <el-dialog
            v-drag-dialog
            :title="dialogStatus==='add'?'新增字典' : '编辑字典'"
            :visible.sync="isShowDialog"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :width="$global.dw_col"
        >
            <el-form
                ref="dialogDom"
                :rules="formRules"
                label-width="100px"
                label-position="right"
                :model="dialogData"
            >
                <el-row>
                    <el-col>
                        <el-form-item
                            label="字典编码："
                            prop="code"
                        >
                            <el-input
                                v-model.trim="dialogData.code"
                                :maxlength="$global.string"
                                size="mini"
                                placeholder="请输入字典编码"
                            />
                        </el-form-item>
                        <el-form-item
                            label="字典名称："
                            prop="name"
                        >
                            <el-input
                                v-model.trim="dialogData.name"
                                :maxlength="$global.string"
                                size="mini"
                                placeholder="请输入字典名称"
                            />
                        </el-form-item>
                        <el-form-item
                            v-if="dialogStatus === 'add'"
                            label="状态："
                            prop="status"
                        >
                            <el-switch
                                v-model="dialogData.status"
                                :disabled="!$has($route,'disable')"
                                active-color="#409eff"
                                inactive-color="#dcdfe6"
                                active-value="1"
                                inactive-value="0"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer text-center"
            >
                <el-button
                    size="mini"
                    @click="cancelClick('dialogDom')"
                >取消</el-button>
                <el-button
                    v-if="dialogStatus!=='view'"
                    :loading="loadingList.indexOf('save') > -1"
                    size="mini"
                    type="primary"
                    @click="saveClick('dialogDom')"
                >确认</el-button>
            </span>
        </el-dialog>
        <!-- 新增字典项 -->
        <dict-dialog :dialog-info="dialogInfo" />
    </vt-page>
</template>

<script>
import SwitchStatus from '@/components/SwitchStatus'
import DictDialog from './DictDialog'

export default {
    name: 'Dictionary',
    components: {
        SwitchStatus,
        DictDialog
    },
    inheritAttrs: false,
    data() {
        return {
            // 搜索条件字段
            bsData: {
                searchConfig: {
                    fields: [
                        {
                            label: '编码/名称',
                            value: '', // 可以穿默认值
                            type: 'INPUT',
                            key: 'search',
                            placeholder: '请输入字典名称和编码'
                        }
                    ]
                },
                tableConfig: {
                    url: '/SERVICE-SYSTEM/api/dict/page',
                    methods: 'get',
                    // 表格数据
                    data: [],
                    // 列配置
                    columns: [
                        {
                            type: 'index'
                        },
                        {
                            label: '字典编码',
                            prop: 'code',
                            type: 'view',
                            role: 'view',
                            'min-width': 140
                        },
                        {
                            label: '字典名称',
                            prop: 'name',
                            'min-width': 140
                        },
                        {
                            label: '维护时间',
                            prop: 'updateTime',
                            type: 'time'
                        },
                        {
                            label: '状态',
                            slotName: 'status',
                            width: 70
                        },
                        {
                            label: '操作',
                            slotName: 'operate',
                            width: this.$global.op_2,
                            align: 'center'
                        }
                    ]
                }
            },
            tagStatus: [
                { en: 'FINISH', cn: '完成', type: 'success' },
                { en: 'UNFINISHED', cn: '未完成', type: 'info' },
                { en: 'BREAK', cn: '终止', type: 'warning' }
            ],
            isShowDialog: false,
            dialogStatus: 'add',
            dialogData: {
                code: '',
                name: '',
                status: '1'
            },
            loadingList: [],
            formRules: {
                code: [
                    {
                        required: true,
                        message: '请输入字典编码',
                        trigger: ['blur', 'change']
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入字典名称',
                        trigger: ['blur', 'change']
                    }
                ],
                status: [{ required: true }]
            },
            // 新增字典项
            dialogInfo: {
                isShowDialog: false,
                dialogStatus: 'add',
                loadingList: [],
                dialogData: {
                    id: '',
                    code: '',
                    name: '',
                    status: '1'
                }
            }
        }
    },
    async mounted() {},
    methods: {
        addClick() {
            this.isShowDialog = true
            this.dialogStatus = 'add'
        },
        editClick(row) {
            this.isShowDialog = true
            this.dialogStatus = 'edit'
            this.$nextTick(() => {
                this.dialogData = _.cloneDeep(row)
            })
        },
        /* =================== 新增和编辑 start=================== */
        saveClick(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    try {
                        this.loadingList.push('save')
                        if (this.dialogStatus === 'add') {
                            let params = { ...this.dialogData }
                            await this.$service('post', '/SERVICE-SYSTEM/api/dict', params)
                            this.$message.success('添加成功')
                        } else {
                            let params = { ...this.dialogData }
                            await this.$service('put', '/SERVICE-SYSTEM/api/dict', params)
                            this.$message.success('编辑成功')
                        }
                        this.isShowDialog = false
                        this.$refs[formName].resetFields()
                        this.$refs.BsTable.initTable()
                        this.loadingList = []
                    } catch (error) {
                        this.loadingList = []
                        // this.isShowDialog = false
                    }
                }
            })
        },
        cancelClick(formName) {
            this.isShowDialog = false
            this.$refs[formName].resetFields()
        },
        /* 添加字典项 */
        addDictItem(row) {
            this.dialogInfo.dialogStatus = 'add'
            this.dialogInfo.isShowDialog = true
            this.$nextTick(() => {
                this.dialogInfo.dialogData = row
            })
        },
        viewClick(scope) {
            this.dialogInfo.isShowDialog = true
            this.$nextTick(() => {
                this.dialogInfo.dialogData = scope.row
                this.dialogInfo.dialogStatus = 'view'
            })
        }
    }
}
</script>
