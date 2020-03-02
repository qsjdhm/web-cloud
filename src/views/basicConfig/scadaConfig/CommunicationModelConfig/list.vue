<template>
    <vt-page type="one">
        <div class="getwayList-page communicationModelConfig">
            <!-- 搜索组件 -->
            <vt-search
                v-if="searchConfig.fields && searchConfig.fields.length > 0"
                style="margin-bottom: 5px"
                :search-config="searchConfig"
                @searchData="searchClick"
                @reset="resetHandle"
            />
            <div class="tool-pack clear-float pl-10 pr-10">
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
            <div class="communication_table table pl-10 pr-10">
                <PageTable
                    ref="generalTableDom"
                    :configuration="configuration"
                    :data-list="dataCommunicationModelList"
                    border
                    @onSelectChange="onSelectChange"
                    @onSizeChange="onSizeChange"
                    @onCurrentChange="onCurrentChange"
                >
                    <!-- 模板名称 -->
                    <template #templateName="{scope}">
                        <div
                            class="tableName"
                            @click="showTemplateInformation(scope.row)"
                        >{{ scope.row.templateName }}</div>
                    </template>
                    <!-- 通道名称 -->
                    <template #channelName="{scope}">
                        <div
                            class="tableName"
                            @click="showChannelInformation(scope.row)"
                        >{{ scope.row.channelName }}</div>
                    </template>
                    <template #equipNo="{scope}">
                        <span
                            class="table-text"
                        ><el-button
                            v-has="{role: 'view'}"
                            type="text"
                            size="small"
                            @click="viewChannelClick(scope.row)"
                        >{{ scope.row.equipNo }}</el-button>
                        </span>
                    </template>
                    <!-- 模板类型 -->
                    <template #templateType="{scope}">
                        <span v-if="scope.row.templateType === '1'">设备数据</span>
                        <span v-if="scope.row.templateType === '2'">工艺数据</span>
                        <span v-if="scope.row.templateType === '3'">程序数据</span>
                        <span v-if="scope.row.templateType === '4'">指令</span>
                    </template>
                    <!-- 通道类型 -->
                    <template #channelType="{scope}">
                        <span v-if="scope.row.channelType === '1'">mqtt</span>
                        <span v-if="scope.row.channelType === '2'">modbus</span>
                        <span v-if="scope.row.channelType === '3'">tcp</span>
                        <span v-if="scope.row.channelType === '4'">opcua</span>
                        <span v-if="scope.row.channelType === '5'">ftp</span>
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
                            type="text"
                            @click="editCommunicationClick(scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-has="{role: 'delete'}"
                            style="color:red"
                            type="text"
                            @click="moveDownClick(scope.row)"
                        >删除</el-button>
                    </template>
                </PageTable>
            </div>
            <!-- 编辑/查看 复用弹框 -->
            <el-dialog
                v-drag-dialog
                :title="`${dialogStatus === 'edit' ? '编辑模型配置' : dialogStatus === 'add' ? '新增模型配置' : '查看模型配置'}`"
                :visible.sync="editCommunicationDialog"
                :show-close="false"
                width="850px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    ref="editTemplateData"
                    :model="editViewAddListData"
                    :rules="dialogStatus === 'view' ? {} : templateFormRules"
                    label-position="left"
                    label-width="auto"
                >
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                label="设备编号"
                                prop="equipId"
                            >
                                <el-select
                                    v-model="editViewAddListData.equipId"
                                    :disabled="dialogStatus === 'view'"
                                    clearable
                                    reserve-keyword
                                    filterable
                                    style="width: 100%"
                                    size="mini"
                                    :placeholder="dialogStatus === 'add' ? '请输入设备编号': ''"
                                    :loading="equipNoAllLoadingToggle"
                                >
                                    <el-option
                                        v-for="(item, index) in equipNoFilterList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.id"
                                    />
                                </el-select>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="类型"
                                prop="type"
                            >
                                <el-select
                                    v-model="editViewAddListData.type"
                                    size="mini"
                                    style="width: 100%"
                                    :disabled="dialogStatus === 'view'"
                                    @change="typesListsChange"
                                >
                                    <el-option
                                        v-for="item in communicationTypesList"
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
                                label="数据模板"
                                style="width:100%;"
                            >
                                <el-input
                                    v-model="communicationModalData.dataTemplate.name"
                                    readonly
                                    placeholder="点击选择模板列表"
                                    size="mini"
                                    :autosize="{ minRows: 4, maxRows: 10}"
                                    show-word-limit
                                    multiple
                                    @focus="showTemplateDialog"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="数据通道"
                                style="width:100%;"
                            >
                                <el-input
                                    v-model="communicationModalData.dataChannel.name"
                                    :readonly="comModelDialogTableList.length>0"
                                    clearable
                                    placeholder="点击选择通道列表"
                                    size="mini"
                                    :autosize="{ minRows: 4, maxRows: 10}"
                                    show-word-limit
                                    multiple
                                    @clear="clearValue"
                                    @focus="showChannelDialog"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div style="height:30px;line-hight:30px;font-weight:700">字段配置：</div>
                <el-button
                    :disabled="dialogStatus === 'view'"
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    style="margin-bottom:10px;float:right;margin-top:-35px"
                    @click="addChannelConfigClick()"
                >新增</el-button>
                <!-- 弹框内部表格 -->
                <PageTable
                    :configuration="comModelDialogTableConfig"
                    :data-list="comModelDialogTableList"
                    border
                    @onSelectChange="comDialogTableOnSelectChange"
                >
                    <!--数据通道-->
                    <template
                        #name="{scope}"
                    >
                        <el-button
                            size="mini"
                            type="text"
                            @click="showChannelConfigDialog(scope)"
                        >
                            {{ scope.row.name === '' ? '点击配置数据通道' : scope.row.name }}
                        </el-button>
                    </template>
                    <template
                        #handle="{scope}"
                    >
                        <el-button
                            v-if="dialogStatus !== 'view'"
                            style="color:red"
                            size="mini"
                            type="text"
                            @click="modelMoveDownClick(scope.row)"
                        >删除</el-button>
                    </template>
                </PageTable>
                <span slot="footer">
                    <el-button
                        size="mini"
                        icon="el-icon-circle-close"
                        @click="editDialogEditCancelClick('editTemplateData')"
                    >取消</el-button>
                    <el-button
                        v-if="dialogStatus !== 'view'"
                        size="mini"
                        type="primary"
                        :loading="channelConfirmLoading"
                        icon="el-icon-circle-check"
                        @click="editConfirmClick('editTemplateData')"
                    >确认</el-button>
                </span>
            </el-dialog>
            <!-- 查看模板信息弹框 -->
            <el-dialog
                v-drag-dialog
                title="查看模板配置信息"
                :visible.sync="viewTemplateDialog"
                :show-close="false"
                width="800px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    ref="showTemplateData"
                    :model="showTemplateData"
                    label-position="left"
                    label-width="auto"
                >
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                label="名称"
                                style="width:100%"
                            >
                                <el-input
                                    v-model="showTemplateData.name"
                                    size="mini"
                                    readonly
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="类型"
                                style="width:100%"
                            >
                                <el-select
                                    v-model="showTemplateData.type"
                                    disabled
                                    style="width: 100%;"
                                    size="mini"
                                >
                                    <el-option
                                        v-for="item in viewTemplateTypesList"
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
                                    v-model.trim="showTemplateData.remarks"
                                    readonly
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
                <div style="height:30px;line-hight:30px;font-weight:700">字段通道配置：</div>
                <PageTable
                    ref="templateItemList"
                    :configuration="modalDialogconfiguration"
                    :data-list="showTemplateData.templateItemList"
                    border
                />
                <span slot="footer">
                    <el-button
                        size="mini"
                        icon="el-icon-circle-close"
                        @click="editCancelClick('showTemplateData')"
                    >取消</el-button>
                </span>
            </el-dialog>
            <!-- 查看通道信息弹框 -->
            <el-dialog
                v-drag-dialog
                title="查看通道信息"
                :visible.sync="viewChanneleDialog"
                :show-close="false"
                width="600px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    ref="viewChannelData"
                    :model="viewChannelData"
                    label-position="left"
                    label-width="auto"
                >
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item label="名称">
                                <el-input
                                    v-model="viewChannelData.name"
                                    readonly
                                    size="mini"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型">
                                <el-select
                                    v-model="viewChannelData.type"
                                    size="mini"
                                    disabled
                                >
                                    <el-option
                                        v-for="item in viewChanneltypesList"
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
                                v-if="viewChannelData.type === '1' ? false : true"
                                label="Ip"
                            >
                                <el-input
                                    v-model="viewChannelData.ip"
                                    readonly
                                    size="mini"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                v-if="viewChannelData.type === '1' ? false : true"
                                label="port"
                            >
                                <el-input
                                    v-model="viewChannelData.port"
                                    readonly
                                    size="mini"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <el-form-item
                                v-if="viewChannelData.type === '1' ? false : true"
                                label="路径"
                            >
                                <el-input
                                    v-model="viewChannelData.path"
                                    readonly
                                    size="mini"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="viewChannelData.type === '1' ? '主题' : '地址'">
                                <el-input
                                    v-model="viewChannelData.address"
                                    readonly
                                    size="mini"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row
                        v-if="viewChannelData.type === '1' ? false : true"
                        :gutter="30"
                    >
                        <el-col :span="12">
                            <el-form-item label="用户名">
                                <el-input
                                    v-model="viewChannelData.username"
                                    readonly
                                    size="mini"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col
                            v-if="viewChannelData.type === '1' ? false : true"
                            :span="12"
                        >
                            <el-form-item label="密码">
                                <el-input
                                    v-model="viewChannelData.password"
                                    size="mini"
                                    readonly
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="24">
                            <el-form-item
                                label="备注"
                                style="width:100%;"
                            >
                                <el-input
                                    v-model.trim="viewChannelData.remarks"
                                    readonly
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
                        @click="editCancelClick('viewChannelData')"
                    >取消</el-button>
                </span>
            </el-dialog>
            <!-- 展示数据通道列表弹框 -->
            <el-dialog
                v-drag-dialog
                title="查看通道信息"
                :visible.sync="showChannelDialogStatus"
                :show-close="false"
                width="850px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <div class="tool-pack clear-float pl-15 pr-15">
                    <div class="float-right">
                        <el-input
                            v-model="searchValueDataChannel"
                            style="width: 500px; margin-right: 20px"
                            clearable
                            size="mini"
                            maxlength="30"
                            class="search-imput"
                            placeholder="请输入搜索关键字"
                            @input="searchDataChannelClick()"
                        />
                        <el-button
                            style="margin-right: 10px"
                            size="mini"
                            icon="el-icon-search"
                            type="primary"
                            @click="searchDataChannelClick()"
                        >搜索</el-button>
                        <el-button
                            style="margin-right: 50px"
                            size="mini"
                            class="bt-class"
                            @click="resetDataChannelHandle()"
                        >重置</el-button>
                    </div>
                </div>
                <PageTable
                    :configuration="ChannelTableconfiguration"
                    :data-list="dataChannelList"
                    border
                    @onSelectChange="channelTableOnSelectChange"
                    @onSizeChange="channelTableonSizeChange"
                    @onCurrentChange="channelTableonCurrentChange"
                >
                    <!-- 状态 -->
                    <template #status="{scope}">
                        <!-- :disabled="!$has($route,'disable')" -->
                        <el-switch
                            v-model="scope.row.status"
                            disabled
                            active-color="#409eff"
                            inactive-color="#dcdfe6"
                            active-value="1"
                            inactive-value="0"
                        />
                    </template>
                    <!-- 类型 -->
                    <template #type="{scope}">
                        <span v-if="scope.row.type === '1'">mqtt</span>
                        <span v-if="scope.row.type === '2'">modbus</span>
                        <span v-if="scope.row.type === '3'">tcp</span>
                        <span v-if="scope.row.type === '4'">opcua</span>
                        <span v-if="scope.row.type === '5'">ftp</span>
                    </template>
                </PageTable>
                <span slot="footer">
                    <el-button
                        size="mini"
                        icon="el-icon-circle-close"
                        @click="selectedChannelCannelClick()"
                    >取消</el-button>
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-circle-check"
                        @click="selectedChannelConfirmClick()"
                    >确认</el-button>
                </span>
            </el-dialog>
            <!-- 展示数据模板列表弹框 -->
            <el-dialog
                v-drag-dialog
                title="查看模板信息"
                :visible.sync="showTemplateDialogStatus"
                :show-close="false"
                width="850px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <div class="tool-pack clear-float pl-15 pr-15">
                    <div class="float-right">
                        <el-input
                            v-model="searchValueDataTemplate"
                            clearable
                            style="width: 500px; margin-right: 20px"
                            size="mini"
                            maxlength="30"
                            class="search-imput"
                            placeholder="请输入搜索关键字"
                            @input="searchDataTemplatelClick()"
                        />
                        <el-button
                            style="margin-right: 10px"
                            size="mini"
                            icon="el-icon-search"
                            type="primary"
                            @click="searchDataTemplatelClick()"
                        >搜索</el-button>
                        <el-button
                            style="margin-right: 50px"
                            size="mini"
                            class="bt-class"
                            @click="resetDataTemplateHandle()"
                        >重置</el-button>
                    </div>
                </div>
                <PageTable
                    :configuration="templateTableConfiguration"
                    :data-list="dataTemplateListData"
                    border
                    @onSelectChange="templateTableOnSelectChange"
                    @onSizeChange="templateTableonSizeChange"
                    @onCurrentChange="templateTableonCurrentChange"
                >
                    <!-- 状态 -->
                    <template #status="{scope}">
                        <!-- :disabled="!$has($route,'disable')" -->
                        <el-switch
                            v-model="scope.row.status"
                            disabled
                            active-color="#409eff"
                            inactive-color="#dcdfe6"
                            active-value="1"
                            inactive-value="0"
                        />
                    </template>
                    <!-- 类型 -->
                    <template #type="{scope}">
                        <span v-if="scope.row.type === '1'">设备数据</span>
                        <span v-if="scope.row.type === '2'">工艺数据</span>
                        <span v-if="scope.row.type === '3'">程序数据</span>
                        <span v-if="scope.row.type === '4'">指令</span>
                    </template>
                </PageTable>
                <span slot="footer">
                    <el-button
                        size="mini"
                        @click="selectedTemplateCannelClick()"
                    >取消</el-button>
                    <el-button
                        type="primary"
                        size="mini"
                        @click="selectedTemplateConfirmClick()"
                    >确认</el-button>
                </span>
            </el-dialog>
            <!-- 新增弹框组件引入 -->
            <AddFieldConfig
                ref="AddFieldConfig"
                :add-template-item-list="editViewAddListData.dataTemplate.templateItemList"
                :default-template-data="comModelDialogTableList"
                @ConfirmClick="selectTemplateListConfirm"
            />
            <!-- 配置通道模板字段弹框组件 -->
            <DataChannelConfigDIalog
                ref="DataChannelConfigDIalog"
                :data-channel-name="communicationModalData.dataChannel.name"
                @SelectedChannelListConfirm="selectedChannelListConfirm"
            />
        </div>
    </vt-page>
