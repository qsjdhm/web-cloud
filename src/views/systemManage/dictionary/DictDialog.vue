<!-- 标准代码管理页面 -->
<template>
    <div>
        <el-dialog
            v-drag-dialog
            :title="dialogInfo.dialogStatus === 'add'?'添加字典项':'查看字典项'"
            :visible.sync="dialogInfo.isShowDialog"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="1000px"
        >
            <el-form
                ref="dialogDom"
                :rules="formRules"
                label-width="100px"
                label-position="right"
                :model="dialogInfo.dialogData"
            >
                <el-row>
                    <el-col :span="8">
                        <el-form-item
                            label="字典编码："
                            prop="code"
                        >
                            <el-input
                                v-model.trim="dialogInfo.dialogData.code"
                                :maxlength="$global.string"
                                :disabled="true"
                                size="mini"
                                placeholder=""
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            label="字典名称："
                            prop="name"
                        >
                            <el-input
                                v-model.trim="dialogInfo.dialogData.name"
                                :maxlength="$global.string"
                                :disabled="true"
                                size="mini"
                                placeholder=""
                            />
                        </el-form-item>
                    </el-col>
                    <!-- 仅仅用于显示，在弹窗中显示的状态 -->
                    <el-col :span="8">
                        <el-form-item
                            label="状态："
                            prop="status"
                        >
                            <el-switch
                                v-model="dialogInfo.dialogData.status"
                                :disabled="true"
                                active-color="#409eff"
                                inactive-color="#dcdfe6"
                                active-value="1"
                                inactive-value="0"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div>
                    <el-button
                        v-if="dialogInfo.dialogStatus !== 'view'"
                        style="margin-bottom: 10px"
                        size="mini"
                        type="primary"
                        icon="el-icon-plus"
                        @click="addClickItem('formDomItem')"
                    >新增字典项
                    </el-button>
                </div>
                <el-table
                    ref="multipleTable"
                    v-loading="loadingList.indexOf('page') > -1"
                    class="table-general"
                    element-loading-text="请稍等..."
                    :data="tableList"
                    stripe
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    empty-text="暂无数据..."
                >
                    <el-table-column
                        align="center"
                        label="字典项编码"
                        prop="itemCode"
                    />
                    <el-table-column
                        align="center"
                        label="字典项名称"
                        prop="itemName"
                    />
                    <el-table-column
                        align="center"
                        label="状态"
                        prop="status"
                    >
                        <template slot-scope="scope">
                            <el-switch
                                v-if="dialogInfo.dialogStatus !== 'view'"
                                v-model="scope.row.status"
                                active-color="#409eff"
                                inactive-color="#dcdfe6"
                                active-value="1"
                                inactive-value="0"
                                @change="handleItemStatus(scope.row)"
                            />
                            <span v-else>
                                <el-tag :type="scope.row.status=== '1' ?'success' :'info'">
                                    {{ scope.row.status === '1' ? '正常' : '停用' }}
                                </el-tag>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="dialogInfo.dialogStatus !== 'view'"
                        align="center"
                        label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button
                                class="margin-r-10 edit-button"
                                type="text"
                                @click="editClickItem(scope.row)"
                            >编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    size="mini"
                    @click="cancelClick('dialogDom')"
                >返回</el-button>
            </span>
        </el-dialog>
        <!--  编辑字典 -->
        <el-dialog
            v-drag-dialog
            append-to-body
            :title="dialogStatusItem === 'add'?'新增':'编辑'"
            :visible.sync="isShowDialogItem"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="500px"
        >
            <el-form
                ref="dialogDomItem"
                :rules="formRules"
                label-width="120px"
                label-position="right"
                :model="dialogDataItem"
            >
                <el-row>
                    <el-col>
                        <el-form-item
                            label="字典项编码："
                            prop="itemCode"
                        >
                            <el-input
                                v-model.trim="dialogDataItem.itemCode"
                                :maxlength="$global.string"
                                size="mini"
                                placeholder="请输入字典项编码"
                            />
                        </el-form-item>
                        <el-form-item
                            label="字典项名称："
                            prop="itemName"
                        >
                            <el-input
                                v-model.trim="dialogDataItem.itemName"
                                :maxlength="$global.string"
                                size="mini"
                                placeholder="请输入字典项名称"
                            />
                        </el-form-item>
                        <el-form-item
                            v-if="dialogStatusItem === 'add'"
                            label="状态："
                            prop="status"
                        >
                            <el-switch
                                v-model="dialogDataItem.status"
                                active-color="#409eff"
                                inactive-color="#dcdfe6"
                                active-value="1"
                                inactive-value="0"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div
                slot="footer"
                class="text-center"
            >
                <el-button
                    size="mini"
                    @click="cancelClickItem('dialogDomItem')"
                >取消</el-button>
                <el-button
                    :loading="loadingList.indexOf('save') > -1"
                    size="mini"
                    type="primary"
                    @click="saveClickItem('dialogDomItem')"
                >确认
                </el-button>

            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: "DictDialog",
    props: {
        dialogInfo: {
            type: Object,
            default: () => {
                return {
                    isShowDialog: false,
                    dialogStatus: "add",
                    dialogData: {
                        id: "",
                        code: "",
                        name: "",
                        status: "1"
                    }
                };
            }
        }
    },
    data() {
        return {
            tableList: [],
            isShowDialogItem: false,
            dialogDataItem: {
                itemCode: "",
                itemName: "",
                status: "1"
            },
            formRules: {
                itemCode: [
                    {
                        required: true,
                        message: "请输入字典项编码",
                        trigger: ["blur", "change"]
                    }
                ],
                itemName: [
                    {
                        required: true,
                        message: "请输入字典项名称",
                        trigger: ["blur", "change"]
                    }
                ],
                status: [{ required: true }]
            },
            loadingList: [],
            dialogStatusItem: "add"
        };
    },
    watch: {
        "dialogInfo.dialogData.id": {
            handler(val) {
                if (val) {
                    this.getDictItem();
                }
            },
            deep: true
        }
    },
    mounted() {},
    methods: {
        async getDictItem() {
            this.loadingList.push("page");
            let params = { dictId: this.dialogInfo.dialogData.id }
            this.$service('get', '/SERVICE-SYSTEM/api/dict/item/all', params).then(res => {
                    this.tableList = res;
                    this.loadingList = [];
                })
                .catch(() => {
                    this.loadingList = [];
                });
        },
        addClickItem() {
            this.isShowDialogItem = true;
            this.dialogStatusItem = "add";
        },
        cancelClick() {
            this.dialogInfo.isShowDialog = false;
        },
        saveClickItem(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    try {
                        this.loadingList.push("save");
                        let params = {
                            ...this.dialogDataItem,
                            dictId: this.dialogInfo.dialogData.id,
                            dictName: this.dialogInfo.dialogData.name
                        };
                        if (this.dialogStatusItem === "add") {
                            await this.$service('post', '/SERVICE-SYSTEM/api/dict/item', params)
                            this.$message.success("添加成功!");
                        } else {
                            let params = {
                                ...this.dialogDataItem,
                                dictId: this.dialogInfo.dialogData.id,
                                dictName: this.dialogInfo.dialogData.name,
                                itemId: this.dialogDataItem.id
                            };
                            await this.$service('put', '/SERVICE-SYSTEM/api/dict/item', params)
                            this.$message.success("编辑成功!");
                        }
                        this.$refs[formName].resetFields();
                        this.isShowDialogItem = false;
                        this.loadingList = [];
                        this.getDictItem();
                    } catch (error) {
                        this.loadingList = [];
                    }
                }
            });
        },
        cancelClickItem(formName) {
            this.isShowDialogItem = false;
            this.$refs[formName].resetFields();
        },
        // 编辑字典项
        editClickItem(row) {
            this.isShowDialogItem = true;
            this.$nextTick(() => {
                this.dialogStatusItem = "edit";
                this.dialogDataItem = _.cloneDeep(row);
            });
        },
        handleItemStatus(row) {
            let params = { id: row.id }
            this.$service('put', '/SERVICE-SYSTEM/api/dict/item/status', params)
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/*/deep/ .el-dialog .el-dialog__footer{*/
/*    border: 0!important;*/
/*}*/
</style>
