<!-- 系统管理=>角色管理-->
<template>
    <vt-page type="one">
        <bs-table
            ref="BsTable"
            :bs-data="bsData"
            @onView="editClick($event, 'view')"
        >
            <template #operateHeader>
                <el-button
                    v-has="{role: 'add'}"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addClick('formDom')"
                >新增
                </el-button>
            </template>
            <template #operate="{scope}">
                <el-button
                    v-has="{role: 'edit'}"
                    type="text"
                    @click="editClick(scope,'edit')"
                >编辑
                </el-button>
                <el-button
                    v-has="{role: 'delete'}"
                    class="red-text"
                    type="text"
                    @click="deleteClick(scope.row)"
                >删除
                </el-button>
            </template>
        </bs-table>
        <!-- 新增 或 添加字典-->
        <el-dialog
            v-drag-dialog
            :title="dialogStatus==='add'?'新增角色' : dialogStatus==='view'?'查看角色' : '编辑角色'"
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
                            label="角色编码："
                            prop="code"
                        >
                            <el-input
                                v-model.trim="dialogData.code"
                                maxlength="20"
                                :disabled="dialogStatus === 'view' || dialogStatus === 'edit'"
                                size="mini"
                                placeholder="请输入角色编码，以ROLE_开头"
                            />
                        </el-form-item>
                        <el-form-item
                            label="角色名称："
                            prop="name"
                        >
                            <el-input
                                v-model.trim="dialogData.name"
                                maxlength="20"
                                :disabled="dialogStatus === 'view'"
                                size="mini"
                                placeholder="请输入角色名称"
                            />
                        </el-form-item>
                        <el-form-item
                            label="功能权限："
                            prop="functionOptions"
                        >
                            <el-select
                                v-model="dialogData.functionOptions"
                                :disabled="dialogStatus === 'view'"
                                size="mini"
                                style="width: 100%"
                                multiple
                                :placeholder="dialogStatus==='view'? '':'请添加功能权限'"
                            >
                                <el-option
                                    v-for="item in functionOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="数据权限："
                            prop="dataOptions"
                        >
                            <el-select
                                v-model="dialogData.dataOptions"
                                :disabled="dialogStatus === 'view'"
                                size="mini"
                                style="width: 100%"
                                multiple
                                :placeholder="dialogStatus==='view'?'':'请添加数据权限'"
                            >
                                <el-option
                                    v-for="item in dataOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
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
    </vt-page>
</template>

<script>

export default {
    name: 'Dict',
    data () {
        return {
            bsData:{
                searchConfig: {
                    fields: [
                        {
                            label: '编码/名称',
                            value: '', // 默认值
                            type: 'INPUT',
                            key: 'search',  // 传递字段
                            placeholder: '请输入搜索关键字'
                        }
                    ]
                },
                tableConfig: {
                    url: '/SERVICE-SYSTEM/api/v1/role/list',
                    methods: 'get',
                    // 用于模拟
                    columns: [
                        {
                            type: 'index'
                        },
                        {
                            label: '角色编码',
                            prop: 'code',
                            type: 'view',
                            role: 'view',
                            sortable: true
                        },
                        {
                            label: '角色名称',
                            prop: 'name'
                        },
                        {
                            label: '维护时间',
                            prop: 'createTime',
                            type: 'time',
                            slotName: 'createTime',
                            sortable: true
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
            /* =================== 新增和编辑 start=================== */
            isShowDialog: false,
            dialogData: {
                type: '',  // 权限类型不需要传递
                code: '',
                name: '',
                permissionIds: '',
                functionOptions: [],
                dataOptions: []
            },
            dialogStatus: 'add',
            authorityOptions: [],
            loadingList: [],
            formRules: {
                code: [
                    {required: true, message: '请输入角色编码', trigger: ['blur', 'change']},
                    {
                        validator: (rule, value, callback) => {
                            if (!/^ROLE_.+/.test(value)) {
                                callback(new Error('角色编码必须是ROLE_开头'))
                            }
                            callback()
                        }
                    }
                ],
                name: [{required: true, message: '请输入角色名称', trigger: ['blur', 'change']}],
                status: [{required: true}]
            },
            functionOptions: [],
            dataOptions: []
        }
    },
    mounted () {
        this.getResource('DATA')
        this.getResource('FUNCTION')
    },
    methods: {
        getResource (type) {
            let params = {
                type: type,
                pageNum: 1,
                pageSize: 500,
                search: ''
            }
            this.$service('get', '/SERVICE-SYSTEM/api/permission/page', params).then((res) => {
                if (type === 'DATA') {
                    this.dataOptions = res.list
                } else {
                    this.functionOptions = res.list
                }
            })
        },
        addClick () {
            this.isShowDialog = true
            this.dialogStatus = 'add'
        },
        deleteClick (row) {
            this.$confirm(`确定要删除”${row.name}“角色?`, '提示', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$service('delete', '/SERVICE-SYSTEM/api/v1/role/{code}', {code: row.code}).then((res) => {
                    this.$message.success('删除成功')
                    this.$refs.BsTable.initTable()
                })
            })
        },
        editClick (scope, type) {
            let row =scope.row
            this.isShowDialog = true
            this.dialogStatus = type
            this.$nextTick(() => {
                this.dialogData.id = _.cloneDeep(row).id
                this.dialogData.name = _.cloneDeep(row).name
                this.dialogData.code = _.cloneDeep(row).code
                this.dialogData.functionOptions = []
                row.permissionList.map((item) => {
                    if (item) {
                        if (item.type === 'DATA') {
                            this.dialogData.dataOptions.push(item.id)
                        } else {
                            this.dialogData.functionOptions.push(item.id)
                        }
                    }
                })
            })
        },
        /* =================== 新增和编辑 start=================== */
        saveClick (formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    try {
                        this.loadingList.push('save')
                        if (this.dialogStatus === 'add') {
                            let params = {...this.dialogData}
                            params.permissionIds = [...this.dialogData.functionOptions, ...this.dialogData.dataOptions]

                            await this.$service('post', '/SERVICE-SYSTEM/api/v1/role', params)
                            this.$message.success('添加成功')
                        } else {
                            let params = {...this.dialogData}
                            params.permissionIds = [...this.dialogData.functionOptions, ...this.dialogData.dataOptions]
                            await this.$service('put', '/SERVICE-SYSTEM/api/v1/role', params)
                            this.$message.success('编辑成功')
                        }
                        this.loadingList = []
                        this.isShowDialog = false
                        this.$refs[formName].resetFields()
                        this.$refs.BsTable.initTable()
                        this.dialogData.functionOptions = []
                        this.dialogData.dataOptions = []
                    } catch (error) {
                        // this.$refs[formName].resetFields()
                        this.loadingList = []
                        // this.isShowDialog = false
                    }
                }
            })
        },
        cancelClick (formName) {
            this.isShowDialog = false
            this.$refs[formName].resetFields()
            this.dialogData.functionOptions = []
            this.dialogData.dataOptions = []
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
