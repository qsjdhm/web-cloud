<template>
    <!--程序管理详情页-->
    <vt-page type="one">
        <commons-title
            :options="{text: 'NC程序修订记录'}"
        >
            <template slot="rightPack">
                <span
                    class="return-button"
                    style="float: right; padding-right: 10px;"
                    @click="doReturnClick"
                >
                    <el-button
                        size="mini"
                    >返回</el-button>
                </span>
            </template>
        </commons-title>
        <bs-table
            ref="BsTable"
            :bs-data="bsData"
        >
            <template #changeTime="{scope}">
                <span>{{ scope.row.changeTime !== null ? $moment(scope.row.changeTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
            </template>
            <template #hasSynced="{scope}">
                <span>{{ resolveSyncStatus(scope.row.hasSynced) }}</span>
            </template>
            <template #operate="{scope}">
                <el-button
                    v-has="{role: 'view'}"
                    type="text"
                    @click="doViewClick(scope.row.id)"
                >
                    查看
                </el-button>
                <el-button
                    v-has="{role: 'downLoad'}"
                    type="text"
                    @click="doDownloadClick(scope.row.programFileUrl)"
                >
                    下载
                </el-button>
                <el-button
                    v-has="{role: 'sync'}"
                    :loading="loadingToggle"
                    type="text"
                    @click="doSyncClick(scope.row)"
                >
                    <span v-if="loadingToggle" />
                    <span v-else>同步</span>
                </el-button>
            </template>
        </bs-table>

        <!--NC程序查看弹窗-->
        <NCViewDialog
            :id="changeProgramId"
            ref="NCViewDialog"
        />
    </vt-page>
</template>

<script>
    /**
     * @module 系统管理详情页
     * @author 李志鸣
     */
    import NCViewDialog from "./components/NCViewDialog"
    import request from '@/utils/request'
    import CommonsTitle from '@/components/CommonsTitle'

    export default {
        name: 'ProgramManageView',
        components: {
            NCViewDialog,
            CommonsTitle
        },
        data () {
            return {
                // 数据提交状态开关标识
                loadingToggle: false,
                // 变更程序id
                changeProgramId: '',
                // 表格配置项
                bsData: {
                    tableConfig: {
                        url: '/SERVICE-BUSINESS/api/productionExecutionProgramChangeLog/page',
                        methods: 'GET',
                        params: {
                            programId: this.$route.query.id
                        },
                        data: [],
                        columns: [
                            {label: '文件名称', prop: 'programName'},
                            {label: '修订时间', prop: 'changeTime' ,slotName: 'changeTime'},
                            {label: '同步状态', prop: 'hasSynced', slotName:'hasSynced'},
                            {label: '操作', slotName: 'operate', width: 140}
                        ]
                    }
                }
            }
        },
        watch: {
            $route () {
                this.bsData.tableConfig.params.id = this.$route.query.id
            }
        },
        mounted () {
            setTimeout(() => {
                this.bsData.tableConfig.params.id = this.$route.query.id
            }, 0)
        },
        methods: {
            // 点击查看按钮
            doViewClick (changeProgramId) {
                this.changeProgramId = changeProgramId
                this.$refs.NCViewDialog.dialogToggle = true
            },
            // 点击返回按钮
            doReturnClick () {
                this.$store.dispatch('tagsView/delView', this.$route).then(() => {
                    this.$router.push({
                        path: '/programManage/list'
                    })
                })
            },
            // 同步状态解析
            resolveSyncStatus (status) {
                if (status !== null) {
                    return status ? '已同步': '未同步'
                } else {
                    return '-'
                }
            },
            // 点击下载按钮
            async doDownloadClick (programFileUrl) {
                try {
                    let params = {fileId: programFileUrl}
                    let res = await request({
                        url: `${process.env.VUE_APP_BASE_API}/SERVICE-BUSINESS/api/file/download/${programFileUrl}`,
                        method: 'get',
                        responseType: 'blob'
                    })
                    let objectUrl = URL.createObjectURL(res.data)
                    const link = document.createElement('a')
                    link.download = decodeURI(res.headers.filename)
                    link.href = objectUrl
                    link.click()
                    window.URL.revokeObjectURL(objectUrl)
                } catch (error) {
                    throw error
                }
            },
            // 点击同步按钮
            doSyncClick (changeProgramInfo) {
                this.$confirm(`是否要同步文件名称为 ${changeProgramInfo.programName} 的NC程序文件？`, '提示', {
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.loadingToggle = true
                    // 同步NC程序文件
                    this.syncNCProgram(changeProgramInfo)
                }).catch(() => {
                    this.loadingToggle = false
                })
            },
            // 同步NC程序文件
            async syncNCProgram (changeProgramInfo) {
                try {
                    let params = changeProgramInfo
                    let res = await this.$service('post', '/SERVICE-BUSINESS/api/productionExecutionProgramChangeLog/syncHerc', params)
                    this.$message.success('同步成功！')
                    this.loadingToggle = false
                    this.$refs.BsTable.initTable()
                } catch (error) {
                    this.loadingToggle = false
                    throw error
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .common-title-pack{
        // background: #fff;
        // border-radius: 5px;
        // height: 46px;
        // line-height: 46px;
        .return-pack {
            // padding-right: 15px;
            float: right;
            font-size: 14px;
        }
        .return-button {
            padding-top: 5px;
            padding-right: 10px;
            float: right;
        }
    }
</style>
