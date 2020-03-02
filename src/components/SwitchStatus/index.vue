<template>
    <el-switch
        v-model="tmp_status"
        :disabled="!$has($route,role) && !!role"
        active-value="1"
        inactive-value="0"
        @change="enableClick()"
    />
</template>

<script>
export default {
    name: 'SwitchStatus',
    props: {
        status: {
            type: String,
            default: '0'
        },
        role: {
            type: String,
            default: ''
        },
        request: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            tmp_status: '0'
        }
    },
    watch: {
        'status': {
            handler(val) {
                this.tmp_status = val
            },
            immediate: true
        }
    },
    mounted() {},
    methods: {
        enableClick() {
            this.$service(this.request.method, this.request.api, this.request.params).then(res => {
                if (this.status === '1') {
                    // this.$message.success('启用成功')
                    this.$message.warning('停用成功')
                } else {
                    this.$message.success('启用成功')
                }
                this.$emit('updateTable')
            }).catch(() => {
                // 对于异常情况下进行恢复默认值
                if (this.status === '1') {
                    this.tmp_status = '1'
                } else {
                    this.tmp_status = '0'
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
