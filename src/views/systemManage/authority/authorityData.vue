<!-- 菜单列表弹窗 -->
<template>
    <div class="authorityData">
        <div v-if="showDialog">
            <div class="text-center text-title">组织机构</div>
            <div class="tree-box">
                <el-tree
                    ref="treeRef"
                    highlight-current
                    :check-strictly="true"
                    :expand-on-click-node="false"
                    :data="treeData"
                    :default-expanded-keys="defaultExpanded"
                    :default-checked-keys="defaultChecked"
                    :props="defaultProps"
                    show-checkbox
                    node-key="id"
                    @check="setChildrenCheck"
                    @node-click="organizeClick"
                >
                    <span
                        slot-scope="{ node, data }"
                        class="custom-tree-node"
                    >
                        <span class="pl-10 pr-10">{{ data.name }}</span>
                        <template v-if="data.workshopChildren && data.workshopChildren.length > 0">
                            <span
                                v-if="showSelect(data)"
                                style="color:red"
                                class="iconfont iconyuechi"
                            />
                            <span
                                v-else
                                class="iconfont iconyuechi"
                            />
                        </template>
                    </span>
                </el-tree>
            </div>
        </div>
        <div>
            <div class="text-center  text-title">工作中心</div>
            <div class="tree-box">
                <el-tree
                    ref="workShopRef"
                    highlight-current
                    :data="workShopTreeData"
                    :default-expanded-keys="workShopDefaultExpanded"
                    :default-checked-keys="workShopDefaultChecked"
                    :check-strictly="true"
                    :default-expand-all="false"
                    :expand-on-click-node="false"
                    show-checkbox
                    node-key="id"
                    :props="defaultWorkShopProps"
                    @check="setChildrenCheckWorkShop"
                >
                    <span
                        slot-scope="{ node, data }"
                        class="custom-tree-node"
                    >
                        <span class="pl-10">{{ data.name }}</span>
                    </span>
                </el-tree>
            </div>
        </div>
    </div>
