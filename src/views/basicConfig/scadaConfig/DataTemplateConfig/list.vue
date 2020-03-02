<template>
    <vt-page type="one">
        <div class="getwayList-page dataTemplateConfig">
            <!-- 搜索组件 -->
            <vt-search
                v-if="searchConfig.fields && searchConfig.fields.length > 0"
                style="margin-bottom: 5px"
                :search-config="searchConfig"
                @searchData="searchClick"
                @reset="resetHandle"
            />
            <div class="tool-pack clear-float">
                <div class="float-left">
                    <!-- v-has="{role: 'add'}" -->
                    <el-button
                        v-has="{role: 'add'}"
                        type="primary"
                        size="mini"
                        icon="el-icon-circle-plus-outline"
                        @click="addChannelListClick()"
                    >新增</el-button>
                </div>
            </div>
            <div class="table pl-10 pr-10">
                <PageTable
                    ref="generalTableDom"
                    :configuration="templateTableConfiguration"
                    :data-list="dataTempleteList"
                    border
                    @onSelectChange="onSelectChange"
                    @onSizeChange="onSizeChange"
                    @onCurrentChange="onCurrentChange"
                >
                    <template #name="{scope}">
                        <span
                            class="table-text"
                        ><el-button
                            v-has="{role: 'view'}"
                            type="text"
                            size="small"
                            @click="viewChannelClick(scope.row)"
                        >{{ scope.row.name }}</el-button>
                        </span>
                    </template>
                    <!-- 状态 -->
                    <template #status="{scope}">
                        <el-switch
                            v-model="scope.row.status"
                            :disabled="!$has($route,'disable')"
                            active-color="#409eff"
                            inactive-color="#dcdfe6"
                            active-value="1"
                            inactive-value="0"
                            @change="channelStatusSwitch(scope.row)"
                        />
                    </template>
                    <!-- 类型 -->
                    <template #type="{scope}">
                        <span v-if="scope.row.type === '1'">设备数据</span>
                        <span v-if="scope.row.type === '2'">工艺数据</span>
                        <span v-if="scope.row.type === '3'">程序数据</span>
                        <span v-if="scope.row.type === '4'">指令</span>
                    </template>
                    <!--操作-->
                    <template #handle="{scope}">
                        <el-button
                            v-has="{role: 'edit'}"
                            size="small"
                            type="text"
                            @click="editChannelClick(scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-has="{role: 'delete'}"
                            style="color:red"
                            size="small"
                            type="text"
                            @click="moveDownClick(scope.row)"
                        >删除</el-button>
                        <!-- <el-button
                            type="text"
                            size="small"
                            @click="fileldConfigClick(scope.row)"
                        >字段配置</el-button> -->
                    </template>
                </PageTable>
            </div>
            <!-- 弹框复用 -->
            <el-dialog
                v-drag-dialog
                :title="dialogStatus === 'edit' ? '编辑模板配置' : dialogStatus === 'add' ? '新增模板配置' : '查看模板配置'"
                :visible.sync="editDialog"
                :show-close="false"
                width="800px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    ref="editTemplateData"
                    :model="editTemplateData"
                    :rules="dialogStatus === 'view' || dialogStatus === 'config' ? {} : templateFormRules"
                    label-position="left"
                    label-width="auto"
                >
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                label="名称"
                                prop="name"
                                style="width:100%"
                            >
                                <el-input
                                    v-model=" editTemplateData.name"
                                    size="mini"
                                    maxlength="30"
                                    placeholder="名称"
                                    :readonly="dialogStatus === 'view' || dialogStatus === 'config'"
                                    @blur="nameIsUnique(editTemplateData.id, editTemplateData.name)"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="类型"
                                prop="type"
                                style="width:100%"
                            >
                                <el-select
                                    v-model="editTemplateData.type"
                                    size="mini"
                                    style="width: 100%;"
                                    :disabled="dialogStatus === 'view' || dialogStatus === 'config'"
                                    placeholder="请选择"
                                    @change="typesListsChange"
                                >
                                    <el-option
                                        v-for="item in typesList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="24">
                            <el-form-item
                                label="备注"
                                prop="remarks"
                                style="width:100%;"
                            >
                                <el-input
                                    v-model.trim="editTemplateData.remarks"
                                    :readonly="dialogStatus === 'view' ||dialogStatus === 'config'"
                                    placeholder="请输入内容"
                                    size="small"
                                    type="textarea"
                                    :autosize="{ minRows: 4, maxRows: 10}"
                                    show-word-limit
                                    multiple
                                    maxlength="250"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div style="height:30px;line-hight:30px;font-weight:700">字段配置：</div>
                <el-button
                    v-if="dialogStatus !== 'view'"
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    style="margin-bottom:10px;float:right;margin-top:-35px"
                    @click="addChannelConfigClick()"
                >新增</el-button>
                <!-- modalDialog -->
                <PageTable
                    ref="templateItemList"
                    :configuration="modalDialogconfiguration"
                    :data-list="editTemplateData.templateItemList"
                    border
                    @onSelectChange="modalDialogOnSelectChange"
                    @onSizeChange="modalDialogOnSizeChange"
                    @onCurrentChange="modalDialogOnCurrentChange"
                >
                    <!--类型-->
                    <template #fieldType="{scope}">
                        <el-select
                            v-model="scope.row.fieldType"
                            size="mini"
                            :disabled="dialogStatus === 'view'"
                            :placeholder="dialogStatus === 'view' ? '' : '请选择'"
                            @change="typesListsChange"
                        >
                            <el-option
                                v-for="item in modelSelectTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </template>
                    <!--名称-->
                    <template #fieldName="{scope}">
                        <el-input
                            v-model="scope.row.fieldName"
                            size="mini"
                            maxlength="30"
                            :readonly="dialogStatus === 'view'"
                            :placeholder="dialogStatus === 'view' ? '' : '名称'"
                        />
                    </template>
                    <!--业务名称-->
                    <template #fieldBizName="{scope}">
                        <el-input
                            v-model="scope.row.fieldBizName"
                            size="mini"
                            maxlength="30"
                            :readonly="dialogStatus === 'view'"
                            :placeholder="dialogStatus === 'view' ? '' : '业务名称'"
                        />
                    </template>
                    <!--描述-->
                    <template #fieldDesc="{scope}">
                        <el-input
                            v-model="scope.row.fieldDesc"
                            size="mini"
                            maxlength="30"
                            :readonly="dialogStatus === 'view'"
                            :placeholder="dialogStatus === 'view' ? '' : '描述'"
                        />
                    </template>
                    <!--操作-->
                    <template
                        v-if="dialogStatus !== 'view'"
                        #modelHandle="{scope}"
                    >
                        <el-button
                            style="color:red"
                            size="small"
                            type="text"
                            @click="modelMoveDownClick(scope.row)"
                        >删除</el-button>
                    </template>
                </PageTable>
                <span slot="footer">
                    <el-button
                        size="mini"
                        icon="el-icon-circle-close"
                        @click="editCancelClick('editTemplateData')"
                    >取消</el-button>
                    <el-button
                        v-if="dialogStatus !== 'view'"
                        icon="el-icon-circle-check"
                        size="mini"
                        type="primary"
                        :loading="channelConfirmLoading"
                        @click="editConfirmClick('editTemplateData')"
                    >确认</el-button>
                </span>
            </el-dialog>
            <!-- 模态框中的点击新增后的弹框 -->
            <el-dialog
                v-drag-dialog
                title="新增字段配置"
                :show-close="false"
                width="600px"
                :visible.sync="addFieldConfigDialog"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    ref="addFiledConfigData"
                    :model="addFiledConfigData"
                    :rules="fieldConfigFormRules"
                    label-position="left"
                    label-width="auto"
                >
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                label="名称"
                                prop="fieldName"
                            >
                                <el-input
                                    v-model="addFiledConfigData.fieldName"
                                    size="mini"
                                    maxlength="30"
                                    placeholder="名称"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="业务名称"
                                prop="fieldBizName"
                            >
                                <el-input
                                    v-model="addFiledConfigData.fieldBizName"
                                    size="mini"
                                    maxlength="30"
                                    placeholder="业务名称"
                                    :disabled="dialogStatus === 'view'"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                label="类型"
                                prop="fieldType"
                            >
                                <el-select
                                    v-model="addFiledConfigData.fieldType"
                                    size="mini"
                                    placeholder="请选择"
                                    @change="typesListsChange"
                                >
                                    <el-option
                                        v-for="item in modelSelectTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="描述"
                                prop="fieldDesc"
                            >
                                <el-input
                                    v-model="addFiledConfigData.fieldDesc"
                                    size="mini"
                                    maxlength="30"
                                    placeholder="字段描述"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer">
                    <el-button
                        size="mini"
                        icon="el-icon-circle-check"
                        @click="fieldConfigClickCancel('addFiledConfigData')"
                    >取消</el-button>
                    <el-button
                        v-if="dialogStatus !== 'view'"
                        size="mini"
                        icon="el-icon-circle-check"
                        type="primary"
                        :loading="channelConfirmLoading"
                        @click="fieldConfigClickConfirm('addFiledConfigData')"
                    >确认</el-button>
                </span>
            </el-dialog>
        </div>
    </vt-page>
