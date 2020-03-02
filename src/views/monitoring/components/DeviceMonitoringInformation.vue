<!-- 设备监控右侧页面 -->
<template>
    <div class="device-page">
        <el-tabs v-model="activeName">
            <el-tab-pane
                label="设备监控信息"
                name="first"
            >
                <MonitorInformation :father-id="categoryId" />
            </el-tab-pane>
            <el-tab-pane
                label="设备生产信息"
                name="second"
            >
                <ProductionInformation
                    v-if="activeName ==='second'"
                    :father-id="categoryId"
                />
            </el-tab-pane>
            <el-tab-pane
                label="设备档案"
                name="third"
            >
                <DeviceFile
                    v-if="activeName ==='third'"
                    :father-id="categoryId"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
/**
 * @module 设备监控-右侧teb页面
 * @author 齐闯
 */
//设备监控信息
import MonitorInformation from './MonitorInformation.vue';
//设备生产信息
import ProductionInformation from './ProductionInformation.vue';
//设备档案
import DeviceFile from './DeviceFile.vue';
export default {
    components: {
        MonitorInformation,
        ProductionInformation,
        DeviceFile
    },
    props: {
        categoryId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            activeName: 'first',
            fatherId: ''
        };
    },
    watch: {
        // categoryId: {
        //     handler (val) {
        //         console.log(val)
        //         this.categoryId = _.cloneDeep(val)
        //     },
        //     deep: true,
        //     immediate: true
        // }
        categoryId(val) {
            console.log(val);
            this.fatherId = _.cloneDeep(val);
        }
    },
    async mounted() {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.device-page {
    width: 100%;
    height: 100%;

    /deep/.el-tabs {
        width: 100%;
        height: 100%;
        position: relative;

        .el-tabs__header {
            background: #fff !important;
            padding: 0 10px 0 10px !important;
            border-radius: 4px;

            .el-tabs__item {
                font-size: 12px !important;
            }
        }

        //teb样式重置
        .el-tabs__nav-scroll {
            width: 100%;
        }
        ::after {
            background-color: #fff !important;
        }
        .el-tabs__content {
            width: 100%;
            position: absolute;
            left: 0;
            right: 0;
            top: 46px;
            bottom: 0;
            border-radius: 4px;

            .el-tab-pane {
                width: 100%;
                height: 100%;
                position: relative;
            }
        }
    }
}
</style>