</template>

<script>
     /**
     * @module 基础配置-Scada配置-通信模型配置
     * @author chebin
     */
import PageTable from '@/components/Table/index';
import AddFieldConfig from './AddFieldConfig'
import DataChannelConfigDIalog from './DataChannelConfigDIalog'
export default {
    components: {
        PageTable,
        AddFieldConfig,
        DataChannelConfigDIalog
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
            // 列表表格数据
            dataCommunicationModelList: [],
            // 通信列表表格配置项
            configuration: {
                propsList: [
                    {
                        prop: 'equipNo',
                        label: '设备编号',
                        slot: true,
                        sortable: true,
                        'min-width': 180,
                        fixed: 'left'
                    },
                    {
                        prop: 'templateName',
                        label: '模板名称',
                        slot: true,
                        sortable: true,
                        'min-width': 180,
                        fixed: 'left'
                    },
                    {
                        prop: 'templateType',
                        label: '模板类型',
                        sortable: true,
                        slot: true,
                        'min-width': 180,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        prop: 'channelName',
                        label: '通道名称',
                        slot: true,
                        sortable: true,
                        'min-width': 180,
                        fixed: 'left'
                    },
                    {
                        prop: 'channelType',
                        label: '通道类型',
                        sortable: true,
                        slot: true,
                        'min-width': 180,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        prop: 'handle',
                        label: '操作',
                        slot: true,
                        'width': 100,
                        fixed: 'left'
                    }

                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 50 // 当前列表数量
                },
                tableHeight: '0', // 表格高度
                paginationPack: true, //是否展示分页
                showSelect: false, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false // 加载标识
            },
            // 弹框中的表格数据
            templateItemList: [],
            // 编辑模态框的默认状态
            editCommunicationDialog: false,
            // 判断编辑、查看dialog是否可输入
            dialogStatus: '',
            // 确认按钮的loading状态
            channelConfirmLoading: false,
            // 表单验证信息
            templateFormRules: {
                equipId: [
                    {
                        required: true,
                        message: '名称不可以为空',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请选择类型',
                        trigger: 'change'
                    }
                ]
            },
            // 编辑默认信息
            editTemplateData: {
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
                port: null,
                id: null
            },
            // 选择的数据通道名称
            selectedChannelName: '',
            //选择数据通道表格的搜索内容
            searchValueDataChannel: '',
            //选择数据模板表格的搜索内容
            searchValueDataTemplate: '',
            // 选择的数据模板名称
            selectedTemplateName: '',
            // 新增要添加的数据
            addTemplateData: {},
            // 设备编号全部数据
            equipNoAll: [],
            // 设备编号筛选数据
            equipNoFilterList: [],
            // 设备编号远程搜索loading开关标识
            equipNoAllLoadingToggle: false,
            // 弹框表格上部类型下拉数据
            communicationTypesList: [
                {
                    label: '采集',
                    value: 1
                },
                {
                    label: '下发',
                    value: 2
                }
            ],
            // 点击模板名称查看模板配置信息弹框显示状态
            viewTemplateDialog: false,
            // 模板配置信息
            showTemplateData: {
                name: null,
                type: null,
                remarks: null,
                status: null,
                templateItemList: [
                    {
                        fieldBizName: null,
                        fieldDesc: null,
                        fieldName: null,
                        fieldType: null,
                        templateId: null
                    }
                ]
            },
            // 查看模板配置模态框表格配置项
            modalDialogconfiguration: {
                propsList: [
                    {
                        prop: 'fieldName',
                        label: '名称',
                        sortable: true,
                        'min-width': 100,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldBizName',
                        label: '业务名称',
                        sortable: true,
                        'min-width': 130,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldType',
                        label: '类型',
                        sortable: true,
                        'min-width': 130,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        label: '描述',
                        prop: 'fieldDesc',
                        // sortable: true,
                        'min-width': 100,
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
            // 查看模板信息后的下拉选择的列表
            modalDialogconfigSelectedList: {},
            // 查看模板配置模态框表格内部的下拉数据
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
            ],
            //点击模板名称查看模板配置信息弹框显示状态
            viewChanneleDialog: false,
            // 查看通道配置模态框配置项
            viewChannelData: {
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
                port: null,
                id: null
            },
            // 查看通道信息弹框中下拉
            viewChanneltypesList: [
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
            ],
            // 查看模板信息弹框下拉
            viewTemplateTypesList: [
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
            //展示通道列表表格配置项
            ChannelTableconfiguration: {
                propsList: [
                    {
                        prop: 'name',
                        label: '名称',
                        sortable: true,
                        fixed: 'left'
                    },
                    {
                        prop: 'type',
                        label: '类型',
                        slot: true,
                        sortable: true,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        prop: 'status',
                        label: '状态',
                        slot: true,
                        fixed: 'left'
                    },
                    {
                        prop: 'remarks',
                        label: '备注',
                        fixed: 'left'
                    }
                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 50 // 当前列表数量
                },
                tableHeight: '600', // 表格高度
                paginationPack: true, //是否展示分页
                showSelect: true, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false, // 加载标识
                radio: true
            },
            // 展示数据模板表格配置项
            templateTableConfiguration: {
                propsList: [
                    {
                        prop: 'name',
                        label: '名称',
                        sortable: true,
                        fixed: 'left'
                    },
                    {
                        prop: 'type',
                        label: '类型',
                        slot: true,
                        sortable: true,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        prop: 'status',
                        label: '状态',
                        slot: true,
                        fixed: 'left'
                    },
                    {
                        prop: 'remarks',
                        label: '备注',
                        fixed: 'left'
                    }

                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 50 // 当前列表数量
                },
                tableHeight: '600', // 表格高度
                paginationPack: true, //是否展示分页
                showSelect: true, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false, // 加载标识
                radio: true
            },
            // 通道列表表格数据
            dataChannelList: [],
            // 数据模板表格数据
            dataTemplateListData: [],
            // 展示通道列表弹出框状态
            showChannelDialogStatus: false,
            // 展示数据模板列表弹出框状态
            showTemplateDialogStatus: false,
            // 字段通道配置的表格配置
            comModelDialogTableConfig: {
                propsList: [
                    {
                        prop: 'fieldName',
                        label: '名称',
                        sortable: true,
                        // 'min-width': 80,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldBizName',
                        label: '业务名称',
                        sortable: true,
                        // 'width': 80,
                        fixed: 'left'
                    },
                    {
                        prop: 'fieldType',
                        label: '类型',
                        sortable: true,
                        // 'width': 80,
                        fixed: 'left',
                        align:'center'
                    },
                    {
                        prop: 'fieldDesc',
                        label: '描述',
                        // sortable: true,
                        // 'min-width': 80,
                        fixed: 'left'
                    },
                    {
                        prop: 'name',
                        label: '数据通道',
                        sortable: true,
                        // 'min-width': 80,
                        slot: true,
                        fixed: 'left'
                    },
                    {
                        prop: 'handle',
                        label: '操作',
                        slot: true,
                        'width': 80,
                        fixed: 'left'
                    }
                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize:50 // 当前列表数量
                },
                tableHeight: '400', // 表格高度
                paginationPack: false, //是否展示分页
                showSelect: false, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false // 加载标识
            },
            // 根据id获取的通信模型数据
            communicationModalData: {
                itemList: [],
                type: null,
                dataTemplate: {
                    name: ''
                },
                dataChannel: {
                    name: ''
                }
            },
            // 字段通道配置数据列表
            comModelDialogTableList: [],
            propTemplateId: null,
            // 编辑、查看、新增 列表详情
            editViewAddListData: {
                templateId: null,
                equipNo: '',
                equipId: null,
                id: null,
                type: null,
                itemList: [],
                dataTemplate: {
                    name: '',
                    templateItemList: []
                },
                dataChannel: {
                    name: ''
                }
            },
            //设备编号
            rowEquipNo: '',
            // 存贮表格某一行的索引值
            tableIndex: null,
            // 存储列表的id给itemList[]，使用
            saveParentId: null
        }
    },
    mounted () {
        setTimeout(() => {
            this.getCommunicationModelData();
            this.configuration.tableHeight = `${document.querySelector('.communicationModelConfig').offsetHeight - 150}px`;
        console.log('this.configuration.tableHeight', this.configuration.tableHeight)
        }, 0)
    },
    methods: {
        // 获取全部设备编号
        getEquipNoAll () {
            let params = {fuzzyEquipNo: ''};
            return this.$service('GET', '/SERVICE-SCADA/api/equip/{fuzzyEquipNo}').then(res => {
                let resolveRes = _.cloneDeep(res);
                this.equipNoAll = resolveRes.map(item => {
                    return {label: item.equipNo, id: item.id};
                });
                this.equipNoFilterList = _.cloneDeep(this.equipNoAll)
            })
        },
        // 点击新增按钮
        addChannelListClick () {
            // 获取全部设备编号
            this.getEquipNoAll()
            this.dialogStatus = 'add'
            this.editCommunicationDialog = true
            this.communicationModalData.type = null
            this.communicationModalData.itemList = []
            this.communicationModalData.dataTemplate.name = ''
            this.communicationModalData.dataTemplate = {}
            this.communicationModalData.dataChannel.name = {}
            this.communicationModalData.dataChannel = {}
            // --------------------------------------------------------
            this.editViewAddListData = {
                templateId: null,
                equipNo: '',
                equipId: null,
                // id: null,
                type: null,
                itemList: [],
                dataTemplate: {
                    name: '',
                    templateItemList: []
                },
                dataChannel: {
                    name: ''
                }
            }
        },
        // 点击搜索按钮
        searchClick (val) {
            this.searchValue = val;
            this.configuration.loading = true;
            let params = {
                pageNum: this.configuration.pagination.pageNum,
                pageSize: this.configuration.pagination.pageSize,
                ...val
            };
            this.$service('POST', '/SERVICE-SCADA/api/communication/page', params).then(res => {
                this.dataCommunicationModelList = _.cloneDeep(res.list);
                this.configuration.pagination.total = res.total;
                this.configuration.loading = false;
            })
        },
        // 点击重置按钮
        resetHandle () {
            this.searchValue = {
                keywords: ''
            };
            this.getCommunicationModelData();
        },
        // 获取通信模型配置数据列表数据
        getCommunicationModelData () {
            this.configuration.loading = true;
            let params = {
                pageNum: this.configuration.pagination.pageNum,
                pageSize: this.configuration.pagination.pageSize,
                queryVO: {}
            };
            this.$service('POST', '/SERVICE-SCADA/api/communication/page', params).then(res => {
                this.dataCommunicationModelList = _.cloneDeep(res.list);
                this.configuration.pagination.total = res.total;
                this.configuration.loading = false;
            })
        },
        // 表格内部下拉选择事件
        onSelectChange () {
        },
        // 通道状态开关切换
        channelStatusSwitch (row) {
            this.$service('PUT', '/SERVICE-SCADA/api/template/updateStatus/{id}', {id: row.id}).then(res => {
                if (row.status === '1') {
                    this.getCommunicationModelData();
                    this.$message.success('启用成功')
                } else {
                    this.getCommunicationModelData();
                    this.$message('已停用')
                }
            }).catch(res => {
                row.status = '1';
            })
        },
        // 删除操作
        moveDownClick (row) {
            this.$confirm(
                `确定要删除此条数据吗？`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                this.$service('DELETE', '/SERVICE-SCADA/api/communication/{id}', {id: row.id}).then(res => {
                    this.$message.success('操作成功')
                    this.getCommunicationModelData()
                }).catch(err => {
                    this.$message.error(err)
                })
            })
        },
        //清空input值
        clearValue () {
            this.editViewAddListData.dataChannel = {};
            this.communicationModalData.dataChannel = {};
            this.modalDialogconfigSelectedList = {};
        },
        // 编辑按钮点击事件
        editCommunicationClick (row) {
            this.getEquipNoAll()
            this.editViewAddListData.equipNo = row.equipNo;
            this.dialogStatus = 'edit'
            this.saveParentId = row.id;
            this.editViewAddListData.itemList.length = 0;
            this.editViewAddListData.templateId = row.id;
            this.editViewAddListData.dataTemplate.templateItemList.length = 0;
            this.comModelDialogTableList.length = 0;
            this.editViewAddListData.dataChannel = {};
            this.$service('GET', '/SERVICE-SCADA/api/communication/{id}', {id: row.id}).then(res => {
                this.editViewAddListData.type = res.type;
                this.editViewAddListData.id = res.id;
                this.communicationModalData = _.cloneDeep(res)
                this.editViewAddListData.dataTemplate.name = _.cloneDeep(res.dataTemplate.name)
                this.editViewAddListData.dataTemplate.id = _.cloneDeep(res.dataTemplate.id)
                this.editViewAddListData.dataTemplate.remarks = _.cloneDeep(res.dataTemplate.remarks)
                this.editViewAddListData.dataTemplate.status = _.cloneDeep(res.dataTemplate.status)
                this.editViewAddListData.dataTemplate.type = _.cloneDeep(res.dataTemplate.type)
                this.editViewAddListData.templateId = res.templateId;
                this.editViewAddListData.dataChannel = _.cloneDeep(res.dataChannel);
                for (let item of res.itemList) {
                    this.editViewAddListData.itemList.push(item);
                }
                for (let item of res.dataTemplate.templateItemList) {
                    this.editViewAddListData.dataTemplate.templateItemList.push(item);
                }
                for (let item of this.editViewAddListData.dataTemplate.templateItemList) {
                    for (let i of this.editViewAddListData.itemList) {
                        if (item.id === i.templateItemId) {
                            this.comModelDialogTableList.push(item)
                        }
                    }
                }
                for (let item of this.comModelDialogTableList) {
                    item.name = '';
                }
                for (var i = 0; i < this.editViewAddListData.itemList.length; i++) {
                    this.comModelDialogTableList[i].name = _.cloneDeep((this.editViewAddListData.itemList)[i].dataChannel.name)
                }
                this.editCommunicationDialog = true;
                this.editViewAddListData.equipId = res.equipId;
            })
        },
        // 查看按钮点击数件
        async viewChannelClick (row) {
            this.dialogStatus = 'view'
            let equipNoAll = await this.$service('GET', '/SERVICE-SCADA/api/equip/{fuzzyEquipNo}')
            let resolveRes = _.cloneDeep(equipNoAll);
            this.equipNoAll = resolveRes.map(item => {
                return {label: item.equipNo, id: item.id};
            });
            this.saveParentId = row.id;
            this.editViewAddListData.itemList.length = 0;
            this.editViewAddListData.templateId = row.id;
            this.editViewAddListData.dataTemplate.templateItemList.length = 0;
            this.comModelDialogTableList.length = 0;
            this.editViewAddListData.dataChannel = {};
            this.editViewAddListData.equipNo = row.equipNo;
            this.$service('GET', '/SERVICE-SCADA/api/communication/{id}', {id: row.id}).then(res => {
                this.editViewAddListData.equipId = res.equipId;
                // 有了ID之后进行一次填充option
                let tmp = this.equipNoAll.filter((item) => item.id === res.equipId)
                this.equipNoFilterList = tmp
                this.editViewAddListData.type = res.type;
                this.editViewAddListData.id = res.id;
                this.communicationModalData = _.cloneDeep(res)
                this.editViewAddListData.dataTemplate.name = _.cloneDeep(res.dataTemplate.name)
                this.editViewAddListData.dataTemplate.id = _.cloneDeep(res.dataTemplate.id)
                this.editViewAddListData.dataTemplate.remarks = _.cloneDeep(res.dataTemplate.remarks)
                this.editViewAddListData.dataTemplate.status = _.cloneDeep(res.dataTemplate.status)
                this.editViewAddListData.dataTemplate.type = _.cloneDeep(res.dataTemplate.type)
                this.editViewAddListData.templateId = res.templateId;
                this.editViewAddListData.dataChannel = _.cloneDeep(res.dataChannel);
                for (let item of res.itemList) {
                    this.editViewAddListData.itemList.push(item);
                }
                for (let item of res.dataTemplate.templateItemList) {
                    this.editViewAddListData.dataTemplate.templateItemList.push(item);
                }
                for (let item of this.editViewAddListData.dataTemplate.templateItemList) {
                    for (let i of this.editViewAddListData.itemList) {
                        if (item.id === i.templateItemId) {
                            this.comModelDialogTableList.push(item)
                        }
                    }
                }
                for (let item of this.comModelDialogTableList) {
                    item.name = '';
                }
                for (var i = 0; i < this.editViewAddListData.itemList.length; i++) {
                    this.comModelDialogTableList[i].name = _.cloneDeep((this.editViewAddListData.itemList)[i].dataChannel.name)
                }
                this.editCommunicationDialog = true;
            })
        },
        // 编辑类型下拉数据变化
        typesListsChange (val) {
        },
        // 确认按钮
        editConfirmClick (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.dialogStatus === 'add') {
                        this.editViewAddListData.templateId = this.editViewAddListData.dataTemplate.id;
                        this.editViewAddListData.channelId = this.editViewAddListData.dataChannel.id;
                        // 判断是否选择了数据通道
                        let flag = true
                        if (this.editViewAddListData.itemList.length > 0) {
                            for (let item of this.editViewAddListData.itemList) {
                                if (item.channelId) {
                                    flag = true
                                } else {
                                    flag = false;
                                }
                            }
                        }
                        if (this.editViewAddListData.dataTemplate.hasOwnProperty('id') && (this.editViewAddListData.dataChannel.hasOwnProperty('id') || (this.editViewAddListData.itemList.length > 0 && flag === true))) {
                            this.$service('POST', '/SERVICE-SCADA/api/communication', this.editViewAddListData).then(res => {
                                this.$message.success('添加成功')
                                this.editCommunicationDialog = false
                                this.$refs[formName].resetFields();
                                this.editViewAddListData.itemList.length = 0;
                                this.editViewAddListData.equipId = null;
                                this.editViewAddListData.templateId = null;
                                this.editViewAddListData.dataTemplate.templateItemList.length = 0;
                                this.comModelDialogTableList.length = 0;
                                this.editViewAddListData.dataChannel = {};
                                this.getCommunicationModelData()
                            })
                        } else {
                            this.$message.error('请确保字段配置完整再执行该操作')
                        }
                    }
                    if (this.dialogStatus === 'edit') {
                        if (this.editViewAddListData.dataChannel.name === '') {
                            this.editViewAddListData.dataChannel = {};
                        }
                        let flag = true
                        if (this.editViewAddListData.itemList.length > 0) {
                            for (let item of this.editViewAddListData.itemList) {
                                if (item.channelId) {
                                    flag = true
                                } else {
                                    flag = false;
                                }
                            }
                        }
                        this.editViewAddListData.channelId = this.editViewAddListData.dataChannel.id;
                        if (this.editViewAddListData.dataTemplate.hasOwnProperty('id') && (this.editViewAddListData.dataChannel.hasOwnProperty('id') || (this.editViewAddListData.itemList.length > 0 && flag === true))) {
                            this.$service('POST', '/SERVICE-SCADA/api/communication', this.editViewAddListData).then(res => {
                                this.$message.success('编辑成功')
                                this.$refs[formName].resetFields();
                                // this.editDialogEditCancelClick(formName)
                                this.editCommunicationDialog = false
                                this.editViewAddListData.itemList.length = 0;
                                this.editViewAddListData.equipId = null;
                                this.editViewAddListData.templateId = null;
                                // this.editViewAddListData.type = null;
                                this.editViewAddListData.dataTemplate.templateItemList.length = 0;
                                this.comModelDialogTableList.length = 0;
                                this.editViewAddListData.dataChannel = {};
                                this.getCommunicationModelData()
                            })
                        } else {
                            this.$message.error('请确保字段配置完整再执行该操作')
                        }
                    }
                }
            })
        },
        // 取消按钮
        editCancelClick (formName) {
            if (formName) {
                this.$refs[formName].resetFields();
                this.editCommunicationDialog = false;
                this.viewTemplateDialog = false;
                this.viewChanneleDialog = false;
            } else {
                this.$refs[formName].resetFields();
                this.editCommunicationDialog = false;
                this.viewTemplateDialog = false;
                this.viewChanneleDialog = false;
            }
        },
        // 分页个数
        onSizeChange (val) {
            this.configuration.pagination.pageSize = val;
            this.getCommunicationModelData();
        },
        // 分页页数改变
        onCurrentChange (val) {
            this.configuration.pagination.pageNum = val;
            this.getCommunicationModelData();
        },
        // 点击模板名称查看模板信息
        showTemplateInformation (row) {
            this.dialogStatus = 'view'
            this.viewTemplateDialog = true
            this.$service('GET', '/SERVICE-SCADA/api/template/{id}', {id: row.templateId}).then(res => {
                this.showTemplateData = _.cloneDeep(res)
            })
        },
        // 点击通道名称查看通道信息
        showChannelInformation (row) {
            this.viewChanneleDialog = true
            this.$service('GET', '/SERVICE-SCADA/api/channel/{id}', {id: row.channelId}).then(res => {
                this.viewChannelData = _.cloneDeep(res)
            })
        },
        // 点击数据通道input弹出数据通道列表
        showChannelDialog () {
            if (this.comModelDialogTableList.length === 0 && this.dialogStatus !== 'view') {
                this.showChannelDialogStatus = true;
                this.getChannelListData();
            }
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
        // 搜索通道列表数据
        searchDataChannelClick () {
            let params = {
                pageNum: this.ChannelTableconfiguration.pagination.pageNum,
                pageSize: this.ChannelTableconfiguration.pagination.pageSize,
                keywords: this.searchValueDataChannel
            };
            this.$service('POST', '/SERVICE-SCADA/api/channel/page', params).then(res => {
                this.dataChannelList = _.cloneDeep(res.list);
                this.ChannelTableconfiguration.pagination.total = _.cloneDeep(res.total)
            })
        },
        // 重置数据通道搜索条件
        resetDataChannelHandle () {
            this.searchValueDataChannel = '';
            this.getChannelListData();
        },
        // 数据通道表格单页数据个数改变
        channelTableonSizeChange (val) {
            this.ChannelTableconfiguration.pagination.pageSize = val;
            this.getChannelListData()
        },
        // 数据通道当前页数改变
        channelTableonCurrentChange (val) {
            this.ChannelTableconfiguration.pagination.pageNum = val;
            this.getChannelListData()
        },
        // 通道列表表格勾选事件
        channelTableOnSelectChange (selectValue) {
            this.modalDialogconfigSelectedList = {}
            this.modalDialogconfigSelectedList = _.cloneDeep(selectValue[0]);
        },
        // 确认按钮 选择数据通道
        selectedChannelConfirmClick () {
            // this.showChannelDialogStatus = false;
            if (!(this.modalDialogconfigSelectedList.hasOwnProperty('id'))) {
                this.$message.warning('请勾选要配置的数据')
            } else {
                this.communicationModalData.dataChannel = {};
                this.communicationModalData.dataChannel = _.cloneDeep(this.modalDialogconfigSelectedList)
                this.editViewAddListData.dataChannel = _.cloneDeep(this.modalDialogconfigSelectedList)
                this.showChannelDialogStatus = false;
            }
        },
        // 点击数据模板input输入框弹出数据模板列表
        showTemplateDialog () {
            if (this.dialogStatus !== 'view') {
                this.showTemplateDialogStatus = true;
                this.getTemplatelListData();
            }
        },
        // 获取数据模板数据
        getTemplatelListData () {
            this.templateTableConfiguration.loading = true;
            let params = {
                pageNum: this.templateTableConfiguration.pagination.pageNum,
                pageSize: this.templateTableConfiguration.pagination.pageSize,
                queryVO: {}
            };
            this.$service('POST', '/SERVICE-SCADA/api/template/page', params).then(res => {
                this.dataTemplateListData = _.cloneDeep(res.list);
                this.templateTableConfiguration.pagination.total = res.total;
                this.templateTableConfiguration.loading = false;
            })
        },
        // 搜索数据模板数据
        searchDataTemplatelClick () {
            let params = {
                pageNum: this.templateTableConfiguration.pagination.pageNum,
                pageSize: this.templateTableConfiguration.pagination.pageSize,
                keywords: this.searchValueDataTemplate
            };
            this.$service('POST', '/SERVICE-SCADA/api/template/page', params).then(res => {
                this.dataTemplateListData = _.cloneDeep(res.list);
            })
        },
        // 重置数据模板列表
        resetDataTemplateHandle () {
            this.searchValueDataTemplate = ''
            this.getTemplatelListData()
        },
        // 单页数据个数改变
        templateTableonSizeChange (val) {
            this.templateTableConfiguration.pagination.pageSize = val;
            this.getTemplatelListData()
        },
        // 页数改变
        templateTableonCurrentChange (val) {
            this.templateTableConfiguration.pagination.pageNum = val;
            this.getTemplatelListData()
        },
        // 确认按钮 选择模板
        selectedTemplateConfirmClick () {
            if (!(this.modalDialogconfigSelectedList.hasOwnProperty('id'))) {
                this.$message.warning('请勾选要配置的数据')
            } else {
                this.editViewAddListData.dataTemplate = {}
                this.communicationModalData.dataTemplate = {};
                this.communicationModalData.dataTemplate = _.cloneDeep(this.modalDialogconfigSelectedList)
                this.editViewAddListData.dataTemplate = _.cloneDeep(this.modalDialogconfigSelectedList)
                // this.editViewAddListData.templateId = _.cloneDeep(this.modalDialogconfigSelectedList.id)
                if (this.dialogStatus === 'edit') {
                    this.communicationModalData.dataTemplate = _.cloneDeep(this.modalDialogconfigSelectedList)
                    this.editViewAddListData.dataTemplate = _.cloneDeep(this.modalDialogconfigSelectedList)
                    this.editViewAddListData.templateId = _.cloneDeep(this.modalDialogconfigSelectedList.id)
                }
                this.showTemplateDialogStatus = false;
                if (this.dialogStatus === 'add') {
                    this.editViewAddListData.dataTemplate = _.cloneDeep(this.modalDialogconfigSelectedList)
                }
            }
        },
        // 数据模板表格勾选事件
        templateTableOnSelectChange (selectValue) {
            this.modalDialogconfigSelectedList = {}
            this.modalDialogconfigSelectedList = _.cloneDeep(selectValue[0]);
        },
        // 数据通道取消
        selectedChannelCannelClick () {
            this.showChannelDialogStatus = false;
        },
        // 数据模板取消
        selectedTemplateCannelClick () {
            this.showTemplateDialogStatus = false;
        },
        // 字段通道配置表格点击新增后选择数据
        comDialogTableOnSelectChange () {},
        //筛选设备编号字段数据
        remoteMethod (query) {
            if (query !== '') {
                this.equipNoAllLoadingToggle = true;
                setTimeout(() => {
                    this.equipNoAllLoadingToggle = false;
                    this.equipNoFilterList = this.equipNoAll.filter(item => {
                        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.equipNoFilterList = this.equipNoAll
            }
        },
        // 弹框的点击新增
        addChannelConfigClick () {
            if (this.communicationModalData.dataChannel.name) {
                this.$message.warning('模板已选择数据通道，无需给字段配置通道')
            }
            if (!this.communicationModalData.dataTemplate.name) {
                this.$message.warning('请选择数据模板')
            }
            if (!this.communicationModalData.dataChannel.name && this.communicationModalData.dataTemplate.name) {
                this.$refs.AddFieldConfig.addFieldConfigDialog = true;
            }
        },
        // 点击调用组件的通道列表
        showChannelConfigDialog (scope) {
            if (this.dialogStatus !== 'view') {
                this.tableIndex = scope.$index;
                this.$refs.DataChannelConfigDIalog.viewChanneleDialog = true;
            }
        },
        // 子组件选择通道数据确认操作
        selectedChannelListConfirm (channeldataList) {
            let templist = {
                name: channeldataList.name,
                fieldBizName: this.comModelDialogTableList[this.tableIndex].fieldBizName,
                fieldDesc: this.comModelDialogTableList[this.tableIndex].fieldDesc,
                fieldName: this.comModelDialogTableList[this.tableIndex].fieldName,
                fieldType: this.comModelDialogTableList[this.tableIndex].fieldType,
                id: this.comModelDialogTableList[this.tableIndex].id,
                templateId: this.comModelDialogTableList[this.tableIndex].templateId
            }
            this.$set(this.comModelDialogTableList, this.tableIndex, templist)
            let tempChannelId = channeldataList.id;
            this.editViewAddListData.itemList[this.tableIndex].channelId = channeldataList.id;
            this.$refs.DataChannelConfigDIalog.viewChanneleDialog = false;
        },
        // 添加字段配置点击新增选择模板后的确认(来自组件)
        selectTemplateListConfirm (configTableList) {
            for (let item of configTableList) {
                if (this.dialogStatus === 'edit') {
                    this.editViewAddListData.itemList.push({'templateItemId': item.id, 'parentId': this.saveParentId})
                }
                if (this.dialogStatus === 'add') {
                    this.editViewAddListData.itemList.push({'templateItemId': item.id})
                }
            }
        },
        // 删除模板配置
        modelMoveDownClick (row) {
            let tempId = row.id;
            for (let item of this.comModelDialogTableList) {
                if (tempId === item.id) {
                    this.$confirm(
                        '确定删除此条配置吗？',
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                        let tempIndex = this.comModelDialogTableList.indexOf(item)
                        this.comModelDialogTableList.splice(tempIndex, 1);
                        this.editViewAddListData.itemList.splice(tempIndex, 1)
                        this.$message.success('删除成功')
                    })
                }
            }
        },
        // 编辑/查看/新增 弹框 取消
        editDialogEditCancelClick (formName) {
            this.$refs[formName].resetFields();
            this.editCommunicationDialog = false
            this.editViewAddListData = {
                equipNo: '',
                equipId: null,
                id: null,
                type: null,
                templateId: null,
                itemList: [],
                dataTemplate: {
                    name: '',
                    templateItemList: []
                },
                dataChannel: {
                    name: ''
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
    margin-right: 5px;
}
.tableName {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
}
.getwayList-page {
    // ?主体样式
    position: relative;
    min-height: 100%;
    width: 100%;
    border-radius: 8px;

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