</template>
<script>
    /*
    * todo vue 注意事项 : 页面对数据渲染过程，处理数据，添加字段或修改数据
    *  导致，页面渲染后，在进行修改数据自动的渲染，部分方法可能不会触发
    *
    * */
    export default {
        name: 'AuthorityData',
        props: {
            routerList: {
                type: Array,
                default: () => {
                }
            },
            checkSelect: {
                type: Array,
                default: () => {
                }
            }
        },
        inject: {
            rootInfo: {
                default: () => ({})
            },
            setDialogShow: {
                default: () => ({})
            },
            getAuthority: {
                default: () => ({})
            }
        },
        data () {
            return {
                // 左侧获取总数据
                treeData: [],
                // 右侧工作中心的数据
                workShopTreeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                defaultWorkShopProps: {
                    children: 'workshopChildren',
                    label: 'name'
                },
                // 左侧树形结构，展开数据
                defaultChecked: [],
                defaultExpanded: [],
                // 右侧树形结构，展开的数据
                workShopDefaultChecked: [],
                workShopDefaultExpanded: [],
                leftCurrentClickData: [],
                showDialog: false
            }
        },
        watch: {
            '$parent.$parent.dialogInfo.isShowDialog': {
                handler (val) {
                    this.showDialog = val
                },
                deep: true,
                immediate: true
            },
            'checkSelect': {
                handler (val) {
                    this.getLeftCheck(val)
                },
                deep: true
            }
        },
        mounted () {
            //获取数据权限列表
            this.getPermissionTreeList()

        },
        methods: {
            // 将获取id,进行设置的左侧选中
            async getLeftCheck (data) {
                await this.$sleep(1000)
                this.$refs.treeRef.setCheckedKeys(data || [])
                await this.$sleep(1000)
                let leftCheckData = this.$refs.treeRef.getCheckedKeys()
                let allSelect = data
                this.setRightSelectData(this.treeData, leftCheckData, allSelect)
                // todo 让页面根据整合后的数据重新渲染
                this.treeData = _.cloneDeep(this.treeData)
            },
            // 根据返回的总数据和 workshopChildren 设置右侧选中
            setRightSelectData (treeData, leftCheckData, allSelect) {
                treeData.map((item) => {
                    if (item.workshopChildren && item.workshopChildren.length > 0) {
                        // 所有返回的id
                        this.setAllRightSelectData(item.workshopChildren, allSelect, item)
                        // data.map((childrenItem) => {
                        //     // item.workshopChildren.map((value) => {
                        //     //     if (value.id === childrenItem) {
                        //     //         item.rightSelectData.push(childrenItem)
                        //     //     }
                        //     // })
                        // })
                    }
                    if (item.children && item.children.length > 0) {
                        this.setRightSelectData(item.children, leftCheckData, allSelect)
                    }
                })
            },
            setAllRightSelectData (data, allSelect, currentLeft) {
                data.map((item) => {
                    if (allSelect.includes(item.id)) {
                        if (currentLeft.rightSelectData) {
                            currentLeft.rightSelectData.push(item.id)
                        } else {
                            currentLeft.rightSelectData = []
                            currentLeft.rightSelectData.push(item.id)
                        }
                    }
                    if (item.workshopChildren && item.workshopChildren.length > 0) {
                        this.setAllRightSelectData(item.workshopChildren, allSelect, currentLeft)
                    }
                })
            },
            // 是否显示图标
            showSelect (data) {
                if (data.rightSelectData && data.rightSelectData.length > 0) {
                    let flag = data.rightSelectData.filter((item) => item !== data.id)
                    return flag.length > 0
                } else {
                    return false
                }
            },
            // 清空所有选中内容
            clearCheck () {
                this.$refs.treeRef.setCheckedKeys([])
                this.$refs.workShopRef.setCheckedKeys([])
                this.workShopTreeData = []
                // 清空存储数据
                this.clearCheckData(this.treeData)
            },
            // 清空存储的数据
            clearCheckData (data) {
                data.map((item) => {
                    item.rightSelectData = []
                    if (item.children && item.children.length > 0) {
                        this.clearCheckData(item.children)
                    }
                })
            },
            // 左侧组织机构点击触发
            async organizeClick (data, node, self) {
                console.log(data)
                this.leftCurrentClickData = data
                if (data.workshopChildren && data.workshopChildren.length > 0) {
                    // 将当前节点的元素下，工作中心的数据的赋值右侧
                    this.workShopTreeData = data.workshopChildren
                    // 设置默认展开根目录
                    this.workShopDefaultExpanded = [data.id]
                    // todo 这个地方设计有缺陷,需要重新设计
                    // 点击左侧树形结构，设置右侧树形选中。
                    // 获取当前元素下所有选中ID
                    let currentData = []
                    this.getChildrenCurrentSelectData([data], currentData)
                    this.$nextTick(() => {
                        this.$refs.workShopRef.setCheckedKeys(currentData || [])
                    })
                } else {
                    this.workShopTreeData = []
                    this.workShopDefaultExpanded = []
                }
                // 如果当前节点选中，对应右侧的工作中心相同节点也选中
                if (node.checked) {
                    this.$nextTick(() => {
                        this.$refs.workShopRef.setChecked(data.id, true, true)
                    })
                }
            },
            getChildrenCurrentSelectData (data, currentData) {
                data.map((item) => {
                    if (item.rightSelectData && item.rightSelectData.length > 0) {
                        item.rightSelectData.map((childrenItem) => {
                            currentData.push(childrenItem)
                        })
                    }
                    if (item.workshopChildren && item.workshopChildren.length > 0) {
                        this.getChildrenCurrentSelectData(item.workshopChildren, currentData)
                    }
                })
            },
            // 针对组织机构设置 设置当前节点下的子节点选中
            setChildrenCheck (data, node) {
                // setCheckedKeys
                let flag = node.checkedKeys.includes(data.id)
                // 当前元素是取消还是选中
                if (flag) {
                    // 设置选中的数组,将当前下面子元素也进行选中
                    let arrIds = [...node.checkedKeys]
                    this.getAllChildrenId(data.children || [], arrIds, 'children')
                    this.$refs.treeRef.setCheckedKeys(arrIds || [])
                    //左右两侧都相同的内容  点击组织机构的时候,将右侧工作中心对应的也进行选中。
                    let workshopChildrenKeys = this.$refs.workShopRef.getCheckedKeys()
                    this.$refs.workShopRef.setCheckedKeys([data.id, ...workshopChildrenKeys])
                    // 左侧 对于选中父级导致，下级被勾选情况，导致右侧不能默认选中。采用遍历
                    let checkedKeys = this.$refs.treeRef.getCheckedKeys()
                    if (this.workShopTreeData && this.workShopTreeData.length > 0) {
                        let rightKey = checkedKeys.filter((item) => item === this.workShopTreeData[0].id)
                        this.$refs.workShopRef.setChecked(rightKey[0], true, true)
                    }
                } else {
                    // 判断父元素和子元素是否都被选中
                    let flagParent = node.checkedKeys.includes(data.parentId)
                    // let flagChildren = this.isCheckChildren(data.children || [], node.checkedKeys)   // 判断当前元素是否有子元素选中
                    if (flagParent) {
                        this.$refs.treeRef.setCheckedKeys([...node.checkedKeys, data.id])
                        this.$message.warning('请先取消父节点')
                    } else {
                        // 对于左右两侧都相同节点 点击取消的时候将右侧对应的进行取消
                        let workshopChildrenKeys = this.$refs.workShopRef.getCheckedKeys()
                        let keys = workshopChildrenKeys.filter((item) => item !== data.id)
                        this.$refs.workShopRef.setCheckedKeys(keys)
                    }
                }
            },
            // 针对工作中心的设置，设置当前节点下的子节点选中,同理 setChildrenCheck方法
            setChildrenCheckWorkShop (data, node) {
                // console.log(data,node)
                // setCheckedKeys
                // node.checkedKeys,当前选中的节点所有节点的--id
                // 判断当前节点是已选中还是未选中。
                let flag = node.checkedKeys.includes(data.id)
                if (flag) {
                    // 当前的操作的是进行的勾选数据
                    // 设置选中的数组
                    let arrIds = [...node.checkedKeys]
                    this.getAllChildrenId(data.workshopChildren || [], arrIds, 'workshopChildren')
                    // 这里进行设置勾选的时候，是进行的重置设置，所以还要 + 之前已经勾选过的数据
                    this.$refs.workShopRef.setCheckedKeys(arrIds)
                    //左右两侧都相同的内容，选中右侧工作中心，左侧选中的内容进行选中
                    let childrenKeys = this.$refs.treeRef.getCheckedKeys()
                    this.$refs.treeRef.setCheckedKeys([data.id, ...childrenKeys])
                } else {
                    // 当前的操作的是取消勾选。
                    // 右侧是否夸节点
                    let flagParent = node.checkedKeys.includes(data.parentId)
                    // let flagChildren = this.isCheckChildren(data.workshopChildren || [], node.checkedKeys)   // 判断当前元素是否有子元素选中
                    if (flagParent) {
                        this.$refs.workShopRef.setCheckedKeys([...node.checkedKeys, data.id])
                        this.$message.warning('请先取消父节点')
                    } else {
                        //左右两侧都相同的内容，取消右侧工作中心，左侧选中的内容进行取消，判断是否被允许
                        let childrenKeys = this.$refs.treeRef.getCheckedKeys()
                        // 判断左侧当前节点上下级是否被选中
                        let leftFlagParent = this.$refs.treeRef.getCheckedKeys().includes(data.parentId)
                        let leftFlagChildren = this.isCheckChildren(data.children || [], this.$refs.treeRef.getCheckedKeys())   // 判断当前元素是否有子元素选中
                        if (leftFlagParent && leftFlagChildren) {
                            this.$refs.workShopRef.setCheckedKeys([...node.checkedKeys, data.id])
                            this.$message.warning('不能跨节点取消, 请将组织机构中上级或下级取消！')
                        } else {
                            let keys = childrenKeys.filter((item) => item !== data.id)
                            this.$refs.treeRef.setCheckedKeys(keys)
                        }
                    }
                }
                // 将右 工作中心选中的值存储到左侧组织机构中数据中
                let allChecked = this.$refs.workShopRef.getCheckedKeys()
                // this.leftCurrentClickData.rightSelectData = allChecked
                // 赋值没有自动
                this.saveRightSelectData(this.treeData, allChecked)
            },
            saveRightSelectData (data, allChecked) {
                data.map((item) => {
                    if (item.id === this.leftCurrentClickData.id) {
                        this.$set(item, 'rightSelectData', allChecked)
                    }
                    if (item.children && item.children.length > 0) {
                        this.saveRightSelectData(item.children, allChecked)
                    }
                })
            },
            /**
             * 判断资源数是否被选中
             * */
            isCheckChildren (data, checkedKeys) {
                let flag = false
                data.map((item) => {
                    if (checkedKeys.includes(item.id)) {
                        flag = true
                    }
                })
                return flag
            },
            /**
             * @param data 当前元素data.children
             * @param currentId data.id 遍历的数组得
             * @param children data.children 代表孩子的字段
             * @param parentData data.children 想要得到的parent的数据
             * */
            getParent (data, currentId, children, parentData) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === currentId) {
                        return parentData
                    } else {
                        parentData = data[i]
                    }
                    if (data[i][children] && data[i][children].length > 0) {
                        return this.getParent(data[i][children], currentId, children, parentData)
                    }
                }
            },
            // 获取所有子元素的id，在一个数组里面
            getAllChildrenId (data, arrIds, children) {
                data.map((item) => {
                    arrIds.push(item.id)
                    if (item[children] && item[children].length > 0) {
                        this.getAllChildrenId(item[children], arrIds, children)
                    }
                })
            },
            //  获取所有数据权限列表
            getPermissionTreeList () {
                console.log('\x1B[32m%s\x1B[0m', '00000000000')
                this.$service('get', '/SERVICE-SYSTEM/api/v1/resource/data/dept/list').then((res) => {
                    this.handleTreeDataField(res)
                    this.treeData = res
                    this.handleDisabled()
                    // 设置左侧默认展开
                    this.defaultExpanded = [res[0].id] || []
                    // 查看状态时候
                })
            },
            handleDisabled() {
                if (this.$parent.$parent.dialogInfo.dialogStatus === 'view') {
                    //  进行禁用
                    this.setDisabled(this.treeData, 'children', true)
                    this.setDisabledMulti(this.treeData, true)
                    console.log(this.treeData)
                } else {
                    this.setDisabled(this.treeData, 'children', false)
                    this.setDisabledMulti(this.treeData, false)
                }
            },
            // 设置里列表禁用
            setDisabled (data, children, flag) {
                data.map((item) => {
                    item.disabled = flag
                    if (item[children] && item[children].length > 0) {
                        this.setDisabled(item[children], children, flag)
                    }
                })
            },
            // 设置里列表禁用表
            setDisabledMulti (data, flag) {
                data.map((item) => {
                    item.disabled = flag
                    if (item.workshopChildren && item.workshopChildren.length > 0) {
                        this.setDisabled(item.workshopChildren, 'workshopChildren', flag)
                    }
                    if (item.children && item.children.length > 0) {
                        this.setDisabledMulti(item.children, flag)
                    }
                })
            },
            // 数据分割 ，根据type拆分组织机构和工作中心
            handleTreeDataField (res) {
                res.map((item) => {
                    if (item.children && item.children.length > 0) {
                        for (let i = 0, len = item.children.length; i < len; i++) {
                            if (item.children[i].type !== 'DEPT') {
                                // 新增一个工作中数组
                                item.rightSelectData = []
                                if (!item.workshopChildren) {
                                    item.workshopChildren = []
                                }
                                // item.workshopChildren.push(_.cloneDeep(item.children[i]))
                                item.workshopChildren.push(item.children[i])
                                // 符合后进行过滤掉
                                item.children.splice(i, 1)
                                i--;
                                len--;
                            }
                        }
                    }
                    // // 继续判断children是否存在,更改名字
                    this.changeFiled(item.workshopChildren || [])
                    this.handleTreeDataField(item.children || [])
                })
            },
            // 修改工作中心下面所有字段 children workshopChildren
            changeFiled (data) {
                data.map((item) => {
                    item.workshopChildren = item.children
                    if (item.children && item.children.length > 0) {
                        this.changeFiled(item.children)
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    /*.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content*/
    .authorityData {
        display: flex;

        > div {
            flex: 1;
        }
    }

    .text-title {
        font-size: 16px;
        font-weight: 600;
    }

    .tree-box {
        width: 300px;
        min-height: 200px;
        margin: 0 auto;
        overflow: hidden;

        /deep/ .el-tree {
            overflow: hidden;
            min-height: 200px;
        }
    }
</style>
