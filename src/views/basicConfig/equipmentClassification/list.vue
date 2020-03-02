<!--设备分类和设备定义-->
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
                        :disabled="btnDisabled || switchDisable"
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="addClick('genreForm')"
                    >新增
                    </el-button>
                    <el-button
                        v-has="{role: 'enabledAll'}"
                        size="mini"
                        :disabled="switchDisable"
                        class="bt-class"
                        icon="el-icon-remove-outline"
                        @click="handleStatus('1')"
                    >全部启用
                    </el-button>
                    <el-button
                        v-has="{role: 'disableAll'}"
                        size="mini"
                        :disabled="switchDisable"
                        class="bt-class"
                        icon="el-icon-remove-outline"
                        @click="handleStatus('0')"
                    >全部停用
                    </el-button>
                </template>
                <template #name="{scope}">
                    <span
                        class="table-text"
                        @click="viewClick(scope.row)"
                    >{{ scope.row.name }}</span>
                </template>
                <!-- 维护时间 -->
                <template #maintenanceTime="{scope}">
                    <span>{{ $moment(scope.row.maintenanceTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
                <!-- 类型 -->
                <template #type="{scope}">
                    <span>{{ showTypeText(scope.row.type) }}</span>
                </template>
                <!-- 状态 -->
                <template #status="{scope}">
                    <el-switch
                        v-model="scope.row.status"
                        :disabled="!$has($route,'disable') || switchDisable"
                        active-color="#409eff"
                        inactive-color="#dcdfe6"
                        active-value="1"
                        inactive-value="0"
                        size="mini"
                        @change="enableClick(scope.row)"
                    />
                </template>
                <!-- 操作 -->
                <!-- icon="el-icon-edit-outline" -->
                <template #operate="{scope}">
                    <el-button
                        v-has="{role: 'edit'}"
                        class="margin-r-10 edit-button"
                        type="text"
                        @click="editClick(scope.row)"
                    >编辑
                    </el-button>
                    <!-- <svg-icon icon-class="export" />
                    </el-button> -->
                    <!-- <el-button
                        v-has="{role: 'view'}"
                        class="margin-r-10 edit-button"
                        type="text"
                        @click="viewClick(scope.row)"
                    >查看
                    </el-button> -->
                    <!-- <el-button v-has="{role: 'delete'}" class="margin-r-10 edit-button" type="text"
                            @click="deleteClick(scope.row)">删除
                    </el-button>-->
                </template>
            </page-table>
            <el-dialog
                ref="dialogDom"
                v-drag-dialog
                :title="dialogStatus === 'add'? '新增设备定义': '修改设备定义'"
                :visible="showDialog"
                :show-close="false"
                style="z-index: 3"
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
                                label="设备分类："
                                prop="categoryName"
                            >
                                <el-input
                                    v-model="dialogData.categoryName"
                                    :maxlength="$global.string"
                                    :disabled="true"
                                    size="mini"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="设备名称："
                                prop="name"
                            >
                                <el-input
                                    v-model.trim="dialogData.name"
                                    :disabled="tableAddInfo.tableStatus === 'view'"
                                    size="mini"
                                    placeholder="请输入名称"
                                    :maxlength="$global.string"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="型号："
                                prop="model"
                            >
                                <el-input
                                    v-model.trim="dialogData.model"
                                    :maxlength="$global.string"
                                    :disabled="tableAddInfo.tableStatus === 'view'"
                                    size="mini"
                                    placeholder="请输入型号"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item
                                label="供应商："
                                prop="supplierName"
                            >
                                <el-input
                                    v-model.trim="dialogData.supplierName"
                                    :maxlength="$global.string"
                                    :disabled="tableAddInfo.tableStatus === 'view'"
                                    size="mini"
                                    placeholder="请输入制造商"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="尺寸："
                                prop="dimension"
                            >
                                <el-input
                                    v-model.trim="dialogData.dimension"
                                    :maxlength="$global.string"
                                    :disabled="tableAddInfo.tableStatus === 'view'"
                                    size="mini"
                                    placeholder="请输入尺寸"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="重量(kg)："
                                prop="weight"
                            >
                                <el-input
                                    v-model.number="dialogData.weight"
                                    :disabled="tableAddInfo.tableStatus === 'view'"
                                    size="mini"
                                    placeholder="请输入重量"
                                    :maxlength="$global.number"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item
                                label="设备类型："
                                prop="type"
                            >
                                <el-input
                                    v-model.number="dialogData.type"
                                    :disabled="tableAddInfo.tableStatus === 'view'"
                                    size="mini"
                                    placeholder="请输入设备类型"
                                    :maxlength="$global.number"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <!-- 设备图片 -->
                <!--  设备参数 -->
                <!-- :timming-date="new Date()" -->
                <equip-img
                    ref="equipImgDom"
                    :table-info="tableAddImg"
                />
                <table-add
                    ref="tableAdd"
                    :table-info="tableAddInfo"
                >
                    <template #remarks="{scope}">
                        <el-input
                            v-model.trim="scope.row.remarks"
                            show-word-limit
                            :maxlength="$global.textarea"
                            :rows="1"
                            type="textarea"
                            placeholder="请输入备注信息"
                            :disabled="tableAddInfo.tableStatus === 'view'"
                        />
                    </template>
                </table-add>
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
 * @module 基础配置-设备分类（迁移来自-机加云MES）
 * @author chebin
 */
import TreeClass from '@/components/treeClass/treeClass';
// import TableGeneral from '@/components/tableGeneral/tableGeneral'
import PageTable from '@/components/tableGeneral/pageTable';
import TableAdd from '@/components/newTableCard/tableAdd';
// import UploadFile from '@/components/upload/uploadFile'
import EquipImg from '@/components/EquipImg/equipImg';
/* 物料type类型 0表示 成品， 1表示 半成品， 2表示 原材料， 3表示 辅料*/
export default {
    name: 'ClassificationList',
    components: { EquipImg, TableAdd, PageTable, TreeClass },
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
                        prop: 'name',
                        label: '分类名称',
                        sortable: true,
                        slot: true
                    },
                    { prop: 'model', label: '型号' },
                    { prop: 'supplierName', label: '制造商' },
                    {
                        prop: 'status',
                        label: '状态',
                        slot: true,
                        width: 80,
                        align: 'center'
                    },
                    {
                        prop: 'operate',
                        width: 60,
                        label: '操作',
                        slot: true,
                        align: 'center'
                    }
                ],
                // this.$service('GET', '/SERVICE-BUSINESS/api/equipmentDefinition/category', params)
                api: '/SERVICE-BUSINESS/api/equipmentDefinition/category',
                params: {
                    categoryId: '',
                    status: ''
                    // supplierId: ''
                },
                method: 'GET',
                title: '设备定义',
                marginRight: true,
                showSelect: true, // 是否显示table选者框
                multipleSelection: true
            },
            formRules: {
                name: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: ['blur', 'change']
                    }
                ],
                model: [
                    {
                        required: true,
                        message: '请输入型号',
                        trigger: ['blur', 'change']
                    }
                ],
                supplierName: [
                    {
                        required: true,
                        message: '请输入供应商',
                        trigger: ['blur', 'change']
                    }
                ],
                dimension: [
                    {
                        required: true,
                        message: '请输入尺寸',
                        trigger: ['blur', 'change']
                    }
                ],
                weight: [
                    { required: true, message: '请输入重量' },
                    { type: 'number', message: '必须为数字' }
                ],
                type: [
                    {
                        required: true,
                        message: '请输入设备类型',
                        trigger: ['blur', 'change']
                    }
                ]
            },
            tableLoading: false, // 表格loading状态
            btnDisabled: true, // 表格新增是否可点
            tableList: [],
            tableAddInfo: {
                propsList: [
                    { prop: 'name', label: '参数名称' },
                    { prop: 'value', label: '参数值' },
                    { prop: 'remarks', label: '参数备注', slot: true }
                ],
                title: '设备参数',
                tableStatus: 'add', // 当前处于状态 add ,edit ,view
                showSelect: false, // 是否显示table选者框
                tableData: '' // 数据
            },
            tableAddImg: {
                photosList: [],
                tableStatus: 'edit',
                tempDate: null
            },
            showDialog: false,
            dialogData: {
                categoryName: '', // 分类名字
                name: '', // 名称
                model: '', // 型号
                dimension: '', // 尺寸
                // supplierId: '',  // 制造商id
                supplierName: '',
                weight: '', // 重量
                type: '' //设备类型
            },
            dialogStatus: 'add', // 弹窗状态
            factoryOptions: [],
            currentData: '',
            loadingList: [],
            tableSelectData: [],
            switchDisable: false
        };
    },
    watch: {
        'treeCurrentData.status': {
            handler(val) {
                if (val) {
                    this.switchDisable = val === '0';
                }
            },
            deep: true,
            immediate: true
        }
    },
    async mounted() {
        //  获取table数据
        this.$refs.generalTableDom.getTableList();
        // this.getFactoryOptions()
    },
    methods: {
        handleStatus(status) {
            this.$confirm(
                `确定要${status === '1' ? '启用' : '停用'}当前分类下的信息吗？`,
                '提示',
                {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }
            ).then(() => {
                let params = {
                    categoryId: this.treeCurrentData.id,
                    status: status
                };
                this.$service(
                    'GET',
                    '/SERVICE-BUSINESS/api/equipmentDefinition/byCategory',
                    params
                ).then(res => {
                    if (status === '1') {
                        this.$message.success('全部启用成功');
                    } else {
                        this.$message.warning('全部停用成功');
                    }
                    this.$refs.generalTableDom.getTableList();
                });
                // this.$fetch('equipment-definition-controller/byCategory-get', params).then((res) => {
                // })
            });
        },
        tableSelectChange(val) {
            this.tableSelectData = val;
        },
        /* =========树形方法 start=======*/
        treeNodeClick(treeNode) {
            this.tableInfo.params.categoryId = treeNode.id;
            this.treeCurrentData = treeNode;
            this.btnDisabled = treeNode.name === '设备分类';
            this.$refs.generalTableDom.getTableList();
        },
        operateTree(treeNode, val) {
            if (treeNode) {
                this.treeCurrentData = treeNode;
                if (val) {
                    this.treeCurrentData.status = val;
                }
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
            this.dialogStatus = 'add';
            this.showDialog = true;
            delete this.dialogData.supplierId;
            this.$nextTick(() => {
                this.tableAddInfo.tableStatus = 'add';
                this.dialogData.categoryName = this.treeCurrentData.name;
                this.dialogData.categoryId = this.treeCurrentData.id;
            });
        },
        cancelClick(formName) {
            this.showDialog = false;
            this.$refs[formName].resetFields();
            this.$refs.tableAdd.clearData();
            this.$refs.equipImgDom.clearData();
            this.$clearObject(this.dialogData);
        },
        async saveClick(formName) {
            this.$refs.equipImgDom.tableList.map((item, index) => {
                delete item.urlBase64;
            });
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    try {
                        let params = {
                            ...this.dialogData,
                            photos: this.$refs.equipImgDom.tableList,
                            parameters: this.$refs.tableAdd.tableList
                        };
                        this.loadingList.push('save');
                        if (this.dialogStatus === 'add') {
                            delete params.id;
                            await this.$service(
                                'POST',
                                '/SERVICE-BUSINESS/api/equipmentDefinition',
                                params
                            );
                            // await this.$fetch('equipment-definition-controller/equipmentDefinition-post', params)
                        } else {
                            await this.$service(
                                'PUT',
                                '/SERVICE-BUSINESS/api/equipmentDefinition',
                                params
                            );
                            // await this.$fetch('equipment-definition-controller/equipmentDefinition-put', params)
                        }
                        this.$message.success(
                            this.dialogStatus === 'add'
                                ? '新增成功'
                                : '编辑成功'
                        );
                        this.$refs.tableAdd.clearData();
                        this.$refs.equipImgDom.clearData();
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
            console.log(this.tableAddImg, 'tableAddImg');
            this.dialogStatus = 'edit';
            this.showDialog = true;
            this.$nextTick(() => {
                this.currentData = row;
                this.tableAddInfo.tableStatus = 'edit';
                this.tableAddInfo.tableData = row.parameters;
                this.tableAddImg.photosList = row.photos;
                this.tableAddImg.tempDate = new Date();
                this.dialogData = _.cloneDeep(row);
            });
        },
        batchDelete() {
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
                    'equipment-definition-controller/delete-delete',
                    tableSelectData
                ).then(res => {
                    this.$message.success('删除成功');
                    this.$refs.generalTableDom.getTableList();
                });
            });
        },
        deleteClick(row) {
            this.$confirm(`确定要删除"${row.name}"吗？`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                let params = {
                    equipmentDefinitionId: row.id
                };
                this.$fetch(
                    'equipment-definition-controller/equipmentDefinitionId-delete',
                    params
                ).then(res => {
                    this.$message.success('删除成功');
                    this.$refs.generalTableDom.getTableList();
                });
            });
        },
        // 查看按钮
        viewClick(row) {
            this.$router.push({
                path: 'equipmentClassification/view',
                query: {
                    from: this.$route.fullPath,
                    id: row.id,
                    clickTreeId: this.treeCurrentData.id
                }
            });
        },
        // 启用,停用事件.进行
        enableClick(row) {
            // let operateStatue = row.status === 0 ? '启用' : '停用' // 进行 ? 操作
            let params = {
                id: row.id,
                status: row.status
            };
            this.$service(
                'PUT',
                '/SERVICE-BUSINESS/api/equipmentDefinition/statusUpdate',
                params
            ).then(res => {
                if (row.status === '1') {
                    this.$message.success(`启用成功`);
                } else {
                    this.$message.warning('停用成功');
                }
                this.$refs.generalTableDom.getTableList();
            });
            // this.$fetch('equipment-definition-controller/statusUpdate-put', params).then((res) => {
            //     if (row.status === '1') {
            //         this.$message.success(`启用成功`)
            //     } else {
            //         this.$message.warning('停用成功')
            //     }
            //     this.$refs.generalTableDom.getTableList()
            // })
        }
    }
};
</script>
<style>
.vue-directive-image-previewer {
    z-index: 3000 !important;
}
</style>
<style lang="scss" scoped>
.rest-page {
    background: #ccc;
}
/deep/ .list-contain {
    display: flex;
    flex-direction: column;
    padding: 0;
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
        // margin-left: 15px;
        height: 100%;
        border-radius: 8px;
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
        margin-left: 265px;
        height: 100%;
        border: 1px solid #d2d3d5;
        background-color: #fff;

        .title-pack {
            height: 38px;
            line-height: 38px;
            border-bottom: 1px solid #d2d3d5;
        }

        .tool-pack {
            padding-top: 10px;
            padding-bottom: 10px;

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
}
</style>
