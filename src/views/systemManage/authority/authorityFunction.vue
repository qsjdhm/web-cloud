<!-- 菜单列表弹窗 -->
<template>
    <div
        class="features-component"
    >
        <el-tree
            ref="treeRef"
            :data="treeData"
            show-checkbox
            node-key="path"
            default-expand-all
            :props="defaultProps"
            :expand-on-click-node="false"
            @check-change="handleCheckChange"
        >
            <div
                slot-scope="{ node ,data}"
                class="custom-tree-node"
            >
                <span style="font-size: 16px;color: #606266">{{ node.label }}</span>
                <div
                    v-if="data.permissionBtn && data.permissionBtn.length > 0"
                    style="margin-left: 60px;color: #909399;white-space: normal;"
                    class="btn-box"
                >
                    <template v-for="(item,key) of data.permissionBtn">
                        <el-checkbox
                            :key="key"
                            v-model="item.checked"
                            :disabled="rootInfo.dialogInfo.dialogStatus === 'view'"
                            :label="item.title"
                            @change="btnAuthorityChange($event,node,data)"
                        />
                    </template>
                </div>
            </div>
        </el-tree>
    </div>
</template>

<script>
import { asyncRoutes } from '@/router'
import { clearChildren, filterData } from '@/utils/permission'
import { i18nToZh, generateRoutes } from '@/utils/generateRouter'
import i18n from '@/lang'