</template>

<script>
    /**
     * @module 基础配置-Scada配置-数据模板配置
     * @author chebin
     */
import PageTable from '@/components/Table/index';
export default {
    components: {
        PageTable
    },
    data () {
        return {
            searchConfig: {
                fields:[
                    {
                        label: '关键字',
                        type: 'INPUT',
                        key: 'keywords',
                        placeholder: '请输入搜索关键字'
                    }
                ]
            },
            // 搜索输入框输入的内容
            searchValue: null,
            // 表格数据
            dataTempleteList: [],
            // 弹框中的表格数据
            templateItemList: [],
            // 数据模板表格配置项
            templateTableConfiguration: {
                propsList: [
                    {
                        prop: 'name',
                        label: '名称',
                        sortable: true,
                        'min-width': 180,
                        slot: true,
                        fixed: 'left'
                    },
                    {
                        prop: 'type',
                        label: '类型',
                        slot: true,
                        sortable: true,
                        'min-width': 180,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        prop: 'remarks',
                        label: '备注',
                        'min-width': 280,
                        fixed: 'left'
                    },
                    {
                        prop: 'status',
                        label: '状态',
                        slot: true,
                        align: 'center',
                        'width': 80,
                        fixed: 'left'
                    },
                    {
                        prop: 'handle',
                        label: '操作',
                        slot: true,
                        align: 'center',
                        'width': 100,
                        fixed: 'right'
                    }

                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 20 // 当前列表数量
                },
                tableHeight: '0', // 表格高度
                paginationPack: true, //是否展示分页
                showSelect: false, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false // 加载标识
            },
            // 外部表格单条数据的ID
            templateId: null,
            // 新增字段配置数据
            addFiledConfigData: {
                fieldBizName: null, // 字段的业务名称
                fieldDesc: null, // 字段描述
                fieldName: null, // 字段的原始名称，从设备采集上来的名称，一般较短，表义不明，可以会有变动
                fieldType: null // 字段类型
            },
            // 模态框表格配置项
            modalDialogconfiguration: {
                propsList: [
                    {
                        prop: 'fieldName',
                        label: '名称',
                        slot: true,
                        sortable: true,
                        'min-width': 100,
                        fixed: 'left',
                    },
                    {
                        prop: 'fieldBizName',
                        label: '业务名称',
                        slot: true,
                        sortable: true,
                        'min-width': 130,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldType',
                        label: '类型',
                        slot: true,
                        sortable: true,
                        'min-width': 130,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        prop: 'fieldDesc',
                        label: '描述',
                        slot: true,
                        'min-width': 100,
                        fixed: 'left'
                    },
                    {
                        prop: 'modelHandle',
                        label: '操作',
                        slot: true,
                        'min-width': 60,
                        fixed: 'left'
                    }

                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 50 // 当前列表数量
                },
                tableHeight: '400', // 表格高度
                paginationPack: false, //是否展示分页
                showSelect: false, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false // 加载标识
            },
            // 编辑模态框的默认状态
            editDialog: false,
            // 添加字段配置模态框的默认状态
            addFieldConfigDialog: false,
            // 判断编辑、查看dialog是否可输入
            dialogStatus: '',
            // 判断模态框中的字段配置是否显示(只有当点击 “字段配置” 按钮 模态框才可以显示)
            fileldConfig: false,
            // 确认按钮的loading状态
            channelConfirmLoading: false,
            // 表单验证信息
            templateFormRules: {
                name: [
                    {
                        required: true,
                        message: '名称不可以为空',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请选择通道类型',
                        trigger: 'change'
                    }
                ]
            },
            // 字段配置表单验证信息
            fieldConfigFormRules: {
                fieldName: [
                    {
                        required: true,
                        message: '请填写名称',
                        trigger: 'blur'
                    }
                ],
                fieldBizName: [
                    {
                        required: true,
                        message: '请填写业务名称',
                        trigger: 'blur'
                    }
                ],
                fieldType: [
                    {
                        required: true,
                        message: '请选择字段类型',
                        trigger: 'change'
                    }
                ],
                fieldDesc: [
                    {
                        required: true,
                        message: '请填写描述',
                        trigger: 'blur'
                    }
                ]
            },
            // 编辑默认信息
            editTemplateData: {
                name: '',
                type: '',
                remarks: '',
                status: '',
                templateItemList: [
                    {
                        fieldBizName: '',
                        fieldDesc: '',
                        fieldName: '',
                        fieldType: ''
                    }
                ]
            },
            // 新增要添加的数据
            addTemplateData: {},
            // 弹框表格上部类型下拉数据
            typesList: [
                {
                    label: '设备数据',
                    value: '1'
                },
                {
                    label: '工艺数据',
                    value: '2'
                },
                {
                    label: '程序数据',
                    value: '3'
                },
                {
                    label: '指令',
                    value: '4'
                }
            ],
            // 模态框表格内部的下拉数据
            modelSelectTypeList: [
                {
                    label: '整型',
                    value: 'Integer'
                },
                {
                    label: '字符串',
                    value: 'String'
                },
                {
                    label: '文件',
                    value: 'file'
                },
                {
                    label: '浮点型',
                    value: 'Float'
                }
            ]
        }
    },
    mounted () {
        setTimeout(() => {
            this.getTemplateListData();
            this.templateTableConfiguration.tableHeight = `${document.querySelector('.dataTemplateConfig').offsetHeight - 150}px`;
        }, 0)
    },
    methods: {
        // 点击新增按钮
        addChannelListClick () {
            this.templateItemList.length = 0;
            this.dialogStatus = 'add';
            this.editDialog = true;
            this.editTemplateData.name = ''
            this.editTemplateData.type = ''
            this.editTemplateData.remarks = ''
            this.editTemplateData.status = ''
            this.editTemplateData.templateItemList.length = 0;
        },
        // 点击搜索按钮
        searchClick (val) {
            this.searchValue = val
            let params = {
                pageNum: this.templateTableConfiguration.pagination.pageNum,
                pageSize: this.templateTableConfiguration.pagination.pageSize,
                ...val
            };
            this.$service('POST', '/SERVICE-SCADA/api/template/page', params).then(res => {
                this.dataTempleteList = _.cloneDeep(res.list);
            })
        },
        // 点击重置按钮
        resetHandle () {
            this.searchValue = {
                keywords: ''
            }
            this.getTemplateListData();
        },
        // 点击刷新
        refreshClick () {
            this.templateTableConfiguration.loading = true;
            let params = {
                pageNum: this.templateTableConfiguration.pagination.pageNum,
                pageSize: this.templateTableConfiguration.pagination.pageSize,
                queryVO: {}
            };
            this.$service('POST', '/SERVICE-SCADA/api/template/page', params).then(res => {
                this.$message.success('刷新成功')
                this.dataTempleteList = _.cloneDeep(res.list);
                this.templateTableConfiguration.pagination.total = res.total;
                this.templateTableConfiguration.loading = false;
            })
        },
        // 获取数据模板列表数据
        getTemplateListData () {
            this.templateTableConfiguration.loading = true;
            let params = {
                pageNum: this.templateTableConfiguration.pagination.pageNum,
                pageSize: this.templateTableConfiguration.pagination.pageSize,
                queryVO: {}
            };
            this.$service('POST', '/SERVICE-SCADA/api/template/page', params).then(res => {
                this.dataTempleteList = _.cloneDeep(res.list);
                this.templateTableConfiguration.pagination.total = res.total;
                this.templateTableConfiguration.loading = false;
            })
        },
        // 表格内部下拉选择事件
        onSelectChange () {
        },
        // 模板状态开关切换
        channelStatusSwitch (row) {
            this.$service('PUT', '/SERVICE-SCADA/api/template/updateStatus/{id}', {id: row.id}).then(res => {
                if (row.status === '1') {
                    this.getTemplateListData();
                    this.$message.success('启用成功')
                } else {
                    this.getTemplateListData();
                    this.$message('已停用')
                }
            }).catch(res => {
                row.status = '1';
            })
        },
        // 删除操作
        moveDownClick (row) {
            this.$confirm(
                `确定要删除此条模板数据吗？`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                this.$service('DELETE', '/SERVICE-SCADA/api/template/{id}', {id: row.id}).then(res => {
                    this.getTemplateListData();
                    this.$message.success('操作成功')
                })
            })
        },
        // 编辑按钮点击事件
        editChannelClick (row) {
            this.dialogStatus = 'edit'
            this.editDialog = true;
            this.templateId = row.id;
            this.$service('GET', '/SERVICE-SCADA/api/template/{id}', {id: row.id}).then(res => {
                // for (let key in res) {
                //     if (this.editTemplateData.hasOwnProperty(key)) {
                //         this.editTemplateData[key] = _.cloneDeep(res[key]);
                //     };
                // };
                this.editTemplateData = _.cloneDeep(res)
            })
            // this.templateItemList = _.cloneDeep(row.templateItemList);
        },
        // 查看按钮点击事件
        viewChannelClick (row) {
            this.dialogStatus = 'view'
            this.fileldConfig = false
            this.$service('GET', '/SERVICE-SCADA/api/template/{id}', {id: row.id}).then(res => {
                this.editTemplateData = _.cloneDeep(res);
                // for (let key in res) {
                //     if (this.editTemplateData.hasOwnProperty(key)) {
                //         this.editTemplateData[key] = _.cloneDeep(res[key]);
                //     };
                // };
            })
            this.editDialog = true;
        },
        // 字段配置按钮点击事件
        fileldConfigClick (row) {
            // this.dialogStatus = 'view'
            this.dialogStatus = 'config'
            this.fileldConfig = true;
            this.editDialog = true;
            this.$service('GET', '/SERVICE-SCADA/api/template/{id}', {id: row.id}).then(res => {
                this.editTemplateData = _.cloneDeep(res);
                this.templateItemList =  _.cloneDeep(res.templateItemList);
            })
            this.templateId = row.id;
        },
        // 编辑类型下拉数据变化
        typesListsChange (val) {
        },
        // 校验名称是否唯一
        nameIsUnique (id, name) {
            if (!name) {
                this.$message.error('名称不能为空')
            } else {
                let params = {
                    id: id,
                    name: name
                }
                this.$service('GET', '/SERVICE-SCADA/api/template/isUnique', params).then(res => {
                }).catch(res => {
                    this.editTemplateData.name = null;
                })
            }
        },
        // 确认按钮
        editConfirmClick (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = this.editTemplateData;
                    if (this.dialogStatus === 'edit') {
                        params.id = this.templateId;
                    }
                    this.$service('POST', '/SERVICE-SCADA/api/template', params).then(res => {
                        this.$message.success('操作成功');
                        this.editDialog = false;
                        this.editTemplateData = {
                            name: '',
                            type: '',
                            remarks: '',
                            status: '',
                            templateItemList: [
                                {
                                    fieldBizName: '',
                                    fieldDesc: '',
                                    fieldName: '',
                                    fieldType: ''
                                }
                            ]
                        };
                        this.getTemplateListData();
                    }).catch(err => {
                        this.$message.error(err);
                    })
                } else {
                    return false;
                }
            })
        },
        // 取消按钮
        editCancelClick (formName) {
            this.editTemplateData = {
                name: '',
                type: '',
                remarks: '',
                status: '',
                templateItemList: [
                    {
                        fieldBizName: '',
                        fieldDesc: '',
                        fieldName: '',
                        fieldType: ''
                    }
                ]
            };
            this.$refs[formName].resetFields();
            this.editDialog = false;
        },
        // 单页数据个数改变
        onSizeChange (val) {
            this.templateTableConfiguration.pagination.pageSize = val;
            this.getTemplateListData();
        },
        // 分页页数改变
        onCurrentChange (val) {
            this.templateTableConfiguration.pagination.pageNum = val;
            this.getTemplateListData();
        },
        // 模态框表格下拉事件
        modalDialogOnSelectChange () {},
        // 模态框分页个数改变
        modalDialogOnSizeChange () {},
        // 模态框的新增字段通道配置
        addChannelConfigClick () {
            let tempObj = {
                'fieldBizName': null,
                'fieldDesc': null,
                'fieldName': null,
                'fieldType': null,
                'id': null,
                'templateId': null
            }
            this.addFieldConfigDialog = true;
        },
        // 模态框的新增字段通道配置弹框取消事件
        fieldConfigClickCancel (formName) {
            this.$refs[formName].resetFields();
            this.addFieldConfigDialog = false;
        },
        // 模态框的新增字段通道配置弹框确认事件
        fieldConfigClickConfirm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.dialogStatus === 'edit') {
                        let tempObj = {}
                        this.addFiledConfigData.templateId = _.cloneDeep(this.templateId);
                        tempObj = _.cloneDeep(this.addFiledConfigData)
                        this.editTemplateData.templateItemList.push(tempObj);
                    } else {
                        let tempObj = {}
                        // this.addFiledConfigData.templateId = _.cloneDeep(this.templateId);
                        tempObj = _.cloneDeep(this.addFiledConfigData)
                        this.editTemplateData.templateItemList.push(tempObj);
                    }
                    this.$message.success('操作成功');
                    this.fieldConfigClickCancel('addFiledConfigData');
                } else {
                    return false;
                }
            });
        },
        // 模态框分页页数改变
        modalDialogOnCurrentChange () {},
        // 模态框表格的删除
        modelMoveDownClick (row) {
            // for(let item of this.editTemplateData.templateItemList) {
            //     if (item.fieldName === row.fieldName) {
            //     }
            // }
            for (let i = 0; i < this.editTemplateData.templateItemList.length; i++) {
                if (this.editTemplateData.templateItemList[i].fieldName === row.fieldName) {
                    this.editTemplateData.templateItemList.splice(i, 1)
                    // this.$service('POST', '/api/template', this.editTemplateData).then(res => {
                    // })
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.demo-form-inline {
    padding: 20px 10px 0 0;
    text-align: right;
}
.el-form .el-form-item {
    // width: fit-content;
    min-width: fit-content;
    margin-right: 5px;
}
.el-form .form-btn {
    width: fit-content;
    min-width: fit-content;
}
.getwayList-page {
    // ?主体样式
    position: relative;
    min-height: 100%;
    width: 100%;
    border-radius: 8px;
    // padding: 0 10px;
    // border: 1px solid #d2d3d5;

    // ?标题样式
    .page-title {
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #d2d3d5;
    }

    // ?新增按钮样式，位置
    .tool-pack {
        // padding-top: 10px;
        // padding-bottom: 10px;
        padding: 10px;
        background-color: #fff;
    }
    .table {
        background-color: #fff;
        padding-bottom: 10px;
    }

    // ?表格位置样式
    .gatewaylist-content {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;

        // ?状态图标样式
        .status-circle {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 6px;
            margin-right: 5px;
            vertical-align: middle;
        }
    }
}
</style>
