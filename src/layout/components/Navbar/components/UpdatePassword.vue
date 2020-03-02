<!-- 修改密码弹出框组件 -->
<template>
    <el-dialog
        v-drag-dialog
        append-to-body
        title="修改密码"
        width="510px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="passwordDialog"
    >
        <div>
            <el-form
                ref="passwordDom"
                status-icon
                :model="passwordData"
                :rules="passwordRules"
                label-width="110px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="原密码 :"
                    prop="oldPassword"
                    :required="true"
                >
                    <el-input
                        v-model="passwordData.oldPassword"
                        type="password"
                        :minlength="6"
                        :maxlength="16"
                        placeholder="请输入包括字母、数字的6~16位字符"
                    />
                </el-form-item>
                <el-form-item
                    label="新密码 :"
                    prop="password"
                    :required="true"
                >
                    <el-input
                        v-model="passwordData.password"
                        type="password"
                        :minlength="6"
                        :maxlength="16"
                        placeholder="请输入包括字母、数字的6~16位字符"
                    />
                </el-form-item>
                <el-form-item
                    label="确认密码 :"
                    prop="confirmPassword"
                    :required="true"
                >
                    <el-input
                        v-model="passwordData.confirmPassword"
                        type="password"
                        :minlength="6"
                        :maxlength="16"
                        placeholder="请再次输入新设置的密码"
                    />
                </el-form-item>
            </el-form>
        </div>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button @click="resetAdminPassword('passwordDom')">取消</el-button>
            <el-button
                type="primary"
                :loading="loadingStatus"
                @click="updatePasswordClick('passwordDom')"
            >{{ loadingStatus ? '保存中': '确定' }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { checkPassword } from '@/utils/validate'

export default {
    name: 'UpdatePassword',
    props: {
        passwordDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            loadingStatus: false,              // loading保存状态
            // 修改密码数据
            passwordData: {
                oldPassword: '',               // 原密码
                password: '',                  // 新密码
                confirmPassword: ''            // 确认密码
            },
            // 修改验证规则
            passwordRules: {
                oldPassword: [
                    {
                        validator: (rule, value, callback) => {
                            if (_.trim(value) === '') {
                                callback(new Error('请输入密码'))
                            } else if (_.trim(value).length < 6) {
                                callback(new Error('密码不能少于6位数且不能大于16位数'))
                            } else if (_.trim(value) !== '' && _.trim(value).length >= 6) {
                                if (checkPassword(_.trim(value)) === false) {
                                    callback(new Error('请输入包含字母、数字的6-16位字符'))
                                }
                            }
                            callback()
                        },
                        // trigger: ['change','blur']
                        trigger: ['change','blur']
                    }
                ],
                password: [
                    {
                        validator: (rule, value, callback) => {
                            if (_.trim(value) === '') {
                                callback(new Error('请输入密码'))
                            } else if (_.trim(value).length < 6) {
                                callback(new Error('密码不能少于6位数且不能大于16位数'))
                            } else if (_.trim(value) !== '' && _.trim(value).length >= 6) {
                                if (checkPassword(_.trim(value)) === false) {
                                    callback(new Error('请输入包含字母、数字的6-16位字符'))
                                }
                            }
                            callback()
                        },
                        trigger: ['change','blur']
                    }
                ],
                confirmPassword: [
                    {
                        validator: (rule, value, callback) => {
                            if (_.trim(value) === '') {
                                callback(new Error('请输入密码'))
                            } else if (_.trim(value).length < 6) {
                                callback(new Error('密码不能少于6位数且不能大于16位数'))
                            } else if (_.trim(value) !== '' && _.trim(value).length >= 6) {
                                if (checkPassword(_.trim(value)) === false) {
                                    callback(new Error('请输入包含字母、数字的6-16位字符'))
                                }
                            }
                            callback()
                        },
                        trigger: ['change','blur']
                    }
                ]
            }
        }
    },
    mounted() {},
    methods: {
        // 修改密码
        updatePasswordClick(formName) {
            this.$refs[formName].validate(async(valid) => {
                if (valid) {
                    if (this.passwordData.password !== this.passwordData.confirmPassword) {
                        this.$message.error('确认密码于新密码不一致')
                    } else {
                        let params = {
                            newName: window.sessionStorage.getItem('Admin-Name'),
                            newPassword: this.passwordData.password,
                            oldPassword: this.passwordData.oldPassword
                        }
                        this.loadingStatus = true
                        this.$service('put', '/SERVICE-SYSTEM/api/v1/user', params).then(async(list) => {
                            this.loadingStatus = false
                            window.sessionStorage.clear()
                            await this.$store.dispatch('tagsView/delAllViews', null, { root: true })
                            await this.$store.dispatch('permission/resetRouter', null, { root: true })
                            this.$emit('update:passwordDialog', false)
                            // 为了避免bug,重新实例化vue-router对象
                            this.$router.push({ path: '/' })
                        }).catch((error) => {
                            this.loadingStatus = false
                            this.$message.error(error.message)
                        })
                    }
                } else {
                    return false
                }
            })
        },
        // 取消修改密码
        resetAdminPassword(formName) {
            this.$refs[formName].resetFields()
            this.$message('取消修改密码')
            this.passwordData.oldPassword = ''
            this.passwordData.password = ''
            this.passwordData.confirmPassword = ''
            this.$emit('update:passwordDialog', false)
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