export default {
    name: 'AuthorityFunction',
    props: {
        serviceChecked: {
            type: Array,
            default: () => {}
        },
        getData:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            treeData: [],
            // 针对左侧进行判断是否需要联动
            isBtnRelated: true,  // 是否进行项关联
            initCheck:false   // 初始化开关，初始化的时候左侧是不能选中的
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
    mounted() {
        console.log('\x1B[32m%s\x1B[0m', 'router翻译')
        console.log(i18n.t(`button.view/view`))
        let filterRouter = _.cloneDeep(asyncRoutes)
        const adminAuthority = JSON.parse(window.sessionStorage.getItem('Admin-Authority') || '[]')
        filterData(filterRouter, adminAuthority, 0, [])
        clearChildren(filterRouter)
        this.delComponent(filterRouter)
        const routes = generateRoutes(_.cloneDeep(filterRouter))
        let newRoutes = i18nToZh(routes)
        this.handlerBtnData(newRoutes)
        this.treeData = _.cloneDeep(newRoutes)
        console.log(this.treeData)
        /* 处理btn按钮实现 */
        this.$nextTick(() => {
            this.setDefaultChecked()
        })
        if (this.rootInfo.dialogInfo.dialogStatus === 'view') {
            this.viewDialog(this.treeData)
        }
    },
    methods: {
        viewDialog(arr) {
            arr.map((item) => {
                item.disabled=true
                if (item.children && item.children.length > 0) {
                    this.viewDialog(item.children)
                }
            })
        },
        /* 进行设置选中内容 */
        setDefaultChecked() {
            this.initCheck = false
            let authorityList = JSON.parse(window.sessionStorage.getItem('Admin-Authority'))
            // this.serviceChecked
            this.initCheck = true
            // 先获取菜单权限，设置菜单权限的选中。
            let checkedMenu = []
            let checkedBtn = []
            authorityList.map((item) => {
                if (this.serviceChecked.includes(item.id)) {
                    checkedMenu.push(item.url)
                }
                if (item.children && item.children.length > 0) {
                    item.children.map((childrenItem) => {
                        if (this.serviceChecked.includes(childrenItem.id)) {
                            checkedBtn.push(childrenItem.url)
                        }
                    })
                }
            })
            this.$refs.treeRef.setCheckedKeys(checkedMenu)
            // 设置按钮选中的状态。
            this.setBtnCheck(this.treeData,checkedBtn)
            this.$nextTick(() => {
                this.initCheck = false
            })
        },
        // 设置按钮选中
        setBtnCheck(arr,checkedBtn) {
            arr.map((item) => {
                if (item.children && item.children.length > 0) {
                    this.setBtnCheck(item.children,checkedBtn)
                } else {
                    if (item.permissionBtn && item.permissionBtn.length > 0) {
                        item.permissionBtn.map((permissionBtnItem) => {
                            /* 设置按钮为 true就可以了 */
                            if (checkedBtn.includes(permissionBtnItem.url)) {
                                permissionBtnItem.checked = true
                            }
                        })
                    }
                }
            })
        },
        /* 获取服务端返回类表，通过当前的用户id, */
        handleCheckChange(data, checked, indeterminate) {
            data.checked = checked
            if (data.permissionBtn && data.permissionBtn.length > 0 && this.isBtnRelated && !this.initCheck) {
                data.permissionBtn.map((item) => {item.checked = checked})
            }
            if (!indeterminate) {
                this.isBtnRelated = true
            }
        },
        /* 提交按钮 */
        submitClick(id) {
            /* 当前选中路径,所有路径 */
            let checkPathArr = []
            this.getCheckedPath(this.treeData, checkPathArr)
            let authorityList = JSON.parse(window.sessionStorage.getItem('Admin-Authority'))
            // 根据后端返回权限列表，转化成一级列表
            let serviceAuthorityList = []
            authorityList.map((item) => {
                serviceAuthorityList.push({ id: item.id, path: item.url })
                if (item.children && item.children.length > 0) {
                    item.children.map((childrenItem) => {
                        serviceAuthorityList.push({ id: childrenItem.id, path: childrenItem.url })
                    })
                }
            })
            let submitIdArr = []
            /* 判断是否包含在内， */
            serviceAuthorityList.map((item) => {
                if (checkPathArr.includes(item.path)) {
                    submitIdArr.push(item.id)
                }
            })
            let params = {
                permissionId: id,
                resourcesId: submitIdArr
            }
            this.$service('put', '/SERVICE-SYSTEM/api/permission/grant', params).then(resData => {
                this.$message({
                    type: 'success',
                    message: '提交成功！'
                })
                this.$emit('update:getData',false)
                this.setDialogShow(false)
                // this.getAuthority()
            }).catch(() => {
                // this.$emit('update:getData',false)
            })
        },
        /**
         * 获取每一个菜单和和后端返回给的数据进行对比，将筛选出路由id发给后端
         * */
        getCheckedPath(data, checkPathArr) {
            data.map((item) => {
                if (item.children && item.children.length > 0) {
                    this.getCheckedPath(item.children, checkPathArr)
                } else {
                    if (item.checked) {
                        checkPathArr.push(item.path)
                        if (item.permissionBtn && item.permissionBtn.length > 0) {
                            item.permissionBtn.map((permissionBtnItem) => {
                                if (permissionBtnItem.checked) {
                                    checkPathArr.push(permissionBtnItem.path)
                                }
                            })
                        }
                    }
                }
            })
        },
        /* 操作checkbox,按钮 */
        btnAuthorityChange(status, node, data) {
            if (status) {
                if (!data.checked) {
                    this.isBtnRelated = false
                }
                this.$refs.treeRef.setChecked(data, true)
            }
        },
        delComponent(arr) {
            arr.map((item) => {
                if (item.component) delete item.component
                if (item.children && item.children.length) {
                    this.delComponent(item.children)
                }
            })
        },
        handlerBtnData(newRoutes) {
            newRoutes.map((item) => {
                item.checked = false
                if (item.children && item.children.length > 0) {
                    this.handlerBtnData(item.children)
                } else {
                    if (item.permission && item.permission.length > 0) {
                        item.permissionBtn = []
                        item.permission.map((permissionItem) => {
                            item.permissionBtn.push({
                                title: i18n.t(`button.${permissionItem}`),
                                checked: false,
                                url: `${item.path}/${permissionItem}`,
                                path: `${item.path}/${permissionItem}`
                            })
                        })
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-checkbox__label {
    color: #909399;
}

/deep/ .el-tree-node__content {
    min-height: 44px;
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
}

/deep/ .el-tree > .el-tree-node {
    min-width: 700px;
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color: red;
}
</style>
