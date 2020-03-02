<!-- 树形结构 -->
<template>
    <div class="genre-tree-pack float-left clear-float">
        <div class="title-pack clear-float pl-15 pr-15 pt-10">
            <div class="float-left">
                <span class="page-title-text">{{ treeProps.title }}</span>
            </div>
        </div>
        <div class="tree-main-pack">
            <el-input
                v-model="filterText"
                clearable
                style="padding: 10px"
                placeholder="请输入搜索关键字"
                class="mb-10"
            />
            <el-tree
                ref="classificationTree"
                v-loading="treeLoading"
                class="filter-tree"
                :default-expand-all="false"
                highlight-current
                empty-text="暂无分类数据..."
                node-key="id"
                :default-expanded-keys="expandedKeys"
                :data="treeList"
                :props="{ children: 'children', label: 'name'}"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @node-click="onTreeNodeClick"
                @node-expand="nodeExpand"
            >
                <span
                    slot-scope="{ node, data }"
                    class="custom-tree-node"
                >
                    <span class="class-name">{{ data.name }}</span>
                </span>
            </el-tree>
        </div>
        <!--新建和编辑分类-->
        <el-dialog
            v-drag-dialog
            :title="treeDialogTitle"
            :visible.sync="treeDialog"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="450px"
        >
            <el-form
                ref="addTreeDom"
                label-width="80px"
                label-position="right"
                :model="addTreeData"
                :rules="treeRules"
            >
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item
                            label="编码："
                            prop="no"
                        >
                            <el-input
                                v-model.trim="addTreeData.no"
                                size="small"
                                placeholder="请输入编码"
                                :maxlength="$global.string"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            label="名称："
                            prop="name"
                        >
                            <el-input
                                v-model.trim="addTreeData.name"
                                size="small"
                                placeholder="请输入名称"
                                :maxlength="$global.string"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col
                        v-if="treeDialogStatus === 'edit'"
                        :span="24"
                    >
                        <el-form-item
                            label="层级："
                            prop="level"
                        >
                            <el-input
                                v-model="addTreeData.level"
                                :disabled="true"
                                size="small"
                                :maxlength="$global.string"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer text-center"
            >
                <el-button
                    size="small"
                    icon="el-icon-close"
                    @click="treeCancelClick('addTreeDom')"
                >取消</el-button>
                <el-button
                    :loading="loadingList.indexOf('save') > -1"
                    size="small"
                    type="primary"
                    icon="el-icon-check"
                    @click="addTreeConfirmClick('addTreeDom')"
                >确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    /*
    *
    * 树形tree
    * */
    export default {
        name: 'TreeClassBadge',
        props: {
            treeProps: {
                type: Object,
                default: () => {
                    return {
                        newTreeList: [],
                        forbid: false,
                        version: 'v1',          // 当前版本组件版本号
                        title: '分类',            // 树形结构标题
                        hiddenOperate: false,    // 隐藏操作按钮
                        deleteStatus: false,          // 刪除禁用状态
                        api: '',                 // 接口api
                        params: {},            //参数,//  type: 1.标识为物料分类，2表示为产品分类，3为工艺分类，4为设备分类，5故障分类
                        listAPI: {               // 新整接口
                            api: '',
                            params: {}
                        },
                        addAPI: {               // 新整接口
                            api: '',
                            params: {}
                        },
                        editAPI: {                 // 编辑借口
                            api: '',
                            params: {}
                        },
                        enableAPI: {                // 启用和禁用接口
                            api: '',
                            params: {}
                        }
                    }
                }
            },
            treeList: {
                type: Array,
                default: () => []
            },
            selectData: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                expandedKeys: [],
                loadingList: [],
                /* 左侧树形数据 start */
                treeDialogTitle: '',        // 树形弹窗标题
                treeCurrentData: {},        // 存储点击树形图节点的数据
                treeLoading: false,         // tree loading状态
                treeDialog: false,          // 新建和编辑弹框显示隐藏的标志
                treeDialogStatus: '',       // 当前树形图当前处于状态  编辑:edit ,新增:new
                editTreeDialog: false,      // 编辑弹框标志
                addTreeData: {
                    no: '',
                    name: '',
                    level: ''
                },
                filterText: '',             // 树形结构过滤关键字
                treeRules: {
                    no: [{required: true, message: '请输入编码', trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                },
                typeName: '',                 //当前选中的树节点的名称
                treeNode: '',                     // 当前选中的树的数据
                // 停用列表数据
                currentNodeKey: 3,             // 当前选中节点
                clickId: ''
            }
        },
        watch: {
            // tree 进行过滤
            filterText (val) {
                this.$refs.classificationTree.filter(val)
            },
            // 监控传递过来数据列表
            'treeList': {
                async handler (val) {
                    if (val && val.length > 0) {
                        /*  todo DOM 未更新完成如何进行渲染 */
                        await this.$sleep(500)
                        this.expandedKeys = [val[0].id]
                        this.$refs.classificationTree.setCurrentKey(val[0].id)
                        this.$parent.$parent.getFirstTableList()
                    }
                },
                deep: true,
                immediate: true
            },
            'selectData': {
                handler (val) {
                },
                deep: true,
                immediate: true
            }
        },
        mounted () {},
        methods: {
            // tag 被点击的数据，设置树形选中的节点
            setSelect (data) {
                this.expandedKeys = [data.treeSelectId]
                this.$refs.classificationTree.setCurrentKey(data.treeSelectId)
                this.$emit('treeNodeClick', data)
            },
            /* 遍历过程中进行局部渲染页面 */
            setBadge (treeList, id, num, data) {
                treeList.map((item) => {
                    if (item.id === id) {
                        this.$set(item, 'badge', num)
                        this.$set(item, 'selectData', data)
                    } else {
                        if (item.children && item.children.length > 0) {
                            this.setBadge(item.children, id, num, data)
                        }
                    }
                })
            },
            checkDisabled (node, data) {
                if (node.parent.data.status === '0') {
                    return true
                } else {
                    return false
                }
            },
            /*
            * width =160
            * */
            clearData () {
                this.treeList = []
            },
            deleteStatus (data) {
                data.map((item, index) => {
                    if (item.status === '0') {
                        data.splice(index, 1)
                    }
                    if (item.children && item.children.length > 0) {
                        this.deleteStatus(item.children)
                    }
                })
            },
            getTargetData (data, id, targetData) {
                for (let i = 0; i < data.length; i++) {
                    // 天坑,填坑
                    if (data[i].id.toString() === id.toString()) {
                        targetData.data = data[i]
                        break
                    } else if (data[i].children && data[i].children.length > 0) {
                        this.getTargetData(data[i].children, id, targetData)
                    }
                }
            },
            // 树形结构搜索
            filterNode (value, data) {
                if (!value) return true
                return data.name.indexOf(value) !== -1
            },
            // 点击树形节点触发事件
            nodeExpand () {
                this.$nextTick(() => {
                    this.$refs.classificationTree.$el.scrollLeft = this.$refs.classificationTree.$el.scrollWidth
                })
            },
            onTreeNodeClick (treeNode) {
                //  todo 滚动条滚动
                // this.$refs.classificationTree.$el.scrollLeft = this.$refs.classificationTree.$el.scrollWidth
                console.log('%c ' + '当前事件被点击了', 'color: red');
                this.searchValue = ''
                this.treeCurrentData = treeNode
                this.currentPage = 1
                this.$emit('treeNodeClick', treeNode)
            },
            // 新增树节点点击事件
            addTreeClick (node, data) {
                this.treeDialog = true
                this.$nextTick(() => {
                    this.clickId = data.id
                    this.treeDialogTitle = `新增${this.treeProps.title}`
                    this.treeDialogStatus = 'new'
                })
            },
            // 6. 编辑树节点点击事件
            editTreeClick (data) {
                this.treeDialog = true
                this.$nextTick(() => {
                    this.clickId = data.id
                    this.treeDialogTitle = `编辑${this.treeProps.title}`
                    this.treeDialogStatus = 'edit'
                    this.treeCurrentData = data
                    let targetEl = {
                        data: ''
                    }
                    this.getParent(this.treeList, data.id, targetEl)
                    this.addTreeData = {
                        name: data.name,
                        no: data.no,
                        level: data.level
                    }
                })
            },
            // 新增树节点确认点击事件
            addTreeConfirmClick (formName) {
                this.$refs[formName].validate(async (valid) => {
                    try {
                        let params = {}
                        if (valid) {
                            this.loadingList.push('save')
                            this.treeDialog = true
                            if (this.treeDialogStatus === 'new') {
                                // 新增
                                params = {
                                    ...this.addTreeData,
                                    children: [],
                                    parentId: this.treeCurrentData.id,
                                    createUser: this.$store.state.User.name,
                                    updateUser: this.$store.state.User.name,
                                    ...this.treeProps.editAPI.params
                                }
                                // todo 这里没哟作用版本更正,后去填坑
                                if (this.treeProps.version === 'v1') {
                                    await this.$service(this.treeProps.method, this.treeProps.addAPI.api, params)
                                } else {
                                    await this.$service(this.treeProps.method, this.treeProps.addAPI.api, params)
                                }
                                this.$emit('operateTree', _.cloneDeep(this.treeCurrentData))
                            } else {
                                // 编辑
                                params = {
                                    ...this.addTreeData,
                                    children: [],
                                    id: this.treeCurrentData.id,
                                    parentId: this.treeCurrentData.parentId,
                                    createUser: this.treeCurrentData.createUser,
                                    updateUser: this.$store.state.User.name,
                                    ...this.treeProps.editAPI.params
                                }
                                if (this.treeProps.version === 'v1') {
                                    await this.$service(this.treeProps.method, this.treeProps.editAPI.api, params)
                                } else {
                                    await this.$service(this.treeProps.method, this.treeProps.editAPI.api, params)
                                }
                                this.$emit('operateTree', _.cloneDeep(params))
                            }
                            this.loadingList = []
                            this.treeDialog = false
                            this.getTreeList([this.clickId], this.clickId)
                            this.$message.success(`${this.treeDialogStatus === 'new' ? '新增成功' : '编辑成功'}：${this.addTreeData.name}`)
                            this.$refs[formName].resetFields()
                        }
                    } catch (error) {
                        this.loadingList = []
                    }
                })
            },
            // 树形弹窗节点取消事件
            treeCancelClick (formName) {
                this.treeDialog = false
                this.$refs[formName].resetFields()
            },
            // 启用,停用树节点点击事件
            enableClick (data) {
                this.clickId = data.id
                let operateStatue = data.status === '0' ? '启用' : '停用' // 进行 ? 操作
                this.$confirm(`确定要${operateStatue}：${data.name} 吗?`, '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning',
                    center: true
                }).then(() => {
                    let params = {
                        categoryId: data.id,
                        ...this.treeProps.enableAPI.params
                    }
                    if (this.treeProps.version === 'v1') {
                        this.$service(this.treeProps.method, this.treeProps.enableAPI.api, params).then(() => {
                            if (data.status === '0') {
                                this.$message.success(`启用成功`)
                                this.$emit('operateTree', data, '1')
                            } else {
                                this.$message.warning(`停用成功`)
                                this.$emit('operateTree', data, '0')
                            }
                            this.getTreeList([this.clickId], this.clickId)
                        })
                    } else {
                        this.$service(this.treeProps.method, this.treeProps.enableAPI.api, params).then(() => {
                            if (data.status === '0') {
                                this.$message.success(`启用成功`)
                                this.$emit('operateTree', data, '1')
                            } else {
                                this.$message.warning(`停用成功`)
                                this.$emit('operateTree', data, '0')
                            }
                            this.getTreeList([this.clickId], this.clickId)
                            this.$emit('operateTree', data)
                        })
                    }
                })
            },
            getParent (data, id, targetEl) {
                if (data) {
                    for (let v of data) {
                        if (v.children && v.children.length > 0) {
                            v.children.map((item, index) => {
                                if (item.id === id) {
                                    targetEl.data = v
                                } else {
                                    if (index === v.children.length - 1 && v.children && v.children.length > 0) {
                                        this.getParent(v.children, id, targetEl)
                                    }
                                }
                            })
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-tree-node:hover .operate-content {
        display: block;
    }
    .class-name {
        display: inline-block;
        /*@include line-clamp(1)*/
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .operate-content {
        display: none; // 悬浮显示
    }

    .color-red {
        color: red;
    }

    .genre-tree-pack {
        position: absolute;
        width: 300px;
        // height: 100%;
        border: 1px solid #d2d3d5;
        border-radius: $borderRadius;
        background-color: #fff;
        display: flex;
        flex-direction: column;

        .tree-main-pack {
            flex: 1;
            display: flex;
            flex-direction: column;

            & > .el-tree--highlight-current {
                flex: 1;
            }
        }

        .el-tree {
            width: auto;
            height: auto;
        }
    }
</style>
