<template>
    <vt-page type="one">
        <div class="getwayList-page dataChannelConfig">
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
                    <el-button
                        v-has="{role: 'add'}"
                        type="primary"
                        size="mini"
                        icon="el-icon-circle-plus-outline"
                        @click="addChannelListClick()"
                    >新增</el-button>
                </div>
                <!-- <div class="float-right">
                    <el-input
                        v-model="searchValue"
                        clearable
                        style="width: 160px;"
                        size="mini"
                        maxlength="30"
                        class="search-imput mr-5"
                        placeholder="请输入搜索关键字"
                        @input="searchClick()"
                    />
                    <el-button
                        size="mini"
                        icon="el-icon-search"
                        type="primary"
                        @click="searchClick()"
                    >搜索</el-button>
                    <el-button
                        size="mini"
                        class="bt-class"
                        icon="el-icon-refresh"
                        @click="resetHandle()"
                    >重置</el-button>
                </div> -->
            </div>
            <div class="table pl-10 pr-10">
                <PageTable
                    ref="generalTableDom"
                    :configuration="ChannelTableconfiguration"
                    :data-list="dataChannelList"
                    border
                    @onSelectChange="onSelectChange"
                    @onSizeChange="onSizeChange"
                    @onCurrentChange="onCurrentChange"
                >
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
                    <template #name="{scope}">
                        <span
                            class="table-text"
                        ><el-button
                            v-has="{role: 'view'}"
                            type="text"
                            size="mini"
                            @click="viewChannelClick(scope.row)"
                        >{{ scope.row.name }}</el-button>
                        </span>
                    </template>
                    <!-- 类型 -->
                    <template #type="{scope}">
                        <span v-if="scope.row.type === '1'">mqtt</span>
                        <span v-if="scope.row.type === '2'">modbus</span>
                        <span v-if="scope.row.type === '3'">tcp</span>
                        <span v-if="scope.row.type === '4'">opcua</span>
                        <span v-if="scope.row.type === '5'">ftp</span>
                    </template>
                    <!--操作-->
                    <template #handle="{scope}">
                        <!-- <el-button
                            v-has="{role: 'view'}"
                            type="text"
                            size="small"
                            @click="viewChannelClick(scope.row)"
                        >查看</el-button> -->
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
                    </template>
                </PageTable>
            </div>
            <!-- 编辑弹框 -->
            <el-dialog
                v-drag-dialog
                :title="`${dialogStatus === 'edit' ? '编辑通道列表' : dialogStatus === 'add' ? '新增通道列表' : '查看通道列表'}`"
                :visible.sync="editWorkCenterDialog"
                :show-close="false"
                width="600px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    ref="editChannelData"
                    :model="editChannelData"
                    :rules="dialogStatus === 'view' ? {} : channelFormRules"
                    label-position="left"
                    label-width="auto"
                >
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                label="名称"
                                prop="name"
                            >
                                <el-input
                                    v-model=" editChannelData.name"
                                    size="mini"
                                    :placeholder="dialogStatus === 'view' ? '' : '请输入名称'"
                                    :readonly="dialogStatus === 'view'"
                                    maxlength="30"
                                    @blur="nameIsUnique(editChannelData.id, editChannelData.name)"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="类型"
                                prop="type"
                            >
                                <el-select
                                    v-model="editChannelData.type"
                                    size="mini"
                                    :disabled="dialogStatus === 'view'"
                                    placeholder="请选择"
                                    style="width:158px"
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
                        <el-col :span="12">
                            <el-form-item
                                v-if="editChannelData.type === '1' ? false : true"
                                prop="ip"
                                label="Ip"
                            >
                                <el-input
                                    v-model="editChannelData.ip"
                                    size="mini"
                                    :placeholder="dialogStatus === 'view' ? '' : 'ip'"
                                    :readonly="dialogStatus === 'view'"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                v-if="editChannelData.type === '1' ? false : true"
                                label="port"
                            >
                                <el-input
                                    v-model="editChannelData.port"
                                    size="mini"
                                    maxlength="30"
                                    :placeholder="dialogStatus === 'view' ? '' : '端口'"
                                    :readonly="dialogStatus === 'view'"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                v-if="editChannelData.type === '1' ? false : true"
                                label="路径"
                            >
                                <el-input
                                    v-model="editChannelData.path"
                                    size="mini"
                                    maxlength="30"
                                    :placeholder="dialogStatus === 'view' ? '' : '路径'"
                                    :readonly="dialogStatus === 'view'"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="editChannelData.type === '1' ? '主题' : '地址'">
                                <el-input
                                    v-model="editChannelData.address"
                                    size="mini"
                                    maxlength="30"
                                    :readonly="dialogStatus === 'view'"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row
                        v-if="editChannelData.type === '1' ? false : true"
                        :gutter="30"
                    >
                        <el-col :span="12">
                            <el-form-item label="用户名">
                                <el-input
                                    v-model="editChannelData.username"
                                    size="mini"
                                    maxlength="30"
                                    :placeholder="dialogStatus === 'view' ? '' : '用户名'"
                                    :readonly="dialogStatus === 'view'"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col
                            v-if="editChannelData.type === '1' ? false : true"
                            :span="12"
                        >
                            <el-form-item label="密码">
                                <el-input
                                    v-model="editChannelData.password"
                                    size="mini"
                                    maxlength="30"
                                    :placeholder="dialogStatus === 'view' ? '' : '密码'"
                                    :readonly="dialogStatus === 'view'"
                                />
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
                                    v-model.trim="editChannelData.remarks"
                                    :readonly="dialogStatus === 'view'"
                                    :placeholder="dialogStatus === 'view' ? '' : '请输入内容'"
                                    size="mini"
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
                <span slot="footer">
                    <el-button
                        size="mini"
                        icon="el-icon-circle-close"
                        @click="editCancelClick('editChannelData')"
                    >取消</el-button>
                    <el-button
                        v-if="dialogStatus !== 'view'"
                        size="mini"
                        icon="el-icon-circle-check"
                        type="primary"
                        :loading="channelConfirmLoading"
                        @click="editConfirmClick('editChannelData')"
                    >确认</el-button>
                </span>
            </el-dialog>
        </div>
    </vt-page>
