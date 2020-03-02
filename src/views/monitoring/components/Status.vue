<template>
    <div>
        <el-tag :type="type()">{{ value() }}</el-tag>
    </div>
</template>

<script>
    /**
     * @author <qichuang@vtstar.net>
     * @fileoverview 设备状态组件
     */
    export default {
        props: {
            status: {
                type: String,
                default: null
            }
        },
        mounted () {
        },
        methods: {
            type () {
                switch (this.status) {
                    case 'NOT_SCHEDULED':
                        return 'info';
                    case 'NOT_ISSUED':
                        return 'info';
                    case 'PRODUCING':
                        return 'warning';
                    case 'ISSUED':
                        return '';
                    case 'FINISHED':
                        return 'success';
                    case 'SUSPEND':
                        return 'danger';
                    default:
                        return 'danger'
                }
            },
            value () {
                switch (this.status) {
                    case 'NOT_SCHEDULED':
                        return '未排产';
                    case 'NOT_ISSUED':
                        return '未下发';
                    case 'PRODUCING':
                        return '进行中';
                    case 'ISSUED':
                        return '已下发';
                    case 'FINISHED':
                        return '已完成';
                    case 'SUSPEND':
                        return '暂停';
                    default:
                        return '-'
                }
            }
        }
    }
</script>
