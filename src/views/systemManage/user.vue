<!-- 用户管理页面 -->
<template>
    <vt-page type="one">
        <div class="user-page">
            <div class="left-pack">
                <div class="title-pack clear-float">
                    <div class="float-left">
                        <span class="color-label" />
                        <span class="page-title-text">组织机构列表</span>
                    </div>
                </div>
                <div
                    class="search-pack"
                >
                    <el-input
                        v-model="filterText"
                        clearable
                        placeholder="请输入搜索关键字"
                    />
                </div>
                <div
                    class="org-pack"
                >
                    <el-tree
                        ref="departmentTree"
                        empty-text="暂无组织机构"
                        node-key="id"
                        default-expand-all
                        :data="allDepartmentList"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        @node-click="departmentTreeClick"
                    >
                        <span
                            slot-scope="{ node }"
                            class="custom-tree-node"
                        >
                            <img
                                src="../../assets/monitoring/fold.png"
                            >
                            <span style="margin-left: 4px">{{ node.data.name }}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="right-pack">
                <div class="user-pack">
                    <!-- <div class="tip-pack">
                        <svg-icon icon-class="user" />
                        <span>{{ currentDepartment.name }}的成员</span>
                    </div>-->
                    <bs-table
                        ref="BsTable"
                        :bs-data="bsData"
                        @onView="subDepartmentClick"
                    >
                        <template #operateHeader>
                            <el-button
                                v-has="{role: 'addMember'}"
                                size="mini"
                                type="primary"
                                icon="el-icon-plus"
                                @click="addMemberClick"
                            >添加成员
                            </el-button>
                        </template>
                        <template #groupId="{scope}">
                            <span>{{ getNameByGroupId(scope.row.groupId) }}</span>
                        </template>
                        <template #inService="{scope}">
                            <div style="text-align: center">
                                <span :class="[scope.row.inService?'success':'warning']">{{ scope.row.inService? '在职' : '离职' }}</span>
                            </div>
                        </template>
                        <template #roles="{scope}">
                            <div style="color: #606266;font-size: 14px">
                                <span
                                    v-if="!scope.row.roles || scope.row.roles.length === 0"
                                    style="font-size: 14px;color: #606266;"
                                >暂无</span>
                                <span
                                    v-for="(item, index) in getRoleNameList(scope.row.roles)"
                                    v-else
                                    :key="index"
                                    style="font-size: 14px;"
                                >
                                    <span v-if="index !== 0">、</span>
                                    <span>{{ item }}</span>
                                </span>
                            </div>
                        </template>
                        <template #is_enabled="{scope}">
                            <div style="text-align: center">
                                <el-switch
                                    v-model="scope.row.is_enabled"
                                    :disabled="!$has($route,'disable')"
                                    active-text=""
                                    inactive-text=""
                                    @change="changeUserStatus(scope.row)"
                                />
                            </div>
                        </template>
                        <template #operate="{scope}">
                            <el-button
                                v-has="{role: 'editMember'}"
                                type="text"
                                @click="editMemberClick(scope.row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                v-has="{role: 'resetPassword'}"
                                type="text"
                                @click="resetPassword(scope.row)"
                            >重置密码
                            </el-button>
                        </template>
                    </bs-table>
                </div>
            </div>
            <!-- 添加成员弹框 -->
            <el-dialog
                v-drag-dialog
                title="添加成员"
                :visible.sync="addMemberDialog"
                :show-close="false"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                width="520px"
            >
                <div class="new-member-pack">
                    <el-form
                        ref="addMemberFormDom"
                        :model="addMemberFormData"
                        :rules="memberFormRules"
                        status-icon
                        label-position="right"
                        label-width="100px"
                    >
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="用户名"
                                    prop="username"
                                >
                                    <el-input
                                        v-model.trim="addMemberFormData.username"
                                        size="medium"
                                        type="text"
                                        maxlength="20"
                                        auto-complete="off"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="姓名"
                                    prop="name"
                                >
                                    <el-input
                                        v-model.trim="addMemberFormData.name"
                                        maxlength="20"
                                        type="text"
                                        size="medium"
                                        auto-complete="off"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="员工编号"
                                    prop="employeeNumber"
                                >
                                    <el-input
                                        v-model.trim="addMemberFormData.employeeNumber"
                                        maxlength="20"
                                        type="text"
                                        size="medium"
                                        auto-complete="off"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="所属部门"
                                    prop="groupName"
                                    :required="true"
                                >
                                    <el-input
                                        ref="parentDepartmentInput"
                                        v-model.trim="addMemberFormData.groupName"
                                        size="medium"
                                        type="text"
                                        auto-complete="off"
                                        @focus="parentNameFocus"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="角色"
                                    prop="roles"
                                >
                                    <el-select
                                        v-model.trim="addMemberFormData.roles"
                                        size="medium"
                                        style="width: 360px"
                                        multiple
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in roleList"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="item.code"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="是否在职"
                                    prop="inService"
                                    :required="true"
                                >
                                    <el-select
                                        v-model.trim="addMemberFormData.inService"
                                        style="width: 350px;"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            label="在职"
                                            :value="true"
                                        />
                                        <el-option
                                            label="离职"
                                            :value="false"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button
                        size="mini"
                        @click="cancelAddMemberClick"
                    >取 消</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="saveAddMemberClick"
                    >确 定</el-button>
                </span>
            </el-dialog>

            <!-- 编辑成员弹框 -->
            <el-dialog
                v-drag-dialog
                title="编辑成员"
                :visible.sync="editMemberDialog"
                :show-close="false"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                width="520px"
            >
                <div class="edit-member-pack">
                    <el-form
                        ref="editMemberFormDom"
                        :model="editMemberFormData"
                        :rules="memberFormRules"
                        status-icon
                        label-position="right"
                        label-width="100px"
                    >
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="用户名"
                                    prop="username"
                                    :required="true"
                                >
                                    <el-input
                                        v-model.trim="editMemberFormData.username"
                                        :disabled="true"
                                        type="text"
                                        style="width: 350px;"
                                        maxlength="20"
                                        auto-complete="off"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="姓名"
                                    prop="name"
                                    :required="true"
                                >
                                    <el-input
                                        v-model.trim="editMemberFormData.name"
                                        type="text"
                                        style="width: 350px;"
                                        maxlength="20"
                                        auto-complete="off"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="员工编号"
                                    prop="employeeNumber"
                                >
                                    <el-input
                                        v-model.trim="editMemberFormData.employeeNumber"
                                        maxlength="20"
                                        type="text"
                                        size="medium"
                                        auto-complete="off"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="所属部门"
                                    prop="groupName"
                                    :required="true"
                                >
                                    <!-- <el-input
                                        ref="parentDepartmentInput"
                                        v-model.trim="currentDepartment.name"
                                        type="text"
                                        style="width: 350px;"
                                        :disabled="true"
                                        auto-complete="off"
                                        @focus="parentNameFocus"
                                    /> -->
                                    <el-input
                                        ref="parentDepartmentInput"
                                        v-model.trim="editMemberFormData.groupName"
                                        type="text"
                                        style="width: 350px;"
                                        auto-complete="off"
                                        @focus="parentNameFocus"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="角色"
                                    prop="roles"
                                    :required="true"
                                >
                                    <el-select
                                        v-model.trim="editMemberFormData.roles"
                                        style="width: 350px;"
                                        multiple
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in roleList"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="item.code"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item
                                    label="是否在职"
                                    prop="inService"
                                    :required="true"
                                >
                                    <el-select
                                        v-model.trim="editMemberFormData.inService"
                                        style="width: 350px;"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            label="在职"
                                            :value="true"
                                        />
                                        <el-option
                                            label="离职"
                                            :value="false"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button
                        size="mini"
                        @click="cancelEditMemberClick"
                    >取 消</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="saveEditMemberClick"
                    >确 定</el-button>
                </span>
            </el-dialog>

            <!-- 选择部门弹框 -->
            <el-dialog
                v-drag-dialog
                title="选择部门"
                :visible.sync="choiceDepartmentDialog"
                :show-close="false"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                width="750px"
            >
                <div class="choice-department-pack">
                    <div class="left-pack">
                        <div class="tip-pack">备选列表：</div>
                        <div class="content-pack">
                            <el-tree
                                :data="choiceTreeData"
                                :highlight-current="true"
                                node-key="id"
                                default-expand-all
                                :expand-on-click-node="false"
                                @node-click="choiceDepartmentClick"
                            >
                                <span
                                    slot-scope="{ node }"
                                    class="custom-tree-node"
                                >
                                    <img
                                        src="../../assets/monitoring/fold.png"
                                    >
                                    <span style="margin-left: 4px">{{ node.data.name }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </div>
                    <div class="interval-pack" />
                    <div class="right-pack">
                        <div class="tip-pack">已选：</div>
                        <div class="content-pack">
                            <div
                                v-for="(item, index) in checkedDepartment"
                                :key="item.id"
                                class="item"
                            >
                                <svg-icon icon-class="department" />
                                <span>{{ item.name }}</span>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="deleteChoiceDepartmentClick(index)"
                                >移除
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button
                        type="primary"
                        @click="confirmChoiceDepartmentClick"
                    >确 定</el-button>
                    <el-button @click="cancelChoiceDepartmentClick">取 消</el-button>
                </span>
            </el-dialog>
            <!-- 选择部门 树级 -->
            <el-dialog
                v-drag-dialog
                title="部门列表"
                :visible.sync="dialogVisible"
                width="500px"
                :show-close="false"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
            >
                <span>
                    <el-tree
                        ref="tree"
                        empty-text="暂无组织机构"
                        node-key="id"
                        default-expand-all
                        :data="allDepartmentList"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        @node-click="departmentTree"
                    >
                        <span
                            slot-scope="{ node }"
                            class="custom-tree-node"
                        >
                            <span>{{ node.data.name }}</span>
                        </span>
                    </el-tree>
                </span>
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button
                        size="mini"
                        @click="treecCancel()"
                    >取 消</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="treeAffirm()"
                    >确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </vt-page>
</template>

<script>
import { MessageBox } from 'element-ui'
import { randomRange, flatten } from '@/utils/index'

export default {
    name: 'User',
    data() {
        return {
            filterText: '',  // 搜索关键字
            departmentTableHeight: 0,  // 部门table高度
            memberTableHeight: 0,  // 成员table高度
            allDepartmentList: [],  // 全部部门列表
            flattenAllDepartmentList: [],  // 全部部门列表（一维数组）
            currentDepartment: {},  // 当前选中的部门
            subDepartmentList: [],  // 子部门列表
            subMemberList: [],  // 成员列表
            selectedMemberList: [],  // 选中的成员列表
            roleList: [],  // 角色列表
            // 选择部门弹框相关数据
            choiceDepartmentDialog: false,
            dialogVisible: false,//部门列表树级接口
            choiceTreeData: [],  // 部门列表
            checkedDepartment: [],  // 选中的部门列表
            // 编辑部门弹框相关数据
            editDepartmentDialog: false,
            editDepartmentFormData: {
                id: '',
                code: '',
                name: '',
                parentId: '',
                level: 0,
                roles: []
            },
            // 新增部门弹框相关数据
            addDepartmentDialog: false,
            addDepartmentFormData: {
                code: '',
                name: '',
                parentId: '',
                level: 0,
                roles: []
            },
            departmentFormRules: {
                code: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请填写部门编码'))
                            }
                            callback()
                        },
                        trigger: ['blur', 'change']
                    }
                ],
                name: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请填写部门名称'))
                            }
                            callback()
                        },
                        trigger: ['blur', 'change']
                    }
                ],
                parentId: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请选择上级部门'))
                            }
                            callback()
                        },
                        trigger: ['blur', 'change']
                    }
                ],
                roles: [
                    {
                        validator: (rule, value, callback) => {
                            if (value.length === 0) {
                                callback(new Error('请至少选择一个角色'))
                            }
                            callback()
                        },
                        trigger: ['blur', 'change']
                    }
                ]
            },
            // 新增成员弹框相关数据
            addMemberDialog: false,
            addMemberFormData: {
                name: '',
                groupId: 0,
                groupName: '',
                username: '',
                employeeNumber: '',//员工编号
                inService: true,
                roles: []
            },
            // 添加成员表单验证规则
            memberFormRules: {
                username: [{ required: true, message: '请填写用户名', trigger: ['blur', 'change'] }],
                employeeNumber: [{ required: true, message: '请填写员工编号', trigger: ['blur', 'change'] }],
                name: [{ required: true, message: '请填写成员姓名', trigger: ['blur', 'change'] }],
                groupName: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请选择一个上级部门'))
                            }
                            callback()
                        },
                        trigger: ['blur', 'change']
                    }
                ],
                groupId: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请选择一个上级部门'))
                            }
                            callback()
                        },
                        trigger: ['blur', 'change']
                    }
                ],
                roles: [
                    { message: '请选择一个角色', required: true },
                    {
                        validator: (rule, value, callback) => {
                            if (value.length === 0) {
                                callback(new Error('请至少选择一个角色'))
                            } else {
                                callback()
                            }
                        },
                        trigger: ['blur', 'change']
                    }
                ]
            },
            // 编辑成员相关数据
            editMemberDialog: false,
            editMemberFormData: {
                id: '',
                name: '',
                groupId: 0,
                groupName: '',
                username: '',
                employeeNumber: '',
                inService: true,
                roles: []
            },
            tableLoading: false,        // 表格loading状态
            total: 0,
            currentPage: 1,             // 当前列表页
            pageSize: 50,                // 当前列表数量
            typeDialog: '',                //   弹窗类型
            treeSelectData: {},         //部门树选中数据
            searchValue: '',
            bsData: {
                searchConfig: {
                    fields: [
                        {
                            label: '用户名/姓名',
                            value: '', // 可以穿默认值
                            type: 'INPUT',
                            key: 'search',
                            placeholder: '请输入用户名和姓名'
                        }
                    ]
                },
                tableConfig: {
                    forbid: true,
                    url: '/SERVICE-SYSTEM/api/v1/group/user/list',
                    methods: 'get',
                    params:{
                        groupId: '',
                    },
                    // 列配置
                    columns: [
                        {
                            type: 'index'
                        },
                        {
                            label: '用户名',
                            prop: 'username',
                            'min-width': 140
                        },
                        {
                            label: '姓名',
                            prop: 'name',
                            'min-width': 140
                        },
                        {
                            label: '所属部门',
                            prop: 'groupId',
                            slotName: 'groupId',
                            'min-width': 140
                        },
                        {
                            label: '角色',
                            prop: 'roles',
                            slotName: 'roles',
                            'min-width': 140
                        },
                        {
                            label: '是否在职',
                            prop: 'inService',
                            slotName: 'inService',
                            width: 80
                        },
                        {
                            label: '状态',
                            prop: 'is_enabled',
                            slotName: 'is_enabled',
                            width: 70
                        },
                        { label: '操作', slotName: 'operate' ,width: this.$global.op_3,align: 'center'}
                    ]
                }
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.departmentTree.filter(val)
        }
    },
    // 实例创建完成
    async created() {
        // 2. 获取左侧部门架构数据
        try {
            let list = await this.$fetch('group-controller/tree-get')
            this.allDepartmentList = _.cloneDeep(list)
            // 拍扁树状数据结构
            this.flattenAllDepartmentList = flatten(_.cloneDeep(list))
            // 默认选中第一个作为当前选中部门
            if (this.allDepartmentList.length > 0) {
                this.currentDepartment = _.cloneDeep(this.allDepartmentList[0])
                // this.currentDepartment.roles = ['ROLE_USER']
                setTimeout(() => {
                    this.$refs.departmentTree.setCurrentKey(this.currentDepartment.id)
                }, 0)
            }
            let params = {
                pageNum: '1',
                pageSize: '1000',
                roleQueryParam: ''
            }
            let res = await this.$fetch('role-controller/list-get', params)
            this.roleList = _.cloneDeep(res.list)
            // 4. 获取人员列表
            this.bsData.tableConfig.params.groupId = this.currentDepartment.id
            this.$refs.BsTable.initTable()
            // 5. 获取角色列表
        } catch (error) {
            console.log(error)
        }
    },
    async mounted() {},
    methods: {
        // 页面相关事件------------------------------
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        // 部门tree点击事件
        departmentTreeClick(data, node, e) {
            // 1. 设置当前选中的对象
            this.currentDepartment = _.cloneDeep(data)
            // 2. 获取子部门列表
            this.bsData.tableConfig.params.groupId = this.currentDepartment.id
            // 3. 获取人员列表
            this.$refs.BsTable.initTable()
        },
        // 下级部门点击事件
        subDepartmentClick(data) {
            // 1. 设置当前选中的对象
            this.currentDepartment = _.cloneDeep(data)
            // 2. 设置tree当前选中部门
            setTimeout(() => {
                this.$refs.departmentTree.setCurrentKey(this.currentDepartment.id)
            }, 0)
            // 3. 获取子部门列表
            this.bsData.tableConfig.params.groupId = this.currentDepartment.id
            // 4. 获取人员列表
            this.$refs.BsTable.initTable()
        },
        // 编辑部门点击事件
        editDepartmentClick(data) {
            // 1. 赋值当前部门
            this.editDepartmentFormData = _.cloneDeep(data)
            // 2. 显示弹框
            this.editDepartmentDialog = true
        },
        // 删除部门点击事件
        deleteDepartmentClick(data) {
            this.$confirm(`确定要删除 ${data.name} 部门吗？`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$service('delete', '/SERVICE-SYSTEM/api/v1/group/{groupId}', {
                    groupId: data.id,
                    hash: 'groupId'
                }).then(() => {
                    this.$message.success('删除部门成功')
                    // 刷新部门列表
                    this.getAllDepartmentList()
                    this.getSubDepartmentList()
                    this.$refs.BsTable.initTable()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 上级部门文本框点击事件
        parentNameFocus() {
            this.dialogVisible = true
            // if (this.editDepartmentDialog) {
            //     // 1. 先让文本框失去焦点
            //     this.$refs['parentDepartmentInput'].blur()
            //     // 2. 请求除了本部门之外的部门数据
            //     // this.$store.dispatch('BaseFramework/BasicUser/getRejectDepartment').then((list) => {
            //     //     this.choiceTreeData = _.cloneDeep(list);
            //     //     // 3. 把当前部门的父级放到已选数据列表中
            //     //     this.checkedDepartment = [{
            //     //         id: this.currentDepartment.parentId,
            //     //         name: this.currentDepartment.parentName
            //     //     }];
            //     //     // 4. 显示弹框
            //     //     this.choiceDepartmentDialog = true;
            //     // })
            //     // 2. 赋值所有的部门数据
            //     this.choiceTreeData = _.cloneDeep(this.allDepartmentList)
            //     // 3. 把当前部门的父级放到已选数据列表中
            //     this.checkedDepartment = [_.cloneDeep(this.currentDepartment.parent)]
            //     // 4. 显示弹框
            //     this.choiceDepartmentDialog = true
            // } else if (this.addDepartmentDialog) {
            //     // 1. 先让文本框失去焦点
            //     this.$refs['parentDepartmentInput'].blur()
            //     // 2. 赋值所有的部门数据
            //     this.choiceTreeData = _.cloneDeep(this.allDepartmentList)
            //     // 3. 把当前部门放到已选数据列表中
            //     this.checkedDepartment = [_.cloneDeep(this.currentDepartment)]
            //     // 4. 显示弹框
            //     this.choiceDepartmentDialog = true
            // } else if (this.addMemberDialog) {
            //     // 1. 赋值所有的部门数据
            //     this.choiceTreeData = _.cloneDeep(this.allDepartmentList)
            //     // 2. 把当前部门放到已选数据列表中
            //     this.checkedDepartment = [_.cloneDeep(this.currentDepartment)]
            //     // 3. 显示弹框
            //     this.choiceDepartmentDialog = true
            // } else if (this.editMemberDialog) {
            //     // 1. 赋值所有的部门数据
            //     this.choiceTreeData = _.cloneDeep(this.allDepartmentList)
            //     // 2. 把当前用户数据的值赋给已选部门数据列表中
            //     this.checkedDepartment = _.cloneDeep(this.editMemberFormData.groups)
            //     // 3. 显示弹框
            //     this.choiceDepartmentDialog = true
            // }
        },
        //确认取消事件
        departmentTree(data) {
            console.log(data)
            this.treeSelectData = data
            if (this.typeDialog === 'add') {
                console.log('1')
                this.addMemberFormData.groupName = this.treeSelectData.name
                this.addMemberFormData.groupId = this.treeSelectData.id
            } else {
                console.log('2')
                this.editMemberFormData.groupName = this.treeSelectData.name
                this.editMemberFormData.groupId = this.treeSelectData.id
            }
        },
        //部门树确认事件
        treeAffirm() {
            if (this.typeDialog === 'add') {
                if (this.addMemberFormData.groupName === '') {
                    this.$message.warning('请选择部门')
                } else {
                    this.dialogVisible = false
                }
            } else {
                if (this.editMemberFormData.groupName === '') {
                    this.$message.warning('请选择部门')
                } else {
                    this.dialogVisible = false
                }
            }
        },
        //部门树取消事件
        treecCancel() {
            this.dialogVisible = false
            this.addMemberFormData.groupName = ''
            this.addMemberFormData.groupId = 0
            this.editMemberFormData.groupName = ''
            this.editMemberFormData.groupId = 0
        },
        // 保存修改部门弹框事件
        saveEditDepartmentClick() {
            this.$refs['editDepartmentFormDom'].validate((valid) => {
                if (valid) {
                    this.$confirm(`确定要修改部门信息吗？`, '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        this.$service('put', '/SERVICE-SYSTEM/api/v1/group', this.editDepartmentFormData)
                          .then((cbData) => {
                              this.$message.success('修改部门成功')
                              this.editDepartmentDialog = false
                              // 刷新部门列表
                              this.getAllDepartmentList()
                              this.getSubDepartmentList()
                              this.bsData.tableConfig.params.groupId = this.currentDepartment.id
                              this.$refs.BsTable.initTable()
                          })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        })
                    })
                } else {
                    return false
                }
            })
        },
        // 关闭编辑部门弹框事件
        cancelEditDepartmentClick() {
            this.$refs['editDepartmentFormDom'].resetFields()
            this.editDepartmentDialog = false
        },
        // 添加部门逻辑代码-------------------------------
        // 显示添加部门点击事件
        addSubDepartmentClick() {
            this.addDepartmentDialog = true
            this.addDepartmentFormData.parentId = _.cloneDeep(this.currentDepartment.id)
            this.addDepartmentFormData.roles = _.cloneDeep(this.currentDepartment.roles)
        },
        // 保存添加部门弹框事件
        saveAddDepartmentClick() {
            this.$refs['addDepartmentFormDom'].validate((valid) => {
                if (valid) {
                    this.addDepartmentFormData.level = this.currentDepartment.level + 1
                    this.$service('post', '/SERVICE-SYSTEM/api/v1/group', this.addDepartmentFormData).then((cbData) => {
                        this.$message.success('新增下级部门成功')
                        this.addDepartmentDialog = false
                        this.$refs['addDepartmentFormDom'].resetFields()
                        // 刷新部门列表
                        this.getAllDepartmentList()
                        this.getSubDepartmentList()
                    })
                    this.addDepartmentFormData.level = this.currentDepartment.level + 1
                } else {
                    return false
                }
            })
        },
        // 关闭添加部门弹框事件
        cancelAddDepartmentClick() {
            this.addDepartmentDialog = false
            this.$refs['addDepartmentFormDom'].resetFields()
        },
        // 添加成员逻辑代码-------------------------------
        // 显示添加成员点击事件
        addMemberClick() {
            this.addMemberDialog = true
            this.typeDialog = 'add'
            this.addMemberFormData.groupId = this.currentDepartment.id
            this.addMemberFormData.groupName = this.currentDepartment.name;
            this.addMemberFormData.roles = _.cloneDeep(this.currentDepartment.roles)
        },
        // 删除成员点击事件
        deleteMemberClick(username) {
            if (!username) {
                if (this.selectedMemberList.length < 1) {
                    this.$message.warning('请选择一条数据!')
                    return false
                }
            }
            this.$confirm(`确定要删除${username ? `"${username}"成员` : `这${this.selectedMemberList.length}条用户信息`}吗？`, '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                let queryParams = {}
                if (typeof (username) === 'string') {
                    queryParams = { usernameList: [username] }
                } else {
                    queryParams = { usernameList: this.selectedMemberList }
                }
                this.$service('delete', '/SERVICE-SYSTEM/api/v1/user/batch', queryParams).then((cbData) => {
                    this.$message.success('删除成员成功')
                    // 刷新成员列表
                    this.bsData.tableConfig.params.groupId = this.currentDepartment.id
                    this.$refs.BsTable.initTable()
                })
            })
        },
        // 保存添加成员弹框事件
        saveAddMemberClick() {
            this.$refs['addMemberFormDom'].validate((valid) => {
                if (valid) {
                    let randomPassword = randomRange(6, 18)
                    this.addMemberFormData.password = randomPassword
                    let params = Object.assign({}, this.addMemberFormData, { enabled: true })
                    this.$service('post', '/SERVICE-SYSTEM/api/v1/user', params).then((cbData) => {
                        this.$confirm(`用户 ${this.addMemberFormData.name} 创建成功，此用户的密码为：${randomPassword}`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '关闭',
                            type: 'success'
                        }).then(() => {
                        }).catch(() => {
                        })
                        this.addMemberDialog = false
                        this.$refs['addMemberFormDom'].resetFields()
                        this.addMemberFormData.roles = []
                        // 刷新成员列表
                        this.bsData.tableConfig.params.groupId = this.currentDepartment.id
                        this.$refs.BsTable.initTable()
                    })
                    // this.$store.dispatch('Department/addMember', this.addMemberFormData).then((cbData) => {
                    //     this.$confirm(`用户 ${this.addMemberFormData.name} 创建成功，此用户的密码为：${randomPassword}`, '提示', {
                    //         confirmButtonText: '确定',
                    //         cancelButtonText: '关闭',
                    //         type: 'success'
                    //     }).then(() => {}).catch(() => {})
                    //     this.addMemberDialog = false
                    //     this.$refs['addMemberFormDom'].resetFields()
                    //     this.addMemberFormData.roles = []
                    //     // 刷新成员列表
                    //     this.$refs.BsTable.initTable()
                    // }).catch((response) => {
                    //     this.$message.error(response.message)
                    // })
                } else {
                    return false
                }
            })
        },
        // 关闭添加成员弹框事件
        cancelAddMemberClick() {
            this.$refs['addMemberFormDom'].resetFields()
            this.addMemberFormData.roles = []
            this.addMemberDialog = false
        },
        // 编辑成员逻辑代码-------------------------------
        // 禁用启用用户
        changeUserStatus(user) {
            this.$service('put', '/SERVICE-SYSTEM/api/v1/user/status', user).then((res) => {
                this.$message.success('修改状态成功')
            })
        },
        // 显示编辑成员点击事件
        editMemberClick(rowData) {
            console.log(rowData)
            this.typeDialog = 'edit'
            // 1. 将本条数据的上级部门信息提取出来
            this.editMemberFormData = _.cloneDeep(rowData)
            // 2. 显示弹框
            this.editMemberDialog = true
        },
        // 保存编辑成员弹框事件
        saveEditMemberClick() {
            this.$refs['editMemberFormDom'].validate((valid) => {
                if (valid) {
                    this.$confirm(`确定要修改成员信息吗？`, '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        this.editMemberFormData.hash = 'username'
                        this.$service('put', '/SERVICE-SYSTEM/api/v1/user/designation', this.editMemberFormData).then((res) => {
                            this.$message.success('修改成员成功')
                            this.editMemberDialog = false
                            // 刷新成员列表
                            this.bsData.tableConfig.params.groupId = this.currentDepartment.id
                            this.$refs.BsTable.initTable()
                        })
                        // this.$store.dispatch('Department/updateMember', this.editMemberFormData).then((cbData) => {
                        //     this.$message.success('修改成员成功')
                        //     this.editMemberDialog = false
                        //     // 刷新成员列表
                        //     this.$refs.BsTable.initTable()
                        // }).catch((response) => {
                        //     this.$message.error(response.message)
                        // })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消修改'
                        })
                    })
                } else {
                    return false
                }
            })
        },
        // 关闭编辑成员弹框事件
        cancelEditMemberClick() {
            this.$refs['editMemberFormDom'].resetFields()
            this.editMemberDialog = false
        },
        // 选择部门弹框相关事件------------------------------
        // 部门tree点击事件
        choiceDepartmentClick(data, node, e) {
            if (this.addDepartmentDialog || this.editDepartmentDialog) {
                // 部门弹框打开的选择部门只能选择一个
                this.checkedDepartment = [
                    {
                        id: data.id,
                        name: data.name
                    }]
            } else {
                // 用户弹框打开的选择部门可以选择多个
                let isExist = false
                for (let i = 0, len = this.checkedDepartment.length; i < len; i++) {
                    if (this.checkedDepartment[i].id === data.id) {
                        isExist = true
                        break
                    }
                }
                if (!isExist) {
                    this.checkedDepartment.push(data)
                }
            }
        },
        // 删除选中部门点击事件
        deleteChoiceDepartmentClick(index) {
            this.checkedDepartment.splice(index, 1)
        },
        // 确定选择部门点击事件
        confirmChoiceDepartmentClick() {
            // 1. 判断规则
            if (this.checkedDepartment.length === 0) {
                MessageBox.confirm('至少选中一个部门', '错误提示', {
                    showCancelButton: false,
                    type: 'error'
                })
                return false
            }
            // 2. 把选中的部门赋值给form数据
            if (this.editDepartmentDialog) {
                this.editDepartmentFormData.parent = _.cloneDeep(this.checkedDepartment[0])
            } else if (this.addDepartmentDialog) {
                this.addDepartmentFormData.parent = _.cloneDeep(this.checkedDepartment[0])
            } else {
                if (this.addMemberDialog) {
                    this.addMemberFormData.groups = _.cloneDeep(this.checkedDepartment)
                } else {
                    this.editMemberFormData.groups = _.cloneDeep(this.checkedDepartment)
                }
            }
            // 3. 关闭弹框
            this.choiceDepartmentDialog = false
        },
        // 取消选择部门点击事件
        cancelChoiceDepartmentClick() {
            this.choiceDepartmentDialog = false
        },

        // 人员选中事件
        memberSelectionChange(val) {
            let list = []
            for (let item of val) {
                list.push(item.username)
            }
            this.selectedMemberList = list
        },
        // 功能方法----------------------------------------------------------
        getAllDepartmentList() {
            this.$service('get', '/SERVICE-SYSTEM/api/v1/group/tree').then((list) => {
                this.allDepartmentList = _.cloneDeep(list)
                // 拍扁树状数据结构
                this.flattenAllDepartmentList = flatten(_.cloneDeep(list))
                setTimeout(() => {
                    this.$refs.departmentTree.setCurrentKey(this.currentDepartment.id)
                }, 0)
            })
        },
        // 获取当前部门下的子部门列表
        getSubDepartmentList() {
            let params = {
                groupId: this.currentDepartment.id
            }
            this.$service('get', '/SERVICE-SYSTEM/api/v1/group/children', params).then((subDepartmentList) => {
                if (subDepartmentList !== undefined && subDepartmentList.list && subDepartmentList.list.length > 0) {
                    this.subDepartmentList = _.cloneDeep(subDepartmentList.list)
                } else {
                    this.subDepartmentList = []
                }
            })
        },
        resetClick() {
            this.searchValue = ''
            this.bsData.tableConfig.params.groupId = this.currentDepartment.id
            this.$refs.BsTable.initTable()
        },
        // 获取当前部门下的人员列表
        getSubMemberList() {
            let params = {
                search: this.searchValue,
                groupId: this.currentDepartment.id,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            this.tableLoading = true
            this.$service('get', '/SERVICE-SYSTEM/api/v1/group/user/list', params).then((subMemberList) => {
                if (subMemberList.list.length === 0 && subMemberList.pageNum !== 1) {
                    this.currentPage -= 1
                    // 通过当前id获取子节点数据
                    this.bsData.tableConfig.params.groupId = this.currentDepartment.id
                    this.$refs.BsTable.initTable()
                } else {
                    if (subMemberList.list !== undefined) {
                        this.subMemberList = _.cloneDeep(subMemberList.list)
                    } else {
                        this.subMemberList = []
                    }
                    this.total = _.cloneDeep(subMemberList.total)
                    this.tableLoading = false
                }
            }).catch(() => {
                this.tableLoading = false
            })
        },
        onSizeChange() {
            this.currentPage = 1
            // 通过当前id获取子节点数据
            this.bsData.tableConfig.params.groupId = this.currentDepartment.id
            this.$refs.BsTable.initTable()
        },
        // 当前分页页数发生了变化
        onCurrentChange() {
            this.bsData.tableConfig.params.groupId = this.currentDepartment.id
            this.$refs.BsTable.initTable()
        },
        getRoleNameList(codeList) {
            let nameList = []
            for (let i = 0, iLen = codeList.length; i < iLen; i++) {
                for (let j = 0, jLen = this.roleList.length; j < jLen; j++) {
                    if (this.roleList[j].code === codeList[i]) {
                        nameList.push(this.roleList[j].name)
                        break
                    }
                }
            }
            return nameList
        },
        // 重置密码
        resetPassword(user) {
            this.$confirm('确定要重置该成员的登录密码吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                let randomPassword = randomRange(6, 18)
                let params = {
                    ...user,
                    password: randomPassword
                }
                this.$service('put', '/SERVICE-SYSTEM/api/v1/user/password', params).then((cbData) => {
                    this.$confirm(`重置密码成功！新密码为：${randomPassword}`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '关闭',
                        type: 'success'
                    }).then(() => {
                    }).catch(() => {
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消重置密码'
                })
            })
        },
        // 根据部门id获取部门name
        getNameByGroupId(id) {
            let name = '暂无'
            for (let i = 0, len = this.flattenAllDepartmentList.length; i < len; i++) {
                if (this.flattenAllDepartmentList[i].id === id) {
                    name = this.flattenAllDepartmentList[i].name
                    break
                }
            }
            return name
        }
    }
}
</script>

