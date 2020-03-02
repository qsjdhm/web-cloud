<!-- 工艺图纸 -->
<template>
    <div class="card-pack">
        <common-title :options="{text: '设备图片', MLPx: 10}" />
        <div class="card-tool-pack clear-float pl-10 pr-10">
            <div
                v-if="tableInfo.tableStatus !== 'view'"
                style="margin-bottom:10px;float:right;margin-top:-35px"
            >
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="addParameterClick"
                >新增</el-button>
            </div>
        </div>
        <div class="card-content-pack">
            <el-table
                stripe
                border
                style="width: 100%"
                empty-text="暂无数据显示"
                :data="tableList"
            >
                <el-table-column
                    prop="url"
                    label="图片"
                    align="center"
                >
                    <template slot-scope="scope">
                        <div class="block">
                            <el-image
                                v-image-preview
                                fit
                                style="width: 120px;height: 32px;"
                                :src="scope.row.urlBase64"
                            >
                                <div
                                    slot="placeholder"
                                    class="image-slot"
                                >
                                    加载中<span class="dot">...</span>
                                </div>
                            </el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.description? scope.row.description: '暂无描述' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableInfo.tableStatus !== 'view'"
                    label="操作"
                    width="150"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            class="delete-button"
                            @click="editClick(scope)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            class="delete-button"
                            @click="deleteClick(scope.$index)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            v-drag-dialog
            append-to-body
            title="添加图片"
            :visible.sync="tableDialog"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="600px"
        >
            <div
                class="materials-dialog"
                style="overflow-y: auto"
            >
                <el-form
                    ref="dialogDom"
                    label-width="100px"
                    label-position="top"
                    :model="dialogData"
                >
                    <el-row>
                        <el-col :span="24">
                            <el-form-item
                                label="图片上传："
                                :rules="[{ required: true, message: '请上传图片',trigger: 'blur'}]"
                            >
                                <upload-file
                                    ref="uploadDom"
                                    :upload-info="uploadInfo"
                                    @uploadSuccess="uploadSuccess"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item
                                :rules="[{ required: true, message: '请输入描述内容',trigger: 'blur'}]"
                                label="描述："
                                prop="description"
                            >
                                <el-input
                                    v-model="dialogData.description"
                                    show-word-limit
                                    maxlength="250"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入描述内容"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer text-center"
            >
                <el-button
                    size="mini"
                    icon="el-icon-circle-close"
                    @click="cancelClick('dialogDom')"
                >取消</el-button>
                <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-circle-check"
                    :loading="loadingList.indexOf('save') > -1"
                    @click="confirmClick('dialogDom')"
                >确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/*
 *  表格进行新增处理
 * */
import CommonTitle from '@/views/basicConfig/equipmentClassification/components/CommonTtile';
import UploadFile from '@/components/upload/uploadFile';

