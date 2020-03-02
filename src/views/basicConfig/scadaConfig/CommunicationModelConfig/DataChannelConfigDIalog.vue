<template>
    <el-dialog
        v-drag-dialog
        title="查看通道信息"
        :visible.sync="viewChanneleDialog"
        :show-close="false"
        width="850px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <div
            style="margin-bottom:10px"
            class="tool-pack clear-float pl-15 pr-15"
        >
            <div class="float-right">
                <el-input
                    v-model="searchValue"
                    clearable
                    style="width: 500px; margin-right: 20px"
                    size="mini"
                    maxlength="30"
                    class="search-imput"
                    placeholder="请输入搜索关键字"
                    @input="searchClick()"
                />
                <el-button
                    style="margin-right: 10px"
                    size="mini"
                    icon="el-icon-search"
                    type="primary"
                    @click="searchClick()"
                >搜索</el-button>
                <el-button
                    style="margin-right: 50px"
                    size="mini"
                    class="bt-class"
                    @click="resetHandle()"
                >重置</el-button>
            </div>
        </div>
        <PageTable
            ref="generalTableDom"
            :configuration="ChannelTableconfiguration"
            :data-list="dataChannelList"
            border
            @onSelectChange="onSelectChange"
            @onSizeChange="onSizeChange"
            @onCurrentChange="onCurrentChange"
        >
            <!-- 状态 -->
            <template #status="{scope}">
                <!-- :disabled="!$has($route,'disable')" -->
                <el-switch
                    v-model="scope.row.status"
                    disabled
                    active-color="#409eff"
                    inactive-color="#dcdfe6"
                    active-value="1"
                    inactive-value="0"
                />
            </template>
            <!-- 类型 -->
            <template #type="{scope}">
                <span v-if="scope.row.type === '1'">mqtt</span>
                <span v-if="scope.row.type === '2'">modbus</span>
                <span v-if="scope.row.type === '3'">tcp</span>
                <span v-if="scope.row.type === '4'">opcua</span>
                <span v-if="scope.row.type === '5'">ftp</span>
            </template>
        </PageTable>
        <span slot="footer">
            <el-button
                size="mini"
                icon="el-icon-circle-close"
                @click="CancelClick()"
            >取消</el-button>
            <el-button
                size="mini"
                type="primary"
                icon="el-icon-circle-check"
                @click="selectedChannelListConfirm()"
            >确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
import PageTable from '@/components/Table/index';
export default {
    components: {PageTable},
    props: {
        dataChannelName: {
            type: null,
            required: true
        }
    },
    data () {
        return {
            // 通道列表数据
            dataChannelList: [],
            // 模态框的显示隐藏
            viewChanneleDialog: false,
            // 表格配置项
            ChannelTableconfiguration: {
                propsList: [
                    {
                        prop: 'name',
                        label: '名称',
                        sortable: true,
                        // 'min-width': 180,
                        fixed: 'left'
                    },
                    {
                        prop: 'type',
                        label: '类型',
                        slot: true,
                        sortable: true,
                        // 'width': 180,
                        fixed: 'left'
                    },
                    {
                        prop: 'status',
                        label: '状态',
                        sortable: true,
                        slot: true,
                        // 'width': 80,
                        fixed: 'left'
                    },
                    {
                        prop: 'remarks',
                        label: '备注',
                        sortable: true,
                        // 'min-width': 180,
                        fixed: 'left'
                    }
                ],
                pagination: {
                    total: 0, // 总数
                    pageNum: 1, // 当前列表页
                    pageSize: 20 // 当前列表数量
                },
                tableHeight: '400', // 表格高度
                paginationPack: true, //是否展示分页
                showSelect: true, //多选
                showIndex: true, //加载行号
                stripe: true, // 表格斑马线
                loading: false, // 加载标识
                radio: true
            },
            // 搜索内容
            searchValue: '',
            // 选择的通道列表
            selectedChannelList: []
        }
    },
    watch: {
        viewChanneleDialog (newVal, oldVal) {
            if (this.viewChanneleDialog) {
                this.getChannelListData();
            }
        }
    },
    methods: {
        // 获取通道列表数据
        getChannelListData () {
            this.ChannelTableconfiguration.loading = true;
            let params = {
                pageNum: this.ChannelTableconfiguration.pagination.pageNum,
                pageSize: this.ChannelTableconfiguration.pagination.pageSize,
                queryVO: {},
                types: [2]
            };
            this.$service('POST', '/SERVICE-SCADA/api/channel/page', params).then(res => {
                this.dataChannelList = _.cloneDeep(res.list);
                this.ChannelTableconfiguration.pagination.total = _.cloneDeep(res.total)
                this.ChannelTableconfiguration.loading = false;
            })
        },
        // 搜索
        searchClick () {
            let params = {
                pageNum: this.ChannelTableconfiguration.pagination.pageNum,
                pageSize: this.ChannelTableconfiguration.pagination.pageSize,
                keywords: this.searchValue
            };
            this.$service('POST', '/SERVICE-SCADA/api/channel/page', params).then(res => {
                this.dataChannelList = _.cloneDeep(res.list);
                this.ChannelTableconfiguration.pagination.total = _.cloneDeep(res.total)
            })
        },
        // 重置
        resetHandle () {
            this.searchValue = '';
            this.getChannelListData();
        },
        onSizeChange (val) {
            this.ChannelTableconfiguration.pagination.pageSize = val;
            this.getChannelListData()
        },
        onCurrentChange (val) {
            this.ChannelTableconfiguration.pagination.pageNum = val;
            this.getChannelListData()
        },
        // 选择数据通道
        onSelectChange (selectValue) {
            this.selectedChannelList = _.cloneDeep(selectValue[0])
        },
        //取消
        CancelClick () {
            this.viewChanneleDialog = false;
        },
        // 确认
        selectedChannelListConfirm () {
            let channeldataList = [];
            channeldataList = _.cloneDeep(this.selectedChannelList)
            this.$emit('SelectedChannelListConfirm', channeldataList)
        }
    }
}
</script>

<style>

</style>