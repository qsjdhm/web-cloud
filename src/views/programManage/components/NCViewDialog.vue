<template>
    <!--NC程序查看弹框-->
    <div>
        <el-dialog
            class="setDialog"
            title="NC程序查看"
            :visible.sync="dialogToggle"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="500px"
        >
            <div
                v-loading="loadingToggle"
                class="nc-content-pack"
            >
                <div v-html="NCData" />
            </div>
            <span slot="footer">
                <el-button
                    size="small"
                    @click="doCloseClick()"
                >
                    关闭
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    /**
     * @module 系统管理NC程序查看弹框
     * @author 李志鸣
     */
    export default {
        name: 'NCViewDialog',
        props: {
            id: {
                type: null,
                required: true,
            }
        },
        data () {
            return {
                // 弹框开关标识
                dialogToggle: false,
                // 加载开关
                loadingToggle: true,
                // NC程序数据
                NCData: ''
            }
        },
        watch: {
            dialogToggle (newVal, oldVal) {
                if (this.dialogToggle) {
                    // 获取程序内容
                    this.getProgramContent()
                }
            }
        },
        methods: {
            // 点击关闭按钮
            doCloseClick () {
                this.dialogToggle = false
                this.loadingToggle = false
                this.NCData = ''
            },
            // 获取程序内容
            async getProgramContent () {
                try {
                    this.loadingToggle = true
                    let params = {id: this.id}
                    let NCData = _.clone(await this.$service('get', '/SERVICE-BUSINESS/api/productionExecutionProgramChangeLog/content/{id}', params))
                    let resolveNCData = NCData.replace(/\t\n|\n/g, '<br/>')
                    this.NCData = resolveNCData
                    this.loadingToggle = false
                } catch (error) {
                    this.loadingToggle = false
                    throw error
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .nc-content-pack {
        width: 100%;
        height: 400px;
        overflow-y: auto;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        padding: 15px;
        font-size: 12px;
        .el-row {
            padding: 5px;
        }
    }
</style>
