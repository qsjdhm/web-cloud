<template>
    <vt-page
        type="one"
        class-name="rest-page"
    >
        <bs-table
            ref="BsTable"
            highlight-current-row
            :bs-data="bsData"
        >
            <template #operateHeader>
                <el-button
                    v-has="{role: 'add'}"
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    @click="addWorkCenterClick()"
                >新增</el-button>
            </template>
            <template #code="{scope}">
                <span
                    class="table-text"
                    @click="viewWorkCenterClick(scope.row)"
                >{{ scope.row.code }}</span>
            </template>
            <template #type="{scope}">
                <span v-if="scope.row.type === 'WORKSHOP'">车间</span>
                <span v-if="scope.row.type === 'WORKLINE'">产线</span>
                <span v-if="scope.row.type === 'STATION'">工位</span>
                <span v-if="scope.row.type === 'WORKGROUP'">工作组</span>
            </template>
            <template #userIds="{scope}">
                <span>{{ tableListUserDataJudge(scope.row.userIds) }}</span>
            </template>
            <template #status="{scope}">
                <el-switch
                    :disabled="!$has($route,'disable')"
                    :value="scope.row.status"
                    active-color="#409eff"
                    inactive-color="#dcdfe6"
                    active-value="1"
                    inactive-value="0"
                    @change="enbaleWorkCenterClick(scope.row)"
                />
            </template>
            <template #operate="{scope}">
                <el-button
                    v-has="{role: 'edit'}"
                    type="text"
                    @click="editWorkCenterClick(scope.row)"
                >编辑
                </el-button>
                <!-- <svg-icon icon-class="export" /></el-button> -->
            </template>
        </bs-table>
        <!-- 新增弹框 -->
        <el-dialog
            v-drag-dialog
            title="新增工作中心信息"
            width="500px"
            :visible.sync="addWorkCenterDialog"
            :show-close="false"
            :close-on-click-modal="false"
            close-on-press-escape
        >
            <el-form
                ref="addWorkCenterData"
                label-position="top"
                :model="addWorkCenterData"
                :rules="WorkCenterData"
            >
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item
                            label="工作中心名称"
                            prop="name"
                        >
                            <el-input
                                v-model.trim="addWorkCenterData.name"
                                size="mini"
                                placeholder="请输入工作中心名称"
                                clearable
                                maxlength="30"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="编码"
                            prop="code"
                        >
                            <el-input
                                v-model.trim="addWorkCenterData.code"
                                size="mini"
                                placeholder="请输入工作中心编码"
                                clearable
                                maxlength="30"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="类型"
                            prop="type"
                        >
                            <el-select
                                v-model="addWorkCenterData.type"
                                size="mini"
                                placeholder="请选择工作中心类型"
                                @change="getWorkcenterData($event)"
                            >
                                <el-option
                                    v-for="(item, index) in types"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="父级中心"
                            prop="parentId"
                        >
                            <el-select
                                v-model="addWorkCenterData.parentId"
                                size="mini"
                                placeholder="请选择父级中心"
                            >
                                <el-option
                                    v-for="item in workCenterParentSelect"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            :label="addWorkCenterData.type === 'STATION' ? '关联人员' : '负责人'"
                            prop="userIds"
                        >
                            <el-select
                                v-model="addWorkCenterData.userIds"
                                size="mini"
                                multiple
                                :multiple-limit="addWorkCenterData.type === 'STATION' ? 0 : 1"
                                placeholder="请选择关联人员"
                            >
                                <el-option
                                    v-for="item in workCenterUserSelect"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            v-if="addWorkCenterData.type === 'STATION'"
                            label="关联设备"
                            prop="equipmentIds"
                        >
                            <el-select
                                v-model="addWorkCenterData.equipmentIds"
                                size="mini"
                                filterable
                                placeholder="请选择关联设备"
                            >
                                <el-option
                                    v-for="item in workCenterEquipmentSelect"
                                    :key="item.id"
                                    :label="item.no"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer">
                <el-button
                    size="mini"
                    icon="el-icon-circle-close"
                    @click="addCancelClick('addWorkCenterData')"
                >取消</el-button>
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-circle-check"
                    :loading="workCenterLoading"
                    @click="addConfirmClick('addWorkCenterData')"
                >确认</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹框 -->
        <el-dialog
            v-drag-dialog
            :title="`${dialogStatus === 'edit' ? '编辑工作中心' : '查看工作中心'}`"
            width="700px"
            :visible.sync="editWorkCenterDialog"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <el-form
                ref="editWorkCenterData"
                label-position="top"
                :model="editWorkCenterData"
                :rules="WorkCenterData"
            >
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item
                            label="名称"
                            prop="name"
                        >
                            <el-input
                                v-model.trim="editWorkCenterData.name"
                                size="mini"
                                placeholder="请输入工作中心名称"
                                clearable
                                maxlength="30"
                                :disabled="dialogStatus === 'view'"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            label="编码"
                            prop="code"
                        >
                            <el-input
                                v-model.trim="editWorkCenterData.code"
                                size="mini"
                                placeholder="请输入工作中心编码"
                                clearable
                                maxlength="30"
                                :disabled="dialogStatus === 'view'"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            label="类型"
                            prop="type"
                        >
                            <el-select
                                v-model="editWorkCenterData.type"
                                size="mini"
                                placeholder="请选择工作中心类型"
                                disabled
                                @change="getWorkcenterData($event)"
                            >
                                <el-option
                                    v-for="(item, index) in types"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item
                            label="父级中心"
                            prop="parentId"
                        >
                            <el-select
                                v-model="editWorkCenterData.parentId"
                                size="mini"
                                :disabled="dialogStatus === 'view'"
                                placeholder="请选择父级中心"
                            >
                                <el-option
                                    v-for="item in workCenterParentSelect"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            :label="editWorkCenterData.type === 'STATION' ? '关联人员' : '负责人'"
                            prop="userIds"
                        >
                            <el-select
                                v-model="editWorkCenterData.userIds"
                                size="mini"
                                multiple
                                :disabled="dialogStatus === 'view'"
                                :multiple-limit="editWorkCenterData.type === 'STATION' ? 0 : 1"
                                placeholder="请选择关联人员"
                            >
                                <el-option
                                    v-for="item in workCenterUserSelect"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            v-if="editWorkCenterData.type === 'STATION'"
                            label="关联设备"
                            prop="equipmentIds"
                        >
                            <el-select
                                v-model="editWorkCenterData.equipmentIds"
                                size="mini"
                                filterable
                                :disabled="dialogStatus === 'view'"
                                placeholder="请选择关联设备"
                                @change="onChange"
                            >
                                <el-option
                                    v-for="item in workCenterEquipmentSelect"
                                    :key="item.id"
                                    :label="item.no"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer">
                <el-button
                    size="mini"
                    icon="el-icon-circle-close"
                    @click="editCancelClick('editWorkCenterData', editWorkCenterData)"
                >取消</el-button>
                <el-button
                    v-if="dialogStatus !== 'view'"
                    size="mini"
                    type="primary"
                    :loading="workCenterLoading"
                    icon="el-icon-circle-check"
                    @click="editConfirmClick('editWorkCenterData')"
                >确认</el-button>
            </span>
        </el-dialog>
    </vt-page>
