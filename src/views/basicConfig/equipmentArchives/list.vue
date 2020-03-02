<!--设备档案页面定义-->
<template>
    <vt-page
        type="one"
        class-name="rest-page"
    >
        <div class="general-list-page classification-page">
            <!-- 左侧树形结构  -->
            <tree-class
                ref="treeClassDom"
                :tree-props="treeProps"
                @treeNodeClick="treeNodeClick"
                @operateTree="operateTree"
            />
            <!-- 右侧树形结构边栏  -->
            <page-table
                ref="generalTableDom"
                :table-info="tableInfo"
                @tableSelectChange="tableSelectChange"
            >
                <!-- 表格顶部操作的按钮 -->
                <template #headOperate>
                    <el-button
                        v-has="{role: 'add'}"
                        size="mini"
                        :disabled="btnDisabled"
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="addClick('genreForm')"
                    >新增</el-button>
                </template>
                <template #no="{scope}">
                    <span
                        class="table-text"
                        @click="viewClick(scope.row)"
                    >{{ scope.row.no }}</span>
                </template>
                <!-- 入场日期 -->
                <template #arrivalDate="{scope}">
                    <span>{{ $moment(scope.row.arrivalDate).format('YYYY-MM-DD') }}</span>
                </template>
                <!-- 截止日期 -->
                <template #repairExpirationDate="{scope}">
                    <span>{{ $moment(scope.row.repairExpirationDate).format('YYYY-MM-DD') }}</span>
                </template>
                <template #type="{scope}">
                    <span>{{ showTypeText(scope.row.type) }}</span>
                </template>
                <!-- 状态 -->
                <template #status="{scope}">
                    <span
                        v-for="(item, index) in tagStatus"
                        :key="index"
                    >
                        <span
                            v-if="item.en === scope.row.status"
                            class="circle-span"
                            :class="item.classCircle"
                        />
                        <span
                            v-if="item.en === scope.row.status"
                            :key="index"
                            :class="item.class"
                        >
                            {{ item.cn }}
                        </span>
                    </span>
                </template>
                <!-- 操作 -->
                <template #operate="{scope}">
                    <el-button
                        v-has="{role: 'edit'}"
                        class="margin-r-10 "
                        :disabled="scope.row.status !== 'IDLE'"
                        type="text"
                        @click="editClick(scope.row)"
                    >编辑
                    </el-button>
                    <!-- <svg-icon icon-class="export" /></el-button> -->
                    <!-- <el-button
                        v-has="{role: 'view'}"
                        class="margin-r-10 edit-button"
                        type="text"
                        @click="viewClick(scope.row)"
                    >查看</el-button> -->
                    <!--                <el-button v-has="{role: 'delete'}" class="margin-r-10 edit-button" type="text" @click="deleteClick(scope.row)">删除</el-button>-->
                </template>
            </page-table>
            <el-dialog
                ref="dialogDom"
                v-drag-dialog
                :title="dialogStatus === 'add'?'新增': dialogStatus === 'edit'?'编辑' :'查看'"
                :visible="showDialog"
                :show-close="false"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                :width="$global.dw"
            >
                <el-form
                    ref="formDom"
                    :rules="formRules"
                    label-width="120px"
                    label-position="top"
                    :model="dialogData"
                >
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item
                                label="设备定义："
                                prop="definitionId"
                            >
                                <el-select
                                    v-model="dialogData.definitionId"
                                    :readonly="dialogStatus === 'view'"
                                    size="mini"
                                    style="width: 100%"
                                    filterable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in deviceOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        @filter-method="getDeviceOptions"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="编号："
                                prop="no"
                            >
                                <el-input
                                    v-model="dialogData.no"
                                    :readonly="dialogStatus === 'view'"
                                    size="mini"
                                    placeholder="请输入编号"
                                    :maxlength="$global.string"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="车间："
                                prop="workshopId"
                            >
                                <el-select
                                    v-model="dialogData.workshopId"
                                    :readonly="dialogStatus === 'view'"
                                    size="mini"
                                    style="width: 100%"
                                    filterable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in workShopOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                        @filter-method="getWorkShopOptions"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">

                        <el-col :span="8">
                            <el-form-item
                                label="入场日期："
                                prop="arrivalDate"
                            >
                                <el-date-picker
                                    v-model="dialogData.arrivalDate"
                                    size="mini"
                                    :picker-options="pickerOptionsStart"
                                    :readonly="dialogStatus === 'view'"
                                    style="width: 100%"
                                    type="date"
                                    placeholder="选择日期时间"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="责任人："
                                prop="responsiblePerson"
                            >
                                <el-select
                                    v-model="dialogData.responsiblePerson"
                                    :readonly="dialogStatus === 'view'"
                                    size="mini"
                                    style="width: 100%"
                                    filterable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in PeopleOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name"
                                        @filter-method="getPeopleOptions"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="保修截止日期："
                                prop="repairExpirationDate"
                            >
                                <el-date-picker
                                    v-model="dialogData.repairExpirationDate"
                                    size="mini"
                                    :readonly="dialogStatus === 'view'"
                                    style="width: 100%"
                                    type="date"
                                    :picker-options="pickerOptionsEnd"
                                    placeholder="选择日期时间"
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
                        icon="el-icon-circle-close"
                        @click="cancelClick('formDom')"
                    >取消</el-button>
                    <el-button
                        v-if="dialogStatus!=='view'"
                        :loading="loadingList.indexOf('save') > -1"
                        size="mini"
                        type="primary"
                        icon="el-icon-circle-check"
                        @click="saveClick('formDom')"
                    >确认</el-button>
                </span>
            </el-dialog>
        </div>
    </vt-page>
