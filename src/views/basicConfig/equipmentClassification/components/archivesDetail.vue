<!-- 查看物料清单详情 -->
<template>
    <vt-page type="one">
        <div
            v-loading="loadingList.indexOf('page') > -1"
            class="classification-add-page"
        >
            <div class="page-content pl-10 pr-10">
                <div class="card-pack">
                    <common-title
                        :options="{text: '设备档案信息', MLPx: 10}"
                    />
                    <div
                        id="card-content-pack"
                        class="card-content-pack"
                    >
                        <el-row
                            :gutter="20"
                            style="margin: 0;"
                        >
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">设备定义</span>
                                <span class="span-value">{{ formData.definitionName === '' || formData.definitionName === null ? '-' : formData.definitionName }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">编号</span>
                                <span class="span-value">{{ formData.no === '' || formData.no === null ? '-' : formData.no }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">车间</span>
                                <span class="span-value">{{ formData.workShopName === '' || formData.workShopName === null ? '-' : formData.workShopName }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">入场日期</span>
                                <span class="span-value">{{ formData.arrivalDate === '' || formData.arrivalDate === null ? '-' : $moment(formData.arrivalDate).format('YYYY-MM-DD') }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">责任人</span>
                                <span class="span-value">{{ formData.responsiblePerson === '' || formData.responsiblePerson === null ? '-' : formData.responsiblePerson }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">保修截止时间</span>
                                <span class="span-value">{{ formData.repairExpirationDate === '' || formData.repairExpirationDate === null ? '-' : $moment(formData.repairExpirationDate).format('YYYY-MM-DD') }}</span>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="card-pack">
                    <!-- <div class="common-title-pack">
                        <div class="guide-pack">
                            <div class="line" />
                            <div class="text-pack">设备定义信息</div>
                        </div>
                    </div> -->
                    <common-title
                        :options="{text: '设备定义信息', MLPx: 10}"
                    />
                    <div class="card-content-pack">
                        <el-row
                            :gutter="20"
                            style="margin: 0;"
                        >
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">设备分类</span>
                                <span class="span-value">{{ definitionDetail.categoryName === '' || definitionDetail.categoryName === null ? '-' : definitionDetail.categoryName }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">名称</span>
                                <span class="span-value">{{ definitionDetail.name === '' || definitionDetail.name === null ? '-' : definitionDetail.name }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">型号</span>
                                <span class="span-value">{{ definitionDetail.model === '' || definitionDetail.model === null ? '-' : definitionDetail.model }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">制造商</span>
                                <span class="span-value">{{ definitionDetail.supplierName === '' || definitionDetail.supplierName === null ? '-' :definitionDetail.supplierName }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">尺寸</span>
                                <span class="span-value">{{ definitionDetail.dimension === '' || definitionDetail.dimension === null ? '-' : definitionDetail.dimension }}</span>
                            </el-col>
                            <el-col
                                :span="8"
                                class="detail-title"
                            >
                                <span class="span-label">重量</span>
                                <span class="span-value">{{ definitionDetail.weight === '' || definitionDetail.weight === null ? '-' : definitionDetail.weight }}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 图片列表 -->
                    <equip-img
                        ref="equipImgDom"
                        :table-info="tableInfoImg"
                    />
                    <table-add
                        ref="tableAdd"
                        :table-info="tableAddInfo"
                    >
                        <template #remarks="{scope}">
                            <el-input
                                v-if="tableAddInfo.tableStatus !== 'view'"
                                v-model="scope.row.remarks"
                                type="textarea"
                                :disabled="tableAddInfo.tableStatus === 'view'"
                                placeholder="请输入备注信息"
                            />
                            <span v-else>{{ scope.row.remarks }}</span>
                        </template>
                    </table-add>
                </div>
            </div>
        </div>
    </vt-page>
</template>

<script type="text/ecmascript-6">
    import CommonTitle from './CommonTtile'
import TableAdd from '@/components/newTableCard/tableAdd'
import EquipImg from './equipImg'

export default {
    name: 'ClassificationAdd',
    components: {EquipImg, TableAdd, CommonTitle},
    data () {
        return {
            formData: {
                definitionName: '',
                no: '',
                workshopId: '',
                arrivalDate: '',
                repairExpirationDate: '',
                responsiblePerson: ''
            },
            definitionDetail: {},     // 设备定义详情
            tableAddInfo: {
                propsList: [
                    {prop: 'name', label: '参数名称'},
                    {prop: 'value', label: '参数值'},
                    {prop: 'remarks', label: '参数备注', slot: true}
                ],
                title: '设备参数',
                tableStatus: 'view',    // 当前处于状态 add ,edit ,view
                showSelect: false,      // 是否显示table选者框
                tableData: []           // 数据
            },
            tableInfoImg: {
                photosList: [],
                tableStatus: 'view'
            },
            loadingList: []
        }
    },
    watch: {},
    mounted () {
        this.getDetail()
    },
    methods: {
        async getDetail () {
            try {
                this.loadingList.push('page')
                let params = {
                    equipmentId: this.$route.query.id,
                    hash: 'equipmentId'
                }
                let res = await this.$service('GET', '/SERVICE-BUSINESS/api/equipment/{equipmentId}', params)
                // let res = await this.$fetch('equipment-controller/equipmentId-get', params)
                this.formData = _.cloneDeep(res)
                this.getDefinitionDetail(res.definitionId)
                this.loadingList = []
            } catch (error) {
                this.loadingList = []
            }
        },
        async getDefinitionDetail (id) {
            try {
                let params = {
                    equipmentDefinitionId: id,
                    hash: 'equipmentDefinitionId'
                }
                let res =  await this.$service('GET', '/SERVICE-BUSINESS/api/equipmentDefinition/{equipmentDefinitionId}', params)
                // let res =  await this.$fetch('equipment-definition-controller/equipmentDefinitionId-get', params)
                this.definitionDetail = res
                this.tableAddInfo.tableData = res.parameters
                this.tableInfoImg.photosList = res.photos
                this.loadingList = []
            } catch (error) {
                this.loadingList = []
            }
        },
        backClick () {
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push({ path: '/basicConfig/equipmentArchives'})
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    /deep/ .list-contain {
        display: flex;
        flex-direction: column;
        padding: 0;
        // .return-pack {
        //     float: right;
        //     height: 45px;
        //     line-height: 45px;
        //     font-size: 14px;
        // }
    }
    .classification-add-page {
        position: relative;
        height: 100%;
        width: 100%;
        // border: 1px solid #d2d3d5;
        background-color: #fff;
        border-radius: 6px;

        .page-title {
            height: 38px;
            line-height: 38px;
            border-bottom: 1px solid #d2d3d5;
        }

        .page-content {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            overflow-y: auto;
            overflow-x: hidden;

            .card-pack {
                // margin-bottom: 15px;

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

                .card-tool-pack {
                    padding: 10px 10px 0 10px;
                    // border-left: 1px solid #d2d3d5;
                    // border-right: 1px solid #d2d3d5;
                }

                .card-content-pack {
                    @include rdc-box-sizing;
                    // padding: 10px;
                    width: 100%;
                    // height: 100%;
                    // border-left: 1px solid #d2d3d5;
                    // border-right: 1px solid #d2d3d5;
                    // border-bottom: 1px solid #d2d3d5;


                    .img-dialog {

                        .el-dialog {

                            .el-dialog__header {

                                .el-dialog__headerbtn {
                                    top: 4px !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>