</template>
<script>
/**
 * @module 基础配置-工作中心（迁移来自-机加云MES）
 * @author chebin
 */
import html2canvas from 'html2canvas';
import QRCode from 'qrcodejs2';
export default {
    data() {
        return {
            // ?搜索框默认
            searchValue: null,
            // ?类型搜索
            sortValue: null,
            // ?表格loading默认状态
            tableLoading: false,
            // ?表格高度
            workCenterHeight: 0,
            // ?工作中心列表数据
            workCenterList: [],
            // ?总条目数
            total: 0,
            // ?当前列表页
            currentPage: 1,
            // ?当前列表数量
            pageSize: 20,
            // ?新增工作中心dialog默认状态
            addWorkCenterDialog: false,
            // ?编辑工作中心dialog默认状态
            editWorkCenterDialog: false,
            // ?判断编辑, 查看dialog 是否可输入
            dialogStatus: '',
            // ?新增、编辑确定按钮
            workCenterLoading: false,
            // ?新增下拉菜单选项——父级中心
            workCenterParentSelect: [],
            // ?下拉菜单 —— 关联人员
            workCenterUserSelect: [],
            // ?下拉菜单 —— 关联设备
            workCenterEquipmentSelect: [],
            searchQuery: {},
            // ?工位类型
            // stationTypes: [
            //     { name: "质检", value: "QUALITYCHECK" },
            //     { name: "维修", value: "MAINTAIN" },
            //     { name: "工艺", value: "CRAFT" }
            // ],
            // ?是否关键工位
            // stationIsKeys: [
            //     { name: "是", value: "1" },
            //     { name: "否", value: "0" }
            // ],
            // ?类型选择
            types: [
                {
                    value: 'WORKSHOP',
                    label: '车间'
                },
                {
                    value: 'WORKLINE',
                    label: '产线'
                },
                {
                    value: 'STATION',
                    label: '工位'
                }
            ],
            // ?新增工作中心默认信息
            addWorkCenterData: {
                name: '',
                code: '',
                type: '',
                parentId: '',
                userIds: '',
                remarks: ''
                // equipmentIds: ''
                // stationIsKey: "1"
            },
            // ?编辑默认信息
            editWorkCenterData: {
                id: '',
                name: '',
                code: '',
                type: '',
                parentId: '',
                userIds: '',
                remarks: ''
                // equipmentIds: ''
                // stationIsKey: "1"
            },
            // ?验证信息
            WorkCenterData: {
                name: [
                    {
                        required: true,
                        message: '请输入工作中心名称',
                        trigger: 'blur'
                    }
                ],
                code: [
                    {
                        required: true,
                        message: '请输入工作中心编码',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请选择工作中心类型',
                        trigger: 'change'
                    }
                ],
                parentId: [
                    {
                        required: true,
                        message: '请选择工作中心父级中心',
                        trigger: 'blur'
                    }
                ],
                userIds: [
                    {
                        required: true,
                        message: '请选择工作中心关联人员',
                        trigger: 'blur'
                    }
                ],
                equipmentIds: [
                    {
                        required: true,
                        message: '请选择工作中心关联设备',
                        trigger: 'blur'
                    }
                ]
            },
            // ?工位名称
            stationName: null,
            // ?产线名称
            lineName: null,
            // ?工位属性
            stationVirtue: null,
            // // ?二维码信息
            // codeData: null,
            showTable: false,
            bsData: {
                searchConfig: {
                    fields: [
                        {
                            label: '类型',
                            value: '', // 可以穿默认值
                            type: 'SELECT',
                            options: [
                                {
                                    label: '车间',
                                    value: 'WORKSHOP'
                                },
                                {
                                    label: '产线',
                                    value: 'WORKLINE'
                                },
                                {
                                    label: '工位',
                                    value: 'STATION'
                                }
                            ],
                            key: 'type',
                            placeholder: '请选择类型'
                        },
                        {
                            label: '',
                            value: '', // 可以穿默认值
                            type: 'INPUT',
                            key: 'search',
                            placeholder: '请输入工作中心名称或编码'
                        }
                    ]
                },
                tableConfig: {
                    url: '/SERVICE-BUSINESS/api/workingCenter/page',
                    methods: 'get',
                    // 列配置
                    columns: [
                        {
                            type: 'index'
                        },
                        {
                            label: '编码',
                            prop: 'code',
                            slotName: 'code',
                            'min-width': 140
                        },
                        {
                            label: '工作中心名称',
                            prop: 'name',
                            'min-width': 140
                        },
                        {
                            label: '类型',
                            prop: 'type',
                            slotName: 'type',
                            'min-width': 140
                        },
                        {
                            label: '父级中心',
                            prop: 'parentName',
                            'min-width': 140
                        },
                        {
                            label: '关联人员',
                            prop: 'userIds',
                            slotName: 'userIds',
                            'min-width': 140
                        },
                        {
                            label: '状态',
                            prop: 'status',
                            slotName: 'status',
                            align: 'center',
                            width: 80
                        },
                        {
                            label: '操作',
                            slotName: 'operate',
                            align: 'center',
                            width: 60
                        }
                    ]
                }
            }
        };
    },
    watch: {
        workCenterList: {
            handler(val) {
                if (val && val.length > 0) {
                    this.showTable = false;
                    this.$nextTick(() => {
                        this.showTable = true;
                    });
                }
            },
            deep: true,
            immediate: true
        },
        editWorkCenterDialog(val) {
            if (val === true) {
                this.editWorkCenterData;
            }
        },
        editWorkCenterData(v) {
            if (v.type === 'STATION' && v.STATUS === 'view') {
                this.$nextTick(() => {
                    this.qrcode();
                });
            }
        }
    },
    async mounted() {
        // !表格高度
        // !获取工作中心列表信息
        // !关联人员
        this.getworkCenterUserSelect();
        // !关联设备
        this.getWorkCenterEquipment();
    },
    methods: {
        /**
         * @method 获取关联设备下拉列表
         */
        async getWorkCenterEquipment(val) {
            let params = {
                pageNum: 1,
                pageSize: 20
            };
            let res = await this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/equipment/distributeEquipList',
                params
            );
            let tmp = _.cloneDeep(res);
            if (val && val.equipment) {
                tmp.push(val.equipment);
            }
            this.workCenterEquipmentSelect = tmp;
        },
        onChange(val) {},
        // !列表关联人员数据处理
        tableListUserDataJudge(userIds) {
            let judegData = '';
            userIds.map(item => {
                this.workCenterUserSelect.map(userItem => {
                    if (item === userItem.id) {
                        judegData += ` ${userItem.name}`;
                    }
                });
            });
            return judegData;
        },
        // !新增按钮点击事件
        addWorkCenterClick() {
            this.addWorkCenterDialog = true;
        },
        // !新增确定按钮点击事件
        addConfirmClick(formName) {
            this.$refs[formName].validate(valid => {
                // ?将关联人员转换成数组
                let equipmentArr = [];
                equipmentArr.push(this.addWorkCenterData.equipmentIds);
                if (valid) {
                    let queryParams = {
                        ...this.addWorkCenterData,
                        equipmentIds: equipmentArr
                    };
                    this.workCenterLoading = true;
                    this.$service(
                        'POST',
                        '/SERVICE-BUSINESS/api/workingCenter',
                        queryParams
                    )
                        .then(resData => {
                            this.workCenterLoading = false;
                            this.addWorkCenterDialog = false;
                            this.$refs.BsTable.initTable();
                            this.$message.success('工作中心信息新增成功!');
                            this.$refs[formName].resetFields();
                        })
                        .catch(() => {
                            this.$refs[formName].resetFields();
                            this.workCenterLoading = false;
                            this.addWorkCenterDialog = false;
                        });
                }
            });
        },
        // !新增取消按钮点击事件
        addCancelClick(formName) {
            this.$refs[formName].resetFields();
            this.addWorkCenterDialog = false;
        },
        // !搜索按钮点击事件
        async searchClick(val) {
            this.searchQuery = val;
            this.tableLoading = true;
            let queryParams = {
                type: this.sortValue,
                search: this.searchValue,
                pageNum: 1,
                pageSize: this.pageSize
            };
            let resData = await this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/workingCenter/page',
                queryParams
            );
            // let resData = await this.$fetch(
            //     "working-center-controller/page-get",
            //     queryParams
            // );
            this.workCenterList = _.cloneDeep(resData.list);
            this.total = resData.total;
            this.tableLoading = false;
        },
        // !重置按钮点击事件
        resetClick() {
            this.searchQuery = {
                type: '',
                search: ''
            };
            // ?清空搜索内容,获取列表数据
            this.getWorkCenterList();
        },
        // !查看按钮点击事件
        async viewWorkCenterClick(row) {
            let res = await this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/workingCenter/getUpList',
                { type: row.type }
            );
            // let res = await this.$store.dispatch('WorkCenter/getWorkCenterSelect', {type: row.type})
            this.workCenterParentSelect = _.cloneDeep(res);
            this.getWorkCenterEquipment(row);
            this.dialogStatus = 'view';
            this.editWorkCenterData = { ...row };
            if (row && row.equipment) {
                this.editWorkCenterData.equipmentIds = row.equipment.id;
            }
            this.editWorkCenterDialog = true;
        },
        // !编辑按钮点击事件
        async editWorkCenterClick(row) {
            let res = await this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/workingCenter/getUpList',
                { type: row.type }
            );
            this.workCenterParentSelect = _.cloneDeep(res);
            this.getWorkCenterEquipment(row);
            this.dialogStatus = 'edit';
            delete row.children;
            this.editWorkCenterData = {
                ...row
            };
            if (row && row.equipment) {
                this.editWorkCenterData.equipmentIds = row.equipment.id;
            }
            this.editWorkCenterDialog = true;
        },
        // !编辑确定按钮点击事件
        editConfirmClick(formName) {
            this.$refs[formName].validate(valid => {
                // ?将关联人员转换成数组
                let equipmentArr = [];
                equipmentArr.push(this.editWorkCenterData.equipmentIds);
                let equipmentIds = _.cloneDeep(equipmentArr);
                if (valid) {
                    let query = {
                        ...this.editWorkCenterData,
                        equipmentIds: equipmentArr
                    };
                    if (query.equipment === null && query.type !== 'STATION') {
                        delete query.equipment;
                        delete query.equipmentIds;
                    }
                    this.workCenterLoading = true;
                    this.$service(
                        'PUT',
                        '/SERVICE-BUSINESS/api/workingCenter',
                        query
                    )
                        .then(() => {
                            this.workCenterLoading = false;
                            this.editWorkCenterDialog = false;
                            this.$refs.BsTable.initTable();
                            this.$message.success('工作中心信息编辑成功!');
                            this.$refs[formName].resetFields();
                        })
                        .catch(() => {
                            this.workCenterLoading = false;
                            this.editWorkCenterDialog = false;
                        });
                }
            });
        },
        // !编辑取消按钮点击事件
        editCancelClick(formName, val) {
            this.editWorkCenterDialog = false;
            this.$refs[formName].resetFields();
            // }
        },
        // !启停按钮点击事件
        enbaleWorkCenterClick(row) {
            let query = {
                id: row.id,
                status: row.status == '1' ? '0' : '1'
            };
            this.$service(
                'PUT',
                '/SERVICE-BUSINESS/api/workingCenter/statusUpdate',
                query
            )
                .then(data => {
                    row.status === '1'
                        ? this.$message.warning(`工作中心已停用`)
                        : this.$message.success(`工作中心已启用`);
                    this.$refs.BsTable.initTable();
                })
                .catch(err => {
                    if (err.code === 601) {
                        row.status = '1';
                    }
                });
        },
        // !选择类型, 调用父级中心数据接口
        async getWorkcenterData(e) {
            // ?选择类型的时候, 清空父级中心,关联人员,关联设备
            this.addWorkCenterData.parentId = null;
            this.addWorkCenterData.userIds = null;
            this.editWorkCenterData.parentId = null;
            this.editWorkCenterData.userIds = null;
            let res = await this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/workingCenter/getUpList',
                { type: e }
            );
            this.workCenterParentSelect = _.cloneDeep(res);
        },

        // !获取下拉菜单 —— 关联人员
        async getworkCenterUserSelect() {
            let query = {
                pageNum: 1,
                pageSize: 1000
            };
            let res = await this.$service(
                'GET',
                '/SERVICE-SYSTEM/api/v1/user/getList',
                query
            );
            this.workCenterUserSelect = _.cloneDeep(res);
        },
        async getWorkCenterList() {
            this.tableLoading = true;
            // this.searchQuery = {
            //     type: "",
            //     search: ""
            // };
            let queryParams = {
                type: this.searchQuery.type,
                search: this.searchQuery.search,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            let resData = await this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/workingCenter/page',
                queryParams
            );
            this.workCenterList = _.cloneDeep(resData.list);
            this.total = resData.total;
            this.tableLoading = false;
        },
        refreshClick() {
            this.tableLoading = true;
            let queryParams = {
                type: this.sortValue,
                search: this.searchValue,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/workingCenter/page',
                queryParams
            ).then(resData => {
                this.workCenterList = _.cloneDeep(resData.list);
                this.total = resData.total;
                this.tableLoading = false;
                this.$message.success('刷新成功');
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.rest-page {
    background: #ccc;
}
/deep/ .list-contain {
    display: flex;
    flex-direction: column;
    padding: 0 0 0 0;
    .return-pack {
        float: right;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
    }
}
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
.getwayList-page {
    // ?主体样式
    position: relative;
    min-height: 100%;
    width: 100%;
    border-radius: 8px;
    padding: 0 15px;
    // border: 1px solid #d2d3d5;
    background-color: #fff;

    // ?标题样式
    .page-title {
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #d2d3d5;
    }

    // ?新增按钮样式，位置
    .tool-pack {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    // ?表格位置样式
    .gatewaylist-content {
        position: absolute;
        top: 100px;
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
