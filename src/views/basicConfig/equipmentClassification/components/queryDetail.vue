<!--  查看设备定义详情 -->
<template>
    <vt-page type="one">
        <div
            v-loading="loadingList.indexOf('page') > -1"
            class="equipment-page"
        >
            <div class="page-content">
                <common-title
                    :options="{text: '基础信息', MLPx: 10}"
                />
                <div class="card-content-pack pl-10 pr-10">
                    <el-row :gutter="20">
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">设备分类</span>
                            <span class="span-value">{{ dialogData.categoryName === '' || dialogData.categoryName === null ? '-' : dialogData.categoryName }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">设备名称</span>
                            <span class="span-value">{{ dialogData.name === '' || dialogData.name === null ? '-' : dialogData.name }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">设备型号</span>
                            <span class="span-value">{{ dialogData.model === '' || dialogData.model === null ? '-' : dialogData.model }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">制造商</span>
                            <span class="span-value">{{ dialogData.supplierName === '' || dialogData.supplierName === null ? '-' : dialogData.supplierName }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">设备类型</span>
                            <span class="span-value">{{ dialogData.type === '' || dialogData.model === null ? '-' : dialogData.model }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">尺寸</span>
                            <span class="span-value">{{ dialogData.dimension === '' || dialogData.dimension === null ? '-' : dialogData.dimension }}</span>
                        </el-col>
                        <el-col
                            :span="8"
                            class="detail-title"
                        >
                            <span class="span-label">重量(kg)</span>
                            <span class="span-value">{{ dialogData.weight === '' || dialogData.weight === null ? '-' : dialogData.weight }}</span>
                        </el-col>
                    </el-row>
                    <!-- 图片列表 -->
                    <equip-img
                        ref="equipImgDom"
                        :table-info="tableInfoImg"
                    />
                    <!-- 设备参数 -->
                    <table-add
                        ref="tableAdd"
                        :table-info="tableAddInfo"
                    >
                        <template #remarks="{scope}">
                            {{ scope.row.remarks }}
                        </template>
                    </table-add>
                </div>
            </div>
        </div>
    </vt-page>
</template>

<script type="text/ecmascript-6">
/*
* 1. 跳转返回没有进行选中默认的状态
* */
import CommonTitle from './CommonTtile'
import TableAdd from '@/components/newTableCard/tableAdd'
import EquipImg from '@/views/basicConfig/equipmentClassification/components/equipImg'

export default {
    name: 'CheckTask',
    components: {
        EquipImg,
        TableAdd,
        CommonTitle
    },
    component: {},
    data () {
        return {
            dialogData: {
                categoryName: '',   // 分类名字
                name: '',   // 名称
                model: '',   // 型号
                dimension: '', // 尺寸
                supplierId: '',  // 制造商id
                weight: '',           // 重量
                type: ''  //设备类型
            },
            formRules: {
                name: [{required: true, message: '请输入名称', trigger: ['blur', 'change']}],
                model: [{required: true, message: '请输入型号', trigger: ['blur', 'change']}],
                supplierId: [{required: true, message: '请输入制造商', trigger: ['blur', 'change']}],
                dimension: [{required: true, message: '请输入版本号', trigger: ['blur', 'change']}],
                weight: [{required: true, message: '请输入重量', trigger: ['blur', 'change']}]
            },
            tableAddInfo: {
                propsList: [
                    {prop: 'name', label: '参数名称'},
                    {prop: 'value', label: '参数值'},
                    {prop: 'remarks', label: '参数备注', slot: true}
                ],
                title: '设备参数',
                tableStatus: 'view',    // 当前处于状态 add ,edit ,view
                showSelect: false,      // 是否显示table选者框
                tableData: []          // 数据
            },
            tableInfoImg: {
                photosList: [],
                tableStatus: 'view'
            },
            factoryOptions: [],
            loadingList: []
        }
    },
    beforeRouteEnter (to, from, next) {
        next()
    },
    created () {
    },
    mounted () {
        this.getDetail()
        console.log('进入了查看页面')
        // this.getFactoryOptions()
        // this.getTemplateOptions()
    },
    methods: {
        async getDetail () {
            try {
                this.loadingList.push('page')
                let params = {
                    equipmentDefinitionId: this.$route.query.id,
                    hash: 'equipmentDefinitionId'
                }
                // let res = await this.$fetch('equipment-definition-controller/equipmentDefinitionId-get', params)
                let res = await this.$service('GET', '/SERVICE-BUSINESS/api/equipmentDefinition/{equipmentDefinitionId}', params)
                console.log(res)
                this.dialogData = res
                this.tableInfoImg.photosList = res.photos
                this.tableAddInfo.tableData = res.parameters
                this.loadingList = []
            } catch (error) {
                this.loadingList = []
            }
        },
        // getFactoryOptions (val) {
        //     let params = {
        //         pageNum: 1,
        //         pageSize: 500,
        //         search: val
        //     }
        //     this.$service('GET', '/SERVICE-BUSINESS/api/supplier/page', params).then((res) => {
        //         this.factoryOptions = res.list
        //     })
        // },
        // 获取维护模板
        // getTemplateOptions (val) {
        //     let params = {
        //         pageNum: 1,
        //         pageSize: 500,
        //         search: val
        //     }
        //     this.$fetch('equipment-maintenance-template-controller/page-get', params).then((res) => {
        //         this.templateOptions = res.list
        //     })
        // },
        /* 新增或编辑确认按钮  */
        async saveClick () {
            let params = {
                categoryId: this.$route.query.categoryId,
                ...this.dialogData,
                photos: this.$refs.equipImgDom.tableList,
                parameters: this.$refs.tableAdd.tableList
            }
            console.log(params)
            this.$service('POST', '/SERVICE-BUSINESS/api/equipmentDefinition', params).then((res) => {
                this.$refs.tableAdd.clearData()
                this.$store.dispatch('TabsView/delTabsView', this.$route.path).then(() => {
                    this.$router.push({path: this.$route.query.from || '/account/query'})
                })
            })
        },
        cancelClick () {
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push({ path: '/basicConfig/equipmentClassification'})
            })
        },
        /* ========= 表单 end =======*/
        // 返回点击事件
        backClick () {
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                this.$router.push({ path: '/basicConfig/equipmentClassification'})
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

        .equipment-page {
            position: relative;
            height: 100%;
            flex: 1;
            width: 100%;
            // border: 1px solid #d2d3d5;
            border-radius: 6px;
            background-color: #fff;

            .page-title {
                height: 38px;
                line-height: 38px;
                border-bottom: 1px solid #d2d3d5;
            }

            .page-content {
                position: absolute;
                top: 0px;
                bottom: 0;
                left: 0;
                right: 0;
                // padding: 10px;
                overflow-y: auto;
                overflow-x: hidden;

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