<style lang="scss" scoped>
$btnGreenDarken: #00a854; // 操作按钮开启蓝色
$btnYellowDarken: #ffbf00; // 操作按钮关闭黄色
.success{
    text-indent: 4px;
    color: $btnGreenDarken;
    &:before{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: $btnGreenDarken;
        opacity: 0.5;
        margin-right: 5px;
    }
}
.warning{
    color: $btnYellowDarken;
    &:before{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: $btnYellowDarken;
        opacity: 0.5;
        margin-right: 5px;
    }
}
.el-tree::-webkit-scrollbar {/*滚动条整体样式*/
    width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
}
.el-tree::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.el-tree::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
/deep/ .el-table .el-table__body-wrapper .el-table__body tbody .el-table__row td .cell div span {
    font-size: 14px;
}

/deep/ td:not(.is-hidden):nth-child(6) {
    /*right: 1px!important;*/
}
.user-pack{
    background: #f3f6fe!important;
}
/deep/ .el-tree-node{
    width: auto;
}
.search-pack{
    margin: 10px 0;
}
.user-page {
    position: relative;
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;

    > .left-pack {
        @include rdc-box-sizing;
        background: #fff;
        width: 260px;
        height: 100%;
        border-radius: 8px;
        padding: 0 10px;
        display: flex;
        flex-direction: column;

        .title-pack {
            font-size: 18px;
            height: 30px;
            line-height: 40px;
        }

        .org-pack {
            flex: 1;
            height: 100%;
        }
    }

    > .right-pack {
        @include rdc-box-sizing;
        height: 100%;
        padding: 0;
        position: absolute;
        left: 265px;
        right: 0;
        overflow-y: auto;

        .department-pack, .user-pack {
            @include rdc-box-sizing;
            overflow: hidden;
            margin-bottom: 10px;
            background: #fff;

            .tip-pack {
                font-size: 18px;
                height: 30px;
                line-height: 25px;
                border-bottom: 1px solid #d2d3d5;
                padding-left: 15px;
                margin-bottom: 10px;

                svg {
                    margin-right: 7px;
                    font-size: 20px;
                }

                .el-button {
                    margin-left: 5px;
                    padding: 4px 9px;
                    position: relative;
                    top: -2px;
                }
            }

            .operation-pack {
                @include rdc-box-sizing;
                //display: -webkit-flex;
                //display: flex;
                //align-items: center;
                height: 35px;
                line-height: 35px;
                width: 100%;
                padding: 0;
                padding-left: 15px;
                margin-bottom: 10px;
            }
        }

        .department-pack {
            height: 40%;
            /*border-bottom: 1px solid #f0f2f5;*/
            margin-bottom: 0;

            .title-pack {
                padding-bottom: 5px;
                margin-bottom: 10px;
                background: #fff;
                border-bottom: 1px dashed #e8e8e8;

                .el-button--mini.el-button, .el-button--small.el-button {
                    padding: 5px 15px;
                }

                .current-department-pack {
                    display: -webkit-flex;
                    display: flex;
                    align-items: center;
                    margin-bottom: 0;

                    .current-department-name {
                        font-size: 18px;
                        margin-right: 10px;
                    }

                    //.el-input {
                    //    width: 200px;
                    //    height: 25px;
                    //
                    //    input {
                    //        height: 25px;
                    //    }
                    //}
                }
            }

            .table-pack {
                padding: 0 15px 15px 15px;

                .department-name {
                    color: #38adff;
                    border-bottom: 1px solid #38adff;

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }

        .user-pack {
            height: 100%;
            margin-bottom: 0;
            display: flex;
            flex-direction: column;
            border-radius: 8px;

            .table-pack {
                padding: 0 15px 15px 15px;
            }

            .bottom_container {
                flex: 1;
            }
        }
    }

    .el-button--mini.el-button, .el-button--small.el-button {
        padding: 8px 15px;
    }

    /* 选择部门区域 */
    .choice-department-pack {
        @include rdc-box-sizing;
        display: -webkit-flex;
        display: flex;

        .left-pack, .right-pack {
            @include rdc-box-sizing;
            position: relative;
            width: 48%;
            height: 300px;

            .tip-pack {
                font-size: 16px;
                height: 30px;
            }

            .content-pack {
                @include rdc-box-sizing;
                position: absolute;
                top: 30px;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                background: #f4f6f8;
                border: 1px solid #dedede;
                border-radius: 5px;
                -moz-border-radius: 5px;

                .item {
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    position: relative;

                    .el-button {
                        float: right;
                    }
                }
            }
        }

        .interval-pack {
            width: 4%;
            height: 300px;
        }
    }

    /* 添加成员弹框 */
    .new-member-pack, .edit-member-pack {

        .member-parent-pack {
            @include rdc-box-sizing;
            width: 350px;
            height: auto;
            padding: 0 10px 10px 10px;
            border: 1px solid #dcdfe6;
            border-radius: 2px;
            -moz-border-radius: 2px;

            .el-tag {
                margin-top: 10px;
                margin-right: 10px;
            }

            &:hover {
                cursor: pointer;
            }
        }
    }

    .el-select {
        width: 350px;

        .el-tag {
            background-color: rgba(64, 158, 255, .1);
            color: #409EFF;
            border: 1px solid rgba(64, 158, 255, .2);
        }
    }
}
</style>