export default {
    name: 'EquipImg',
    components: { UploadFile, CommonTitle },
    props: {
        tableInfo: {
            type: Object,
            default: () => {
                return {
                    photosList: [],
                    tableStatus: 'add'
                };
            }
        }
        //  timmingDate: {
        //     //  type: String,
        //     //  required:true
        //  }
    },
    // 工艺图纸
    data() {
        return {
            tableList: this.tableInfo.photosList, //tableList数据
            dialogData: {
                url: '',
                description: ''
            },
            tableDialog: false,
            // 上传文件信息
            uploadInfo: {
                api: '/SERVICE-BUSINESS/api/file/upload',
                type: 'image'
            },
            clickIndex: '',
            loadingList: [],
            dialogStatus: 'add', // 状态
            tempTableList: []
        };
    },
    watch: {
        tableInfo: {
            async handler(newVal, oldVal) {
                // this.tableList = val
                let tableList = _.cloneDeep(newVal.photosList);
                for (let item of tableList) {
                    item.urlBase64 = await this.$service(
                        'GET',
                        '/SERVICE-BUSINESS/api/file/base64',
                        { fileId: item.url }
                    );
                    // item.urlBase64 = await this.$fetch('grid-fs-controller/base64-get', {fileId: item.url})
                }
                this.tableList = tableList;
            },
            deep: true
        }
    },
    mounted() {},
    methods: {
        clearData() {
            this.tableList = [];
        },
        addParameterClick() {
            this.tableDialog = true;
            this.dialogStatus = 'add';
        },
        // 删除某一项参数点击事件
        deleteClick(index) {
            this.tableList.splice(index, 1);
        },
        editClick(scope) {
            this.dialogStatus = 'edit';
            this.tableDialog = true;
            this.clickIndex = scope.$index;
            this.$nextTick(() => {
                this.dialogData = _.cloneDeep(scope.row);
            });
        },
        async confirmClick(formName) {
            this.loadingList.push('save');
            if (!this.dialogData.url) {
                this.$message.warning('请上传图片');
                this.loadingList.splice(0);
                // this.$set(this.loadingList, 'save', '')
                return false;
            }
            if (!this.dialogData.description) {
                this.$message.warning('请填写描述');
                this.loadingList.splice(0);
                return false;
            }
            if (this.dialogStatus === 'add') {
                this.dialogData.urlBase64 = await this.$service(
                    'GET',
                    '/SERVICE-BUSINESS/api/file/base64',
                    { fileId: _.cloneDeep(this.dialogData).url }
                );
                // this.dialogData.urlBase64 = await this.$fetch('grid-fs-controller/base64-get', {fileId: _.cloneDeep(this.dialogData).url})
                this.tableList.unshift(_.cloneDeep(this.dialogData));
            } else {
                this.dialogData.urlBase64 = await this.$service(
                    'GET',
                    '/SERVICE-BUSINESS/api/file/base64',
                    { fileId: _.cloneDeep(this.dialogData).url }
                );
                this.$set(
                    this.tableList,
                    this.clickIndex,
                    _.cloneDeep(this.dialogData)
                );
            }
            this.tableDialog = false;
            this.loadingList = [];
            this.$refs.uploadDom.clearFiles();
            this.$refs[formName].resetFields();
            this.$clearObject(this.dialogData);
        },
        cancelClick(formName) {
            this.tableDialog = false;
            this.$refs.uploadDom.clearFiles();
            this.$refs[formName].resetFields();
            this.$clearObject(this.dialogData);
        },
        uploadSuccess(val) {
            this.dialogData = { ...this.dialogData, ...val };
        },
        downLoad(scope) {
            let params = {
                id: scope.row.url
            };
            this.$service('GET', '/FileManger/api/file/download', params).then(
                resData => {
                    let objectUrl = URL.createObjectURL(
                        new Blob([resData.data])
                    );
                    const link = document.createElement('a');
                    link.download = decodeURI(resData.headers.filename);
                    link.href = objectUrl;
                    link.click();
                    window.URL.revokeObjectURL(objectUrl);
                }
            );
            // this.$store.dispatch('FileManger/downFile', params).then((resData) => {
            //     let objectUrl = URL.createObjectURL(new Blob([resData.data]))
            //     const link = document.createElement('a')
            //     link.download = decodeURI(resData.headers.filename)
            //     link.href = objectUrl
            //     link.click()
            //     window.URL.revokeObjectURL(objectUrl)
            // })
        }
    }
};
</script>

<style lang="scss">
.card-pack .el-dialog .el-dialog__header {
    text-align: left !important;
    background: #3c76e2 !important;
    padding-top: 10px;
}
.card-pack {
    margin-bottom: 10px;

    .input-box {
        display: -webkit-flex;
        display: flex;
        align-items: center;
    }

    .required-remark {
        color: #f56c6c;
        margin-right: 10px;
    }

    .card-title-pack {
        height: 32px;
        line-height: 32px;
        // border: 1px solid #d2d3d5;
        // background: #f6f6f6;

        .card-title-text {
            font-size: 14px;
            font-weight: bold;
        }
    }

    .card-content-pack {
        @include rdc-box-sizing;
        // padding: 10px;
        width: 100%;
        // height: 100%;
        max-height: 800px;
        overflow: auto;
        // border-left: 1px solid #d2d3d5;
        // border-right: 1px solid #d2d3d5;
        // border-bottom: 1px solid #d2d3d5;
    }
}
</style>

