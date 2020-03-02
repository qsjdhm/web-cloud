<!-- 权限管理页面弹窗 -->
<template>
    <div>
        <el-dialog
            class="setDialog"
            :title="showTitle()"
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
                    <el-col :span="12">
                        <el-form-item
                            label="权限编码："
                            prop="code"
                        >
                            <el-input
                                v-model="dialogInfo.dialogData.code"
                                :disabled="true"
                                size="mini"
                                placeholder=""
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                            label="权限名称："
                            prop="name"
                        >
                            <el-input
                                v-model="dialogInfo.dialogData.name"
                                :disabled="true"
                                size="mini"
                                placeholder=""
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 功能权限 -->
            <authority-function
                v-if="dialogInfo.authorityType === 'FUNCTION' && getData"
                ref="submitPermission"
                :get-data.sync="getData"
                :service-checked="serviceChecked"
            />
            <authority-data
                v-if="dialogInfo.authorityType === 'DATA'"
                ref="authorityData"
                :check-select="checkSelect"
            />
            <div
                slot="footer"
                class="dialog-footer text-center"
            >
                <el-button
                    size="mini"
                    @click="cancelClick"
                >取消
                </el-button>
                <el-button
                    v-if="rootInfo.dialogInfo.dialogStatus !== 'view'"
                    size="mini"
                    type="primary"
                    @click="submitClick"
                >确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import AuthorityFunction from './authorityFunction';
import getRoutes from '@/utils/generateRouter';
import AuthorityData from './authorityData';

export default {
    name: 'AuthorityDialog',
    components: { AuthorityData, AuthorityFunction },
    props: {
        /* 弹窗中菜单和数据弹窗 */
        dialogInfo: {
            type: Object,
            default: () => {
                return {
                    authorityType: 'DATA',
                    isShowDialog: false,
                    dialogStatus: 'add',
                    dialogData: {
                        id: '',
                        code: '',
                        name: '',
                        status: '1'
                    }
                };
            }
        }
    },
    inject: {
        rootInfo: {
            default: () => ({})
        }
    },
    data() {
        return {
            isShowDialogItem: false,
            formRules: {
                itemCode: [
                    {
                        required: true,
                        message: '请输入字典编码',
                        trigger: ['blur', 'change']
                    }
                ],
                itemName: [
                    {
                        required: true,
                        message: '请输入字典名称',
                        trigger: ['blur', 'change']
                    }
                ],
                status: [{ required: true }]
            },
            loadingList: [],
            serviceChecked: [],
            treeData: [],
            checkSelect: [],
            getData: false // 判断是否已经获取数据
        };
    },
    watch: {
        // 点击编辑的时候触发
        'dialogInfo.isShowDialog': {
            handler(val) {
                if (!val) this.serviceChecked = [];
                if (val) {
                    if (this.dialogInfo.authorityType === 'DATA') {
                        this.$service(
                            'get',
                            '/SERVICE-SYSTEM/api/permission/resourcesId/{permissionId2}',
                            {
                                permissionId2: this.rootInfo.dialogInfo
                                    .dialogData.id
                            }
                        ).then(idList => {
                            this.checkSelect = idList;
                        });
                    } else {
                        // 菜单权限按钮
                        this.getHaveResource(this.dialogInfo.dialogData.id);
                    }
                }
            },
            deep: true
        },
        getData: {
            handler(val) {
                console.log('\x1B[32m%s\x1B[0m', '-----------');
                console.log(val);
            },
            deep: true,
            immediate: true
        }
    },
    async mounted() {},
    methods: {
        setDisabled(data) {
            data.map(item => {
                item.disabled = true;
                if (item.children && item.children.length > 0) {
                    this.setDisabled(item.children);
                }
            });
        },
        showTitle() {
            return this.dialogInfo.dialogStatus === 'add'
                ? `配置${
                      this.dialogInfo.authorityType === 'DATA'
                          ? '数据权限'
                          : '功能权限'
                  }`
                : `查看${
                      this.dialogInfo.authorityType === 'DATA'
                          ? '数据权限'
                          : '功能权限'
                  }`;
        },
        cancelClick() {
            this.dialogInfo.isShowDialog = false;
            this.getData = false;
            // 清空选中内容
            if (this.$refs.authorityData) {
                this.$refs.authorityData.clearCheck();
            }
        },
        submitClick() {
            if (this.dialogInfo.authorityType === 'DATA') {
                // 选中的数据进行拼接
                let checkData = [];
                this.getSubmitData(
                    this.$refs.authorityData.treeData || [],
                    checkData
                );
                if (
                    this.$refs.authorityData.$refs.treeRef.getCheckedKeys()
                        .length > 0
                ) {
                    checkData = checkData.concat(
                        this.$refs.authorityData.$refs.treeRef.getCheckedKeys()
                    );
                }
                if (checkData.length < 1) {
                    this.$message.warning('请至少选择一条数据！');
                    return false;
                }
                let params = {
                    permissionId: this.rootInfo.dialogInfo.dialogData.id,
                    resourcesId: [...new Set(checkData)]
                };
                this.$service(
                    'put',
                    '/SERVICE-SYSTEM/api/permission/grant',
                    params
                ).then(res => {
                    this.dialogInfo.isShowDialog = false;
                    if (this.$refs.authorityData) {
                        this.$refs.authorityData.clearCheck();
                    }
                    this.$message.success('提交成功！');
                });
            } else {
                this.$refs.submitPermission.submitClick(
                    this.dialogInfo.dialogData.id
                );
            }
        },
        getSubmitData(data, checkData = []) {
            data.map(item => {
                if (item.rightSelectData && item.rightSelectData.length > 0) {
                    item.rightSelectData.map(childrenItem => {
                        checkData.push(childrenItem);
                    });
                }
                if (item.children && item.children.length > 0) {
                    return this.getSubmitData(item.children, checkData);
                }
            });
        },
        // 获取未进行处理的所有权限表.只是为了展示
        getHaveResource(id) {
            let params = {
                permissionId2: id
            };
            this.$service(
                'get',
                '/SERVICE-SYSTEM/api/permission/resourcesId/{permissionId2}',
                params
            ).then(res => {
                res = res || [];
                this.serviceChecked = res;
                this.getData = true;
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.el-tree > .el-tree-node {
    width: 100% !important;
}
</style>
