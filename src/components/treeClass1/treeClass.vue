<!-- 树形结构 -->
<template>
    <div
        id="test"
        class="genre-tree-pack float-left clear-float"
    >
        <div class="title-pack clear-float">
            <div class="float-left">
                <span class="color-label" />
                <span class="page-title-text">{{ treeProps.title }}</span>
            </div>
        </div>
        <div class="tree-main-pack">
            <el-input
                v-model="filterText"
                clearable
                style="padding: 0 0 10px 0; border-radius: 5px;"
                placeholder="请输入搜索关键字"
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
                <!--   @contextmenu.prevent="treePropsClick"
                        @click="click" -->
                <span
                    slot-scope="{ node, data }"
                    class="custom-tree-node"
                    @mouseover="treeNodeMoveIn(data)"
                    @mouseout="treeNodeMoveOut(data)"
                >
                    <img src="../../assets/monitoring/fold.png">
                    <span
                        class="class-name"
                        :title="data.name"
                    >{{ data.name }}</span>
                    <el-badge
                        v-if="data.badge"
                        class="mark"
                        :value="data.badge"
                    />
                    <span
                        style="width: 25px; text-align: left;"
                        class="ml-10"
                    >
                        <span
                            v-if="!treeProps.hiddenOperate"
                            :ref="[`tree-item-${data.id}`]"
                            class="operate-content"
                        >
                            <i
                                class="el-icon-more"
                                @click="showMenu($event,node, data)"
                            />
                            <!-- <el-button
                                v-if="!(data.id === treeList[0].id && treeProps.forbid)"
                                v-has="{role: 'addClassification'}"
                                :disabled="checkDisabled(node, data) || data.status === '0'"
                                type="text"
                                size="mini"
                                @click="() => addTreeClick(node,data)"
                            >新增</el-button>
                            <el-button
                                v-if="data.level.toString() !== '0'"
                                v-has="{role: 'editClassification'}"
                                type="text"
                                size="mini"
                                @click="() => editTreeClick(data)"
                            >编辑</el-button>
                            <el-button
                                v-if="data.level.toString() !== '0'"
                                v-has="{role: 'disableClassification'}"
                                :disabled="checkDisabled(node, data)"
                                class="delete-button"
                                :class="[data.status === '0' ? '': 'color-red']"
                                type="text"
                                size="mini"
                                @click.stop="() => enableClick(data)"
                            >{{ data.status === '0'? '启用': '停用' }}</el-button> -->
                        </span>
                    </span>
                </span>
            </el-tree>
            <ul
                v-show="rightMenu.show"
                id="contextmenu"
                class="contextmenu"
                :style="{left: rightMenu.left +'px',top: rightMenu.top +'px'}"
                @mouseover="menuMoveIn(rightMenu.list[0].data)"
                @mouseout="menuMoveOut(rightMenu.list[0].data)"
            >
                <li
                    v-for="(item, index) in rightMenu.list.filter(item => item.show)"
                    :key="index"
                    @click="handleRightEvent(item.type, item.data)"
                > <i :class="item.icon" /></li>
            </ul>
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
                                size="mini"
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
                                size="mini"
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
                                size="mini"
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
                    size="mini"
                    icon="el-icon-circle-check"
                    @click="treeCancelClick('addTreeDom')"
                >取消</el-button>
                <el-button
                    :loading="loadingList.indexOf('save') > -1"
                    size="mini"
                    type="primary"
                    icon="el-icon-circle-check"
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
    name: 'TreeClass',
    props: {
        treeProps: {
            type: Object,
            default: () => {
                return {
                    newTreeList: [],
                    forbid: false,
                    version: 'v1', // 当前版本组件版本号
                    title: '分类', // 树形结构标题
                    hiddenOperate: false, // 隐藏操作按钮
                    deleteStatus: false, // 刪除禁用状态
                    api: '', // 接口api
                    params: {}, //参数,//  type: 1.标识为物料分类，2表示为产品分类，3为工艺分类，4为设备分类，5故障分类
                    listAPI: {
                        // 新整接口
                        api: '',
                        params: {}
                    },
                    addAPI: {
                        // 新整接口
                        api: '',
                        params: {}
                    },
                    editAPI: {
                        // 编辑借口
                        api: '',
                        params: {}
                    },
                    enableAPI: {
                        // 启用和禁用接口
                        api: '',
                        params: {}
                    }
                };
            }
        },
        newList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            expandedKeys: [],
            loadingList: [],
            rightMenu: {
                show: false,
                left: 0,
                top: 0,
                list: []
            },
            /* 左侧树形数据 start */
            treeDialogTitle: '', // 树形弹窗标题
            treeCurrentData: {}, // 存储点击树形图节点的数据
            treeLoading: false, // tree loading状态
            treeDialog: false, // 新建和编辑弹框显示隐藏的标志
            treeDialogStatus: '', // 当前树形图当前处于状态  编辑:edit ,新增:new
            editTreeDialog: false, // 编辑弹框标志
            addTreeData: {
                no: '',
                name: '',
                level: ''
            },
            filterText: '', // 树形结构过滤关键字
            treeList: [], // 树形里列表的数据
            treeRules: {
                no: [
                    { required: true, message: '请输入编码', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            },
            typeName: '', //当前选中的树节点的名称
            treeNode: '', // 当前选中的树的数据
            currentNodeData: '',
            flag: false,
            // 停用列表数据
            currentNodeKey: 3, // 当前选中节点
            clickId: ''
        };
    },
    watch: {
        // tree 进行过滤
        filterText(val) {
            this.$refs.classificationTree.filter(val);
        },
        newList: {
            handler(val) {
                this.treeList = _.cloneDeep(val);
            },
            deep: true,
            immediate: true
        },
        //监听弹窗显示关闭弹窗事件
        'rightMenu.show'(val) {
            if (val) {
                document.body.addEventListener('click', this.handlecCloseMenu);
            } else {
                document.body.removeEventListener(
                    'click',
                    this.handlecCloseMenu
                );
            }
        }
    },
    mounted() {
        if (this.$route.query.clickTreeId) {
            this.getTreeList(
                [this.$route.query.clickTreeId],
                this.$route.query.clickTreeId,
                true
            );
        } else {
            this.getTreeList([0], 0, true);
        }
    },
    methods: {
        //菜单移入事件
        menuMoveIn(data) {
            this.currentNodeData = _.cloneDeep(data);
            let mask = this.$refs[`tree-item-${data.id}`];
            mask.style.display = 'block';
        },
        //菜单移出事件
        menuMoveOut(data) {
            let mask = this.$refs[`tree-item-${data.id}`];
            // if (!this.rightMenu.show) {
            //     mask.style.display = 'none';
            // }
            if (
                this.currentNodeData.id === data.id &&
                this.rightMenu.show === true
            ) {
                mask.style.display = 'block';
            } else {
                mask.style.display = 'none';
            }
        },
        //树节点移入事件
        treeNodeMoveIn(data) {
            let mask = this.$refs[`tree-item-${data.id}`];
            mask.style.display = 'block';
        },
        //树节点移出事件
        treeNodeMoveOut(data) {
            let mask = this.$refs[`tree-item-${data.id}`];
            if (
                this.currentNodeData.id === data.id &&
                this.rightMenu.show === true
            ) {
                mask.style.display = 'block';
            } else {
                mask.style.display = 'none';
            }
        },
        // 关闭菜单
        handlecCloseMenu() {
            this.rightMenu.show = false;
            let mask = this.$refs[`tree-item-${this.currentNodeData.id}`];
            mask.style.display = 'none';
        },
        //显示图标按钮
        showMenu(event, node, data) {
            // this.currentNodeData = _.cloneDeep(data);
            let mask = this.$refs[`tree-item-${data.id}`];
            if (
                this.currentNodeData.id === data.id &&
                this.rightMenu.show === true
            ) {
                mask.style.display = 'block';
            } else {
                mask.style.display = 'none';
            }
            this.rightMenu.show = true;
            this.rightMenu.top = event.clientY + 10;
            let arr = [];
            if (data.level === 0) {
                this.rightMenu.left = event.clientX - 40;
                arr = [
                    {
                        name: '刷新',
                        type: 'refresh',
                        data: data,
                        icon: 'el-icon-refresh',
                        show: true
                    },
                    {
                        name: '新增',
                        type: 'add',
                        data: data,
                        icon: 'el-icon-circle-plus-outline',
                        show: true
                    }
                ];
            } else {
                this.rightMenu.left = event.clientX - 80;
                arr = [
                    {
                        name: '刷新',
                        type: 'refresh',
                        data: data,
                        icon: 'el-icon-refresh',
                        show: true
                    },
                    {
                        name: '新增',
                        type: 'add',
                        data: data,
                        icon: 'el-icon-circle-plus-outline',
                        show: true
                    },
                    {
                        name: '编辑',
                        type: 'update',
                        data: data,
                        icon: 'el-icon-edit',
                        show: true
                    },
                    {
                        name: '删除',
                        type: 'delete',
                        data: data,
                        icon: 'el-icon-delete',
                        show: true
                    }
                ];
            }
            this.rightMenu.list = arr;
        },
        //菜单选中事件
        handleRightEvent(type, data) {
            switch (type) {
                case 'refresh':
                    this.$emit(
                        'operateTree',
                        _.cloneDeep(this.treeCurrentData)
                    );
                    break;
                case 'add':
                    this.treeDialog = true;
                    this.$nextTick(() => {
                        this.clickId = data.id;
                        this.treeDialogTitle = `新增${this.treeProps.title}`;
                        this.treeDialogStatus = 'new';
                    });
                    break;
                case 'update':
                    this.treeDialog = true;
                    this.$nextTick(() => {
                        this.clickId = data.id;
                        this.treeDialogTitle = `编辑${this.treeProps.title}`;
                        this.treeDialogStatus = 'edit';
                        this.treeCurrentData = data;
                        let targetEl = {
                            data: ''
                        };
                        this.getParent(this.treeList, data.id, targetEl);
                        this.addTreeData = {
                            name: data.name,
                            no: data.no,
                            level: data.level
                        };
                    });
                    break;
                case 'delete':
                    this.$handleAPI(type, deleteApi, nodeData.id).then(res => {
                        if (res.success) {
                            // 删除后，树组件默认指针指向删除元素的父级
                            treeInfo.defaultClickedAsyc = nodeData.pid;
                            treeInfo.defaultHighLightAsyc = nodeData.pid;
                            treeInfo.defaultExpandedAsyc = [nodeData.pid];
                            // 刷新树
                            treeInfo.refresh = Math.random();
                        }
                    });
                    break;
            }
        },
        checkDisabled(node, data) {
            if (node.parent.data.status === '0') {
                return true;
            } else {
                return false;
            }
        },
        /*
         * width =160
         * */
        clearData() {
            this.treeList = [];
        },
        /*
         * 1. 设置默认选择
         * 2. 判断路由是否有选中参数clickTreeId
         * */
        async getTreeList(expandedKeys = [0], setCurrentKey = 0, init) {
            this.treeLoading = true;
            let params = {
                ...this.treeProps.listAPI.params
            };
            let res = await this.$service(
                this.treeProps.listAPI.method,
                this.treeProps.listAPI.api,
                params
            );
            this.treeLoading = false;
            // this.treeList[0].children = _.cloneDeep(res)
            if (this.treeProps.deleteStatus) {
                this.deleteStatus(res);
            }
            this.treeList = _.cloneDeep(res);
            this.$nextTick(() => {
                if (
                    JSON.stringify(expandedKeys) === '[0]' &&
                    setCurrentKey.toString() === '0'
                ) {
                    expandedKeys = [res[0].id];
                    setCurrentKey = res[0].id;
                }
                this.expandedKeys = expandedKeys;
                this.$refs.classificationTree.setCurrentKey(setCurrentKey);
                if (this.$route.query.clickTreeId) {
                    // let targetData = {data: ''}
                    let targetData = {};
                    // 去通知父组件,tree你当前期点击的是那一块数据
                    this.getTargetData(
                        this.treeList,
                        this.$route.query.clickTreeId,
                        targetData
                    );
                    this.$emit('treeNodeClick', targetData.data);
                } else if (init) {
                    this.$emit('treeNodeClick', this.treeList[0]);
                }
            });
        },
        deleteStatus(data) {
            data.map((item, index) => {
                if (item.status === '0') {
                    data.splice(index, 1);
                }
                if (item.children && item.children.length > 0) {
                    this.deleteStatus(item.children);
                }
            });
        },
        getTargetData(data, id, targetData) {
            for (let i = 0; i < data.length; i++) {
                // 天坑,填坑
                if (data[i].id.toString() === id.toString()) {
                    targetData.data = data[i];
                    break;
                } else if (data[i].children && data[i].children.length > 0) {
                    this.getTargetData(data[i].children, id, targetData);
                }
            }
        },
        // 树形结构搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 点击树形节点触发事件
        nodeExpand() {
            this.rightMenu.show = false;
            this.$nextTick(() => {
                // this.$refs.classificationTree.$el.scrollLeft = this.$refs.classificationTree.$el.scrollWidth;
            });
        },
        onTreeNodeClick(treeNode) {
            // this.handlecCloseMenu();
            //  todo 滚动条滚动
            // this.$refs.classificationTree.$el.scrollLeft = this.$refs.classificationTree.$el.scrollWidth
            this.searchValue = '';
            this.treeCurrentData = treeNode;
            this.currentPage = 1;
            this.$emit('treeNodeClick', treeNode);
        },
        // 新增树节点点击事件
        addTreeClick(node, data) {
            this.treeDialog = true;
            this.$nextTick(() => {
                this.clickId = data.id;
                this.treeDialogTitle = `新增${this.treeProps.title}`;
                this.treeDialogStatus = 'new';
            });
        },
        // 6. 编辑树节点点击事件
        editTreeClick(data) {
            this.treeDialog = true;
            this.$nextTick(() => {
                this.clickId = data.id;
                this.treeDialogTitle = `编辑${this.treeProps.title}`;
                this.treeDialogStatus = 'edit';
                this.treeCurrentData = data;
                let targetEl = {
                    data: ''
                };
                this.getParent(this.treeList, data.id, targetEl);
                this.addTreeData = {
                    name: data.name,
                    no: data.no,
                    level: data.level
                };
            });
        },
        // 新增树节点确认点击事件
        addTreeConfirmClick(formName) {
            this.$refs[formName].validate(async valid => {
                try {
                    let params = {};
                    if (valid) {
                        this.loadingList.push('save');
                        this.treeDialog = true;
                        if (this.treeDialogStatus === 'new') {
                            // 新增
                            params = {
                                ...this.addTreeData,
                                children: [],
                                parentId: this.treeCurrentData.id,
                                createUser: window.sessionStorage.getItem(
                                    'Admin-Username'
                                ),
                                updateUser: window.sessionStorage.getItem(
                                    'Admin-Username'
                                ),
                                ...this.treeProps.editAPI.params
                            };
                            // todo 这里没哟作用版本更正,后去填坑
                            if (this.treeProps.version === 'v1') {
                                await this.$service(
                                    this.treeProps.addAPI.method,
                                    this.treeProps.addAPI.api,
                                    params
                                );
                            } else {
                                await this.$service(
                                    this.treeProps.addAPI.method,
                                    this.treeProps.addAPI.api,
                                    params
                                );
                            }
                            this.$emit(
                                'operateTree',
                                _.cloneDeep(this.treeCurrentData)
                            );
                        } else {
                            // 编辑
                            params = {
                                ...this.addTreeData,
                                children: [],
                                id: this.treeCurrentData.id,
                                parentId: this.treeCurrentData.parentId,
                                createUser: this.treeCurrentData.createUser,
                                updateUser: this.$store.state.user.name,
                                ...this.treeProps.editAPI.params
                            };
                            if (this.treeProps.version === 'v1') {
                                await this.$service(
                                    this.treeProps.editAPI.method,
                                    this.treeProps.editAPI.api,
                                    params
                                );
                            } else {
                                await this.$service(
                                    this.treeProps.editAPI.method,
                                    this.treeProps.editAPI.api,
                                    params
                                );
                            }
                            this.$emit('operateTree', _.cloneDeep(params));
                        }
                        this.loadingList = [];
                        this.treeDialog = false;
                        this.getTreeList([this.clickId], this.clickId);
                        this.$message.success(
                            `${
                                this.treeDialogStatus === 'new'
                                    ? '新增成功'
                                    : '编辑成功'
                            }：${this.addTreeData.name}`
                        );
                        this.$refs[formName].resetFields();
                    }
                } catch (error) {
                    this.loadingList = [];
                }
            });
        },
        // 树形弹窗节点取消事件
        treeCancelClick(formName) {
            this.treeDialog = false;
            this.$refs[formName].resetFields();
        },
        // 启用,停用树节点点击事件
        enableClick(data) {
            this.clickId = data.id;
            let operateStatue = data.status === '0' ? '启用' : '停用'; // 进行 ? 操作
            this.$confirm(`确定要${operateStatue}：${data.name} 吗?`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true
            }).then(() => {
                let params = {
                    categoryId: data.id,
                    ...this.treeProps.enableAPI.params
                };
                if (this.treeProps.version === 'v1') {
                    this.$service(
                        this.treeProps.enableAPI.method,
                        this.treeProps.enableAPI.api,
                        params
                    ).then(() => {
                        if (data.status === '0') {
                            this.$message.success(`启用成功`);
                            this.$emit('operateTree', data, '1');
                        } else {
                            this.$message.warning(`停用成功`);
                            this.$emit('operateTree', data, '0');
                        }
                        this.getTreeList([this.clickId], this.clickId);
                    });
                } else {
                    this.$service(
                        this.treeProps.enableAPI.method,
                        this.treeProps.enableAPI.api,
                        params
                    ).then(() => {
                        if (data.status === '0') {
                            this.$message.success(`启用成功`);
                            this.$emit('operateTree', data, '1');
                        } else {
                            this.$message.warning(`停用成功`);
                            this.$emit('operateTree', data, '0');
                        }
                        this.getTreeList([this.clickId], this.clickId);
                        this.$emit('operateTree', data);
                    });
                }
            });
        },
        getParent(data, id, targetEl) {
            if (data) {
                for (let v of data) {
                    if (v.children && v.children.length > 0) {
                        v.children.map((item, index) => {
                            if (item.id === id) {
                                targetEl.data = v;
                            } else {
                                if (
                                    index === v.children.length - 1 &&
                                    v.children &&
                                    v.children.length > 0
                                ) {
                                    this.getParent(v.children, id, targetEl);
                                }
                            }
                        });
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss">
/deep/ .contextmenu:hover .operate-content {
    display: inline-block !important;

    img {
        vertical-align: middle;
    }
}
</style>
<style lang="scss" scoped>
.contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    list-style-type: none;
    padding: 5px 2px;
    border-radius: 4px;
    position: fixed;
    font-size: 12px;
    font-weight: 400;
    display: flex;
    color: #333;
    // display: inline-block;
    box-shadow: -2px 3px 6px 0 rgba(0, 0, 0, 0.1);
    li {
        margin: 0;
        padding: 2px 4px;
        text-align: center;
        cursor: pointer;
        flex: 1;
        &:hover {
            background: #eee;
        }
    }
}

.custom-tree-node:hover .operate-content {
    display: inline-block;

    img {
        vertical-align: middle;
    }
}

.class-name {
    width: 140px;
    margin: 4px 0 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.operate-content {
    display: none; // 悬浮显示
    // display: inline-block;

    /deep/.el-button--mini {
        padding: 4px 0px !important;
    }
    /deep/.el-button + .el-button {
        margin-left: 0px !important;
    }
}

.color-red {
    color: red;
}

.genre-tree-pack {
    position: absolute;
    width: 260px;
    top: 0;
    bottom: 10px;
    border-radius: $borderRadius;
    display: flex;
    flex-direction: column;

    .title-pack {
        height: 40px;
        line-height: 40px;
        position: relative;
        text-indent: 10px;
    }

    .tree-main-pack {
        position: relative;
        flex-direction: column;
    }
    .el-tree {
        height: calc(100vh - 165px);
    }
}
</style>
