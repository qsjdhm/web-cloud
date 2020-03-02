<!--设备档案组件 -->
<template>
    <div class="flie-page">
        <div class="flie-box">
            <!-- <div class="file-header">
                设备档案
            </div> -->
            <common-title :options="{text: '设备档案', MLPx: 10}" />
            <div class="flie-footer">
                <div class="footer-image">
                    <viewer
                        v-if="photos.length !== 0"
                        class="viewer"
                        :images="photos"
                    >
                        <img
                            v-for="(item,index) in photos"
                            :key="index"
                            :src="item"
                        >
                    </viewer>
                    <img src="../../../assets/monitoring/default.jpg">
                </div>
                <div class="footer-text">
                    <el-row :gutter="20">
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">设备编号</span>
                            <span class="span-value">{{ deveiceDetailsList.no === '' || deveiceDetailsList.no === null ? '-' : deveiceDetailsList.no }}</span>
                        </el-col>
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">制造商</span>
                            <span class="span-value">{{ deveiceDetailsList.supplierName === '' || deveiceDetailsList.supplierName === null ? '-' : deveiceDetailsList.supplierName }}</span>
                        </el-col>
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">设备名称</span>
                            <span class="span-value">{{ deveiceDetailsList.definitionName === '' || deveiceDetailsList.definitionName === null ? '-' : deveiceDetailsList.definitionName }}</span>
                        </el-col>
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">保修截止日期</span>
                            <span class="span-value">{{ deveiceDetailsList.repairExpirationDate === '' || deveiceDetailsList.repairExpirationDate === null ? '-' : $moment(deveiceDetailsList.repairExpirationDate).format('YYYY-MM-DD') }}</span>
                        </el-col>
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">设备型号</span>
                            <span class="span-value">{{ deveiceDetailsList.model === '' || deveiceDetailsList.model === null ? '-' : deveiceDetailsList.model }}</span>
                        </el-col>
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">入场日期</span>
                            <span class="span-value">{{ deveiceDetailsList.arrivalDate === '' || deveiceDetailsList.arrivalDate === null ? '-' : $moment(deveiceDetailsList.arrivalDate).format('YYYY-MM-DD') }}</span>
                        </el-col>
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">责任人</span>
                            <span class="span-value">{{ deveiceDetailsList.responsiblePerson === '' || deveiceDetailsList.responsiblePerson === null ? '-' : deveiceDetailsList.responsiblePerson }}</span>
                        </el-col>
                        <el-col
                            :span="12"
                            class="detail-title"
                        >
                            <span class="span-label">状态</span>
                            <span class="span-value">
                                <span
                                    v-for="(item, index) in tagStatus"
                                    :key="index"
                                >
                                    <el-tag
                                        v-if="item.en === deveiceDetailsList.status"
                                        :key="index"
                                        :type="item.type"
                                    >
                                        {{ item.cn }}
                                    </el-tag>
                                </span>
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * @module 设备监控-设备档案
 * @author qichaung
 */
import CommonTitle from '@/components/CommonsTitle/index';
export default {
    components: {
        CommonTitle
    },
    props: {
        fatherId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            tagStatus: [
                { en: 'IDLE', cn: '闲置', type: 'info' },
                { en: 'USING', cn: '使用中', type: 'success' },
                { en: 'FAILURE', cn: '维修', type: 'warning' },
                { en: 'SCRAP', cn: '报废', type: 'danger' }
            ], // 设备状态
            photos: [], // 图片数据
            deveiceDetailsList: {
                no: '',
                supplierName: '',
                definitionName: '',
                repairExpirationDate: '',
                model: '',
                arrivalDate: '',
                responsiblePerson: '',
                status: ''
            } // 档案数据
        };
    },
    watch: {
        fatherId: {
            handler(val) {
                console.log(val);
                this.fatherId = _.cloneDeep(val);
                if (this.fatherId !== '') {
                    this.getDeveiceDetails();
                }
            },
            deep: true,
            immediate: true
        }
    },
    async mounted() {},
    methods: {
        // 获取设备档案详情数据
        async getDeveiceDetails() {
            let params = {
                equipmentNo: this.fatherId
            };
            let res = await this.$service(
                'get',
                '/SERVICE-BUSINESS/api/equipment/details/{equipmentNo}',
                params
            );
            this.deveiceDetailsList = _.cloneDeep(res);
            this.photos = _.cloneDeep(res.photos);
        }
    }
};
</script>

<style lang="scss" scoped>
.flie-page {
    width: 100%;
    height: 100%;

    .flie-box {
        width: 100%;
        height: 190px;
        background: #fff;
        border-radius: 8px;
        padding: 5px 10px;

        .file-header {
            width: 100%;
            height: 30px;
            border-bottom: 1px solid #f1f1f1;
        }

        .flie-footer {
            width: 100%;
            height: 150px;

            .footer-image {
                width: 180px;
                float: left;
                height: 150px;
                padding: 10px 0px 8px;
                overflow: hidden;

                .viewer {
                    height: 148px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .footer-text {
                margin-left: 190px;
                padding: 10px 15px 8px;
            }
        }
    }
}
</style>
