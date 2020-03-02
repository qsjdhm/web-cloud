<!-- 权限管理页面 -->
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
                    v-has="{role: 'add'}"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addClick('formDom')"
                >新增
                </el-button>
            </template>
            <!-- 表格顶部操作的按钮 -->
            <template #type="{scope}">
                <div style="text-align: center">
                    <span :class="[scope.row.type==='DATA'?'success':'warning']">{{ scope.row.type === 'DATA' ? '数据权限' : '功能权限' }}</span>
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
                <el-button
                    v-has="{role: 'delete'}"
                    class="red-text"
                    type="text"
                    @click="deleteClick(scope.row)"
                >删除
                </el-button>
            </template>
            <!-- table中插槽-->
        </bs-table>
        <!-- 新增 或 添加字典-->
        <el-dialog
            v-drag-dialog
            :title="dialogStatus==='add'?'新增权限' : '编辑权限'"
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
                            label="权限编码："
                            prop="code"
                        >
                            <el-input
                                v-model.trim="dialogData.code"
                                :maxlength="$global.string"
                                size="mini"
                                placeholder="请输入权限编码"
                            />
                        </el-form-item>
                        <el-form-item
                            label="权限名称："
                            prop="name"
                        >
                            <el-input
                                v-model.trim="dialogData.name"
                                :maxlength="$global.string"
                                size="mini"
                                placeholder="请输入权限名称"
                            />
                        </el-form-item>
                        <el-form-item
                            label="权限类型："
                            prop="type"
                        >
                            <el-select
                                v-model="dialogData.type"
                                :disabled="dialogStatus === 'edit'"
                                style="width:100%"
                                size="mini"
                                placeholder="请选择权限类型"
                            >
                                <el-option
                                    label="功能权限"
                                    value="FUNCTION"
                                />
                                <el-option
                                    label="数据权限"
                                    value="DATA"
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
        <!-- 新增字典项 -->

        <authority-dialog :dialog-info="dialogInfo" />
    </vt-page>
</template>

<script>
import Vue from 'vue'
import AuthorityDialog from '@/views/systemManage/authority/authorityDialog'
import getRoutes from '@/utils/generateRouter'