</template>

<script>
/**
 * @module 基础配置-设备档案（迁移来自-机加云MES）
 * @author chebin
 */
import TreeClass from '@/components/treeClass1/treeClass';
// import TableGeneral from '@/components/tableGeneral/tableGeneral';
import PageTable from '@/components/tableGeneral/pageTable';
// import TableAdd from '@/components/newTableCard/tableAdd';
/* 物料type类型 0表示 成品， 1表示 半成品， 2表示 原材料， 3表示 辅料*/
export default {
    name: 'Archives',
    components: { PageTable, TreeClass },
    data() {
        return {
            /* ========= 左侧树形结构 start =======*/
            treeProps: {
                version: 'v1',
                // 树形结构标题
                title: '设备分类',
                listAPI: {
                    // 新整接口
                    // this.$service('GET', '/SERVICE-BUSINESS/api/category/tree', params)
                    api: '/SERVICE-BUSINESS/api/category/tree',
                    params: {
                        type: 'EQUIPMENT'
                    },
                    method: 'GET'
                },
                addAPI: {
                    // 新整接口
                    // this.$service('POST', '/SERVICE-BUSINESS/api/category/equipment', params)
                    api: '/SERVICE-BUSINESS/api/category/equipment',
                    params: {
                        type: 'EQUIPMENT'
                    },
                    method: 'POST'
                },
                editAPI: {
                    // 编辑借口
                    // this.$service('PUT', '/SERVICE-BUSINESS/api/category/equipment', params)
                    api: '/SERVICE-BUSINESS/api/category/equipment',
                    params: {
                        type: 'EQUIPMENT'
                    },
                    method: 'PUT'
                },
                enableAPI: {
                    // 启用和禁用接口
                    // this.$service('GET', '/SERVICE-BUSINESS/api/category/equipmentActiveOrDisable', params)
                    api:
                        '/SERVICE-BUSINESS/api/category/equipmentActiveOrDisable',
                    params: {
                        type: 'EQUIPMENT'
                    },
                    method: 'GET'
                }
            },
            treeCurrentData: '',
            /* ========= 右侧表格 start =======*/
            tableInfo: {
                propsList: [
                    {
                        prop: 'no',
                        label: '档案编号',
                        sortable: true,
                        slot: true
                    },
                    { prop: 'definitionName', label: '名称' },
                    { prop: 'workShopName', label: '车间' },
                    {
                        prop: 'arrivalDate',
                        label: '入场日期',
                        align: 'center',
                        slot: true,
                        sortable: true
                    },
                    {
                        prop: 'repairExpirationDate',
                        label: '保修截止日期',
                        align: 'center',
                        slot: true,
                        sortable: true
                    },
                    { prop: 'responsiblePerson', label: '责任人' },
                    {
                        prop: 'status',
                        label: '状态',
                        align: 'center',
                        slot: true,
                        width: 100
                    },
                    {
                        prop: 'operate',
                        width: 60,
                        label: '操作',
                        align: 'center',
                        slot: true
                    }
                ],
                api: '/SERVICE-BUSINESS/api/equipment/category',
                params: {
                    categoryId: '',
                    status: '',
                    type: 4
                },
                method: 'GET',
                showSelect: true,
                multipleSelection: true,
                title: '设备档案',
                marginRight: true
            },
            formRules: {
                definitionId: [
                    {
                        required: true,
                        message: '请选择设备定义',
                        trigger: ['blur', 'change']
                    }
                ],
                no: [
                    {
                        required: true,
                        message: '请输入设备编号',
                        trigger: ['blur', 'change']
                    }
                ],
                workshopId: [
                    {
                        required: true,
                        message: '请选择车间',
                        trigger: ['blur', 'change']
                    }
                ],
                arrivalDate: [
                    {
                        required: true,
                        message: '请选择入场日期',
                        trigger: ['blur', 'change']
                    }
                ],
                repairExpirationDate: [
                    {
                        required: true,
                        message: '请选择截止时间',
                        trigger: ['blur', 'change']
                    }
                ],
                responsiblePerson: [
                    {
                        required: true,
                        message: '请选择责任人',
                        trigger: ['blur', 'change']
                    }
                ]
            },
            tableLoading: false, // 表格loading状态
            btnDisabled: true, // 表格新增是否可点
            tableList: [],
            dialogTitle: '新增',
            showDialog: false,
            dialogData: {
                definitionId: '',
                no: '',
                workshopId: '',
                arrivalDate: '',
                repairExpirationDate: '',
                responsiblePerson: '' // 重量
            },
            dialogStatus: 'add', // 弹窗状态
            deviceOptions: [],
            workShopOptions: [],
            tagStatus: [
                {
                    en: 'IDLE',
                    cn: '闲置',
                    class: 'info',
                    classCircle: 'info-circle'
                },
                {
                    en: 'USING',
                    cn: '使用中',
                    class: 'success',
                    classCircle: 'success-circle'
                },
                {
                    en: 'FAILURE',
                    cn: '维修',
                    class: 'warning',
                    classCircle: 'warning-circle'
                },
                {
                    en: 'SCRAP',
                    cn: '报废',
                    class: 'danger',
                    classCircle: 'danger-circle'
                }
            ],
            loadingList: [],
            PeopleOptions: [],
            pickerOptionsStart: {
                disabledDate: time => {
                    // if (this.dialogData.arrivalDate !== '') {
                    //     return time.getTime() > Date.now() || time.getTime() > this.dialogData.arrivalDate;
                    // } else {
                    //     return time.getTime() > Date.now();
                    // }
                    if (this.dialogData.repairExpirationDate) {
                        return (
                            time.getTime() >
                            this.dialogData.repairExpirationDate
                        );
                    } else {
                        return false;
                    }
                    // return false
                }
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                    if (this.dialogData.arrivalDate) {
                        return time.getTime() < this.dialogData.arrivalDate;
                    } else {
                        return false;
                    }
                }
            },
            tableSelectData: []
        };
    },
    async mounted() {
        //  获取table数据
        this.$refs.generalTableDom.getTableList();
        this.getDeviceOptions();
        this.getWorkShopOptions();
        this.getPeopleOptions();
    },
    methods: {
        tableSelectChange(val) {
            this.tableSelectData = val;
        },
        // 获取所有设备定义
        getDeviceOptions(val) {
            let params = {
                categoryId: this.tableInfo.params.categoryId,
                pageNum: 1,
                pageSize: 20,
                search: val,
                category: this.treeCurrentData.id
            };
            // this.$fetch('equipment-definition-controller/category-get', params).then((res) => {
            //     this.deviceOptions = res.list
            // })
            this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/equipmentDefinition/category',
                params
            ).then(res => {
                this.deviceOptions = res.list;
            });
        },
        getPeopleOptions(val) {
            this.$service(
                'GET',
                '/SERVICE-SYSTEM/api/v1/user/getList',
                {}
            ).then(res => {
                this.PeopleOptions = res;
            });
            // this.$fetch('user-controller/getList-get', {}).then((res) => {
            //     this.PeopleOptions = res
            // })
        },
        getWorkShopOptions(val) {
            let params = {
                pageNum: 1,
                pageSize: 500,
                search: val
            };
            this.$service(
                'GET',
                '/SERVICE-BUSINESS/api/workingCenter/workShop',
                params
            ).then(res => {
                this.workShopOptions = res;
            });
            // this.$fetch('working-center-controller/workShop-get', params).then((res) => {
            //     this.workShopOptions = res
            // })
        },
        /* =========树形方法 start=======*/
        treeNodeClick(treeNode) {
            this.tableInfo.params.categoryId = treeNode.id;
            this.treeCurrentData = treeNode;
            this.btnDisabled = treeNode.name === '设备分类';
            this.$refs.generalTableDom.getTableList();
            this.getDeviceOptions();
        },
        operateTree(treeNode) {
            if (treeNode) {
                this.treeCurrentData = treeNode;
                this.tableInfo.params.categoryId = treeNode.id;
            }
            this.$refs.treeClassDom.getTreeList();
            this.$refs.generalTableDom.getTableList();
        },
        /* ========= 表格 start =======*/
        showTypeText(val) {
            val = parseFloat(val);
            switch (val) {
            case 0:
                return '成品';
            case 1:
                return '半成品';
            case 2:
                return '原材料';
            case 3:
                return '辅料';
            default:
                return '暂无';
            }
        },
        // 点击了设备分类的新增按钮
        addClick() {
            this.showDialog = true;
            this.dialogStatus = 'add';
            this.$nextTick(() => {
                this.dialogData.categoryName = this.treeCurrentData.name;
                this.dialogData.categoryId = this.treeCurrentData.id;
            });
        },
        cancelClick(formName) {
            this.showDialog = false;
            this.$refs[formName].resetFields();
            this.$clearObject(this.dialogData);
        },
        async saveClick(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    try {
                        this.loadingList.push('save');
                        let params = {
                            ...this.dialogData
                        };
                        if (this.dialogStatus === 'add') {
                            delete params.id;
                            await this.$service(
                                'POST',
                                '/SERVICE-BUSINESS/api/equipment',
                                params
                            );
                            // await this.$fetch('equipment-controller/equipment-post', params)
                        } else {
                            await this.$service(
                                'PUT',
                                '/SERVICE-BUSINESS/api/equipment',
                                params
                            );
                            // await this.$fetch('equipment-controller/equipment-put', params)
                        }
                        this.$message.success(
                            this.dialogStatus === 'add'
                                ? '新增成功'
                                : '编辑成功'
                        );
                        this.showDialog = false;
                        this.$refs[formName].resetFields();
                        this.$refs.generalTableDom.getTableList();
                        this.loadingList = [];
                    } catch (error) {
                        this.loadingList = [];
                    }
                }
            });
        },
        // 点击了编辑按钮
        editClick(row) {
            this.showDialog = true;
            this.$nextTick(() => {
                this.dialogStatus = 'edit';
                this.dialogData = _.cloneDeep(row);
            });
        },
        // 查看按钮
        viewClick(row) {
            this.$router.push({
                path: 'equipmentArchives/view',
                query: {
                    from: this.$route.fullPath,
                    id: row.id,
                    clickTreeId: this.treeCurrentData.id
                }
            });
        },
        // 删除和批量删除
        batchDeletion() {
            if (this.tableSelectData.length < 1) {
                this.$message.warning('请至少选择一条需要删除的数据');
                return false;
            }
            let tableSelectData = [];
            this.tableSelectData.map(item => {
                tableSelectData.push(item.id);
            });
            this.$confirm(
                `确定要删除这${tableSelectData.length}条吗？`,
                '提示',
                {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }
            ).then(() => {
                this.$fetch(
                    'equipment-controller/deleteList-delete',
                    tableSelectData
                ).then(res => {
                    this.$message.success('删除成功');
                    this.$refs.generalTableDom.getTableList();
                });
            });
        },
        deleteClick(row) {
            this.$confirm(`确定要删除"${row.definitionName}"吗？`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                let params = {
                    equipmentId: row.id
                };
                this.$fetch(
                    'equipment-controller/equipmentId-delete',
                    params
                ).then(res => {
                    this.$message.success('删除成功');
                    this.$refs.generalTableDom.getTableList();
                });
            });
        },
        // 启用,停用事件.进行
        enableClick(row) {
            let operateStatue = row.status === 0 ? '启用' : '停用'; // 进行 ? 操作
            let params = {
                id: row.id,
                status: row.status
            };
            this.$service(
                'PUT',
                '/SERVICE-BUSINESS/api/equipmentDefinition/statusUpdate',
                params
            ).then(res => {
                this.$message.success(`${operateStatue}成功`);
                this.$refs.generalTableDom.getTableList();
            });
            // this.$fetch('equipment-definition-controller/statusUpdate-put', params).then((res) => {
            //     this.$message.success(`${operateStatue}成功`)
            //     this.$refs.generalTableDom.getTableList()
            // })
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
.classification-page {
    position: relative;
    height: 100%;
    width: 100%;

    // 左侧类别树
    .genre-tree-pack {
        position: absolute;
        width: 260px;
        height: 100%;
        border-radius: 4px;
        overflow-x: auto;
        padding: 0 10px;
        // border: 1px solid #d2d3d5;
        background-color: #fff;

        .delete-button {
            color: #f47476;
        }

        .title-pack {
            height: 38px;
            line-height: 38px;
            border-bottom: 1px solid #d2d3d5;
        }

        .tool-pack {
            padding-top: 15px;
            padding-bottom: 15px;

            .tool-tag {
                height: 32px;
                line-height: 32px;
                font-size: 14px;
            }
        }
    }

    // 右侧下级类别
    .next-genre-pack {
        margin-left: 270px;
        height: 100%;
        border: 1px solid #d2d3d5;
        background-color: #fff;

        .title-pack {
            height: 38px;
            line-height: 38px;
            border-bottom: 1px solid #d2d3d5;
        }

        .tool-pack {
            padding-top: 16px;
            padding-bottom: 16px;

            .tool-tag {
                height: 32px;
                line-height: 32px;
                font-size: 14px;
            }
        }

        .edit-button {
            color: #538ffd;
        }

        .status-circle {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 6px;
            margin-right: 5px;
            vertical-align: middle;
        }

        .delete-button {
            color: #f47476;
        }

        .view-span {
            color: #1284fa;
            border-bottom: 1px solid #1284fa;

            &:hover {
                cursor: pointer;
            }
        }
    }
    //状态色值
    .success {
        color: #7ed321;
    }
    .warning {
        color: #f5a623;
    }
    .danger {
        color: #d0021b;
    }
    .info {
        color: #bbbbbb;
    }
    .success-circle {
        background: #7ed321;
    }
    .warning-circle {
        background: #f5a623;
    }
    .danger-circle {
        background: #d0021b;
    }
    .info-circle {
        background: #bbbbbb;
    }
}
</style>