</template>

<script>
     /**
     * @module 基础配置-Scada配置-数据通道配置
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
            dataChannelList: [],
            // 表格配置项
            ChannelTableconfiguration: {
                propsList: [
                    {
                        prop: 'name',
                        label: '名称',
                        sortable: true,
                        slot: true,
                        'min-width': 180,
                        fixed: 'left'
                    },
                    {
                        prop: 'type',
                        label: '类型',
                        slot: true,
                        sortable: true,
                        'width': 180,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        prop: 'remarks',
                        label: '备注',
                        'min-width': 180,
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
                        fixed: 'left'
                    }

                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 50 // 当前列表数量
                },
                tableHeight: '700', // 表格高度
                paginationPack: true, //是否展示分页
                showSelect: false, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false // 加载标识
            },
            // 编辑模态框的默认状态
            editWorkCenterDialog: false,
            // 判断编辑、查看dialog是否可输入
            dialogStatus: '',
            // 确认按钮的loading状态
            channelConfirmLoading: false,
            // 表单验证信息
            channelFormRules: {
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
                ],
                ip: this.formValidator.isIP('')
            },
            // 编辑默认信息
            editChannelData: {
                name: null,
                type: null,
                remarks: null,
                address: null,
                createTime: null,
                status: null,
                username: null,
                password: null,
                ip: null,
                updateTime: null,
                path: null,
                port: null
                // id: null
            },
            // 新增要添加的数据
            addChannelData: {
                name: null,
                type: null,
                remarks: null,
                address: null,
                createTime: null,
                status: null,
                username: null,
                password: null,
                ip: null,
                updateTime: null,
                path: null,
                port: null
            },
            // 类型下拉数据
            typesList: [
                {
                    label: 'mqtt',
                    value: '1'
                },
                {
                    label: 'tcp',
                    value: '3'
                },
                {
                    label: 'opcua',
                    value: '4'
                },
                {
                    label: 'ftp',
                    value: '5'
                }
            ]
        }
    },
    mounted () {
        setTimeout(() => {
            this.getChannelListData();
            this.ChannelTableconfiguration.tableHeight = `${document.querySelector('.dataChannelConfig').offsetHeight - 140}px`;
        }, 0)
    },
    methods: {
        // 点击新增按钮
        addChannelListClick () {
            this.dialogStatus = 'add';
            this.editWorkCenterDialog = true;
            this.editChannelData.name = null
            this.editChannelData.type = null
            this.editChannelData.remarks = null
            this.editChannelData.address = null
            this.editChannelData.createTime = null
            this.editChannelData.status = null
            this.editChannelData.username = null
            this.editChannelData.password = null
            this.editChannelData.ip = null
            this.editChannelData.updateTime = null
            this.editChannelData.path = null
            this.editChannelData.port = null
            // this.editChannelData.id = null
        },
        // 点击搜索按钮
        searchClick (val) {
            this.searchValue = val;
            let params = {
                pageNum: this.ChannelTableconfiguration.pagination.pageNum,
                pageSize: this.ChannelTableconfiguration.pagination.pageSize,
                ...val
            };
            this.$service('POST', '/SERVICE-SCADA/api/channel/page', params).then(res => {
                this.dataChannelList = _.cloneDeep(res.list);
                this.ChannelTableconfiguration.pagination.total = _.cloneDeep(res.total)
            })
        },
        // 点击重置按钮
        resetHandle () {
            this.searchValue = {
                keywords: ''
            };
            this.getChannelListData();
        },
        // 刷新
        refreshClick () {
            this.ChannelTableconfiguration.loading = true;
            let params = {
                pageNum: this.ChannelTableconfiguration.pagination.pageNum,
                pageSize: this.ChannelTableconfiguration.pagination.pageSize,
                queryVO: {}
            };
            this.$service('POST', '/SERVICE-SCADA/api/channel/page', params).then(res => {
                this.$message.success('刷新成功')
                this.dataChannelList = _.cloneDeep(res.list);
                this.ChannelTableconfiguration.pagination.total = _.cloneDeep(res.total)
                this.ChannelTableconfiguration.loading = false;
            })
        },
        // 获取通道列表数据
        getChannelListData () {
            this.ChannelTableconfiguration.loading = true;
            let params = {
                pageNum: this.ChannelTableconfiguration.pagination.pageNum,
                pageSize: this.ChannelTableconfiguration.pagination.pageSize,
                queryVO: {}
            };
            this.$service('POST', '/SERVICE-SCADA/api/channel/page', params).then(res => {
                this.dataChannelList = _.cloneDeep(res.list);
                this.ChannelTableconfiguration.pagination.total = _.cloneDeep(res.total)
                this.ChannelTableconfiguration.loading = false;
            })
        },
        // 表格内部下拉选择事件
        onSelectChange () {
        },
        // 通道状态开关切换
        channelStatusSwitch (row) {
            this.$service('PUT', '/SERVICE-SCADA/api/channel/updateStatus/{id}', {id: row.id}).then(res => {
                if (row.status === '1') {
                    this.getChannelListData();
                    this.$message.success('启用成功')
                } else {
                    this.getChannelListData();
                    this.$message('已停用')
                }
            }).catch(res => {
                row.status = '1';
            })
        },
        // 删除操作
        moveDownClick (row) {
            this.$confirm(
                `确定要删除此条通道数据吗？`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                this.$service('DELETE', '/SERVICE-SCADA/api/channel/{id}', {id: row.id}).then(res => {
                    this.getChannelListData();
                    this.$message.success('操作成功')
                })
            })
        },
        // 编辑按钮点击事件
        editChannelClick (row) {
            this.dialogStatus = 'edit'
            this.$service('GET', '/SERVICE-SCADA/api/channel/{id}', {id: row.id}).then(res => {
                this.editChannelData = _.cloneDeep(res);
            })
            this.editWorkCenterDialog = true;
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
                this.$service('GET', '/SERVICE-SCADA/api/channel/isUnique', params).then(res => {
                }).catch(res => {
                    this.editChannelData.name = null;
                })
            }
        },
        // 查看按钮点击数件
        viewChannelClick (row) {
            this.dialogStatus = 'view'
            this.$service('GET', '/SERVICE-SCADA/api/channel/{id}', {id: row.id}).then(res => {
                this.editChannelData = _.cloneDeep(res);
            })
            this.editWorkCenterDialog = true;
        },
        // 编辑类型下拉数据变化
        typesListsChange (val) {
            if (val === '1') {
                this.editChannelData.remarks = null
                this.editChannelData.address = null
                this.editChannelData.status = null
                this.editChannelData.username = null
                this.editChannelData.password = null
                this.editChannelData.ip = null
                this.editChannelData.path = null
                this.editChannelData.port = null
            }
        },
        // 确认按钮
        editConfirmClick (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = this.editChannelData;
                    this.$service('POST', '/SERVICE-SCADA/api/channel', params).then(res => {
                        this.$message.success('操作成功');
                        this.editWorkCenterDialog = false;
                        this.getChannelListData();
                        this.editCancelClick('editChannelData');
                    })
                } else {
                    return false;
                }
            });
        },
        // 取消按钮
        editCancelClick (formName) {
            if (formName) {
                this.editChannelData = {
                    name: null,
                    type: null,
                    remarks: null,
                    address: null,
                    createTime: null,
                    status: null,
                    username: null,
                    password: null,
                    ip: null,
                    updateTime: null,
                    path: null,
                    port: null
                    // id: null
                }
                this.$refs[formName].resetFields();
                this.editWorkCenterDialog = false;
            } else {
                return false;
            }
        },
        // 分页个数
        onSizeChange (val) {
            this.ChannelTableconfiguration.pagination.pageSize = val;
            // 获取通道列表数据
            this.getChannelListData();
        },
        // 分页页数改变
        onCurrentChange (val) {
            this.ChannelTableconfiguration.pagination.pageNum = val;
            // 获取通道列表数据
            this.getChannelListData();
        }
    }
}
</script>

<style lang="scss" scoped>
.image-content {
    width: 100%;
    height: 150px;
    border: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    #qrcode {
        width: 150px;
        height: 100%;
        margin: 20px 20px;
    }
}
.demo-form-inline {
    padding: 20px 10px 0 0;
    text-align: right;
}
.el-form .el-form-item {
    width: fit-content;
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
    // border: 1px solid #d2d3d5;
    // background-color: #fff;

    // ?标题样式
    .page-title {
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #d2d3d5;
    }

    // ?新增按钮样式，位置
    .tool-pack {
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