export default {
    name: 'Dict',
    components: { AuthorityDialog },
    provide() {
        return {
            rootInfo: Vue.observable({
                dialogInfo: this.dialogInfo
            }),
            setDialogShow: val => {
                this.dialogInfo.isShowDialog = val
            }
        }
    },
    data() {
        return {
            bsData: {
                searchConfig: {
                    fields: [
                        {
                            label: '权限类型',
                            value: '', // 默认值
                            type: 'SELECT',
                            key: 'type',  // 传递字段
                            options: [
                                // { label: "全部", value: "" },
                                { label: '功能权限', value: 'FUNCTION' },
                                { label: '数据权限', value: 'DATA' }
                            ],
                            placeholder: '请选择权限类型'
                        }
                    ]
                },
                tableConfig: {
                    url: '/SERVICE-SYSTEM/api/permission/page',
                    methods: 'get',
                    columns: [
                        {
                            type: 'index'
                        },
                        {
                            label: '权限编码',
                            prop: 'code',
                            type: 'view',
                            role: 'view',
                            sortable: true,
                            'min-width': 140
                        },
                        {
                            label: '权限名称',
                            prop: 'name'
                        },
                        {
                            type: 'time',
                            label: '维护时间',
                            prop: 'updateTime',
                        },
                        {
                            label: '权限类型',
                            slotName: 'type',
                            width: '140'
                        },
                        { label: '操作', slotName: 'operate' ,width: this.$global.op_3 ,align: 'center'}
                    ]
                }
            },
            /* =================== 表格 start=================== */
            /* =================== 表格 end=================== */
            /* =================== 新增和编辑 start=================== */
            isShowDialog: false,
            tagStatus: [
                { en: 'FINISH', cn: '完成', type: 'success' },
                { en: 'UNFINISHED', cn: '未完成', type: 'info' },
                { en: 'BREAK', cn: '终止', type: 'warning' }
            ],
            dialogStatus: 'add',
            dialogData: {
                code: '',
                name: '',
                type: ''
            },
            loadingList: [],
            formRules: {
                code: [
                    {
                        required: true,
                        message: '请输入权限编码',
                        trigger: ['blur', 'change']
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入权限名称',
                        trigger: ['blur', 'change']
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请输入权限类型',
                        trigger: ['blur', 'change']
                    }
                ]
            },
            // 新增字典项
            dialogInfo: {
                isShowDialog: false,
                dialogStatus: 'add',
                authorityType: '',
                loadingList: [],
                dialogData: {
                    id: '',
                    code: '',
                    name: '',
                    type: ''
                }
            }
        }
    },
    async mounted() {
        // 向后台发送路由,只有侧边栏有改动的时候才会用到
        let routerList = getRoutes()
        // await this.$service('post', '/SERVICE-SYSTEM/api/v1/resource/list', routerList)      // 向后台发送当前权限表
    },
    methods: {
        async deleteClick(row) {
            let tipTitle
            let referenceList = await this.$service('get', '/SERVICE-SYSTEM/api/permission/role/{permissionId3}', { permissionId3: row.id })
            if (referenceList && referenceList.length > 0) {
                tipTitle = `权限：${row.name}，被角色：“${referenceList.toString()}”引用，是否需要删除？`
            } else {
                tipTitle = `确定要删除”${row.name}“权限吗?`
            }
            this.$confirm(tipTitle, '提示', {
                dangerouslyUseHTMLString: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$service('delete', '/SERVICE-SYSTEM/api/permission/{sysPermissionId}', { sysPermissionId: row.id }).then(res => {
                    this.$message.success('删除成功')
                    this.$refs.BsTable.initTable()
                })
            })
        },
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
                    this.loadingList.push('save')
                    try {
                        if (this.dialogStatus === 'add') {
                            let params = { ...this.dialogData }
                            await this.$service('post', '/SERVICE-SYSTEM/api/permission', params)
                            this.$message.success('添加成功')
                        } else {
                            let params = { ...this.dialogData }
                            await this.$service('put', '/SERVICE-SYSTEM/api/permission', params)
                            this.$message.success('编辑成功')
                        }
                        this.isShowDialog = false
                        this.$refs[formName].resetFields()
                        this.$refs.BsTable.initTable()
                        this.loadingList = []
                    } catch (error) {
                        this.loadingList = []
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
            this.dialogInfo.isShowDialog = true
            if (row.type === 'DATA') {
                this.dialogInfo.authorityType = 'DATA'
            } else {
                this.dialogInfo.authorityType = 'FUNCTION'
            }
            this.dialogInfo.dialogData = row
            this.dialogInfo.dialogStatus = 'add'
        },
        viewClick(scope) {
            let row = scope.row
            this.dialogInfo.dialogData = row
            this.dialogInfo.isShowDialog = true
            if (row.type === 'DATA') {
                this.dialogInfo.authorityType = 'DATA'
            } else {
                this.dialogInfo.authorityType = 'FUNCTION'
            }
            this.dialogInfo.dialogStatus = 'view'
        }
    }
}
</script>

<style lang="scss" scoped>
/*/deep/ .setDialog .is-disabled .el-checkbox__inner:after{*/
/*    border-color: red;*/
/*}*/
$btnGreenDarken: #00a854; // 操作按钮开启蓝色
$btnYellowDarken: #ffbf00; // 操作按钮关闭黄色
.success{
    text-indent: 4px;
    color: $btnGreenDarken;
    &:before{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: $btnGreenDarken;
        opacity: 0.5;
        margin-right: 5px;
    }
}
.warning{
    color: $btnYellowDarken;
    &:before{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: $btnYellowDarken;
        opacity: 0.5;
        margin-right: 5px;
    }
}
.general-list-page {
    /deep/ .setDialog .is-disabled .el-checkbox__inner:after {
        border-color: red;
    }
}
.redbg{
    background:red!important;
}
</style>
