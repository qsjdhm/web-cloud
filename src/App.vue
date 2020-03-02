<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import mediaQuery from '@/utils/media-query'
export default {
    name: 'App',
    mounted() {
        // 初始话获取当前窗口大小，获取窗口类型
        mediaQuery(this.mediaQueryCallback)
    },
    methods:{
        mediaQueryCallback(res) {
            this.$store.dispatch('mediaQuery/setMedia', res)
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/.el-picker-panel {
    left: 1386px !important;
}
/deep/ .v-modal {
    z-index: 2 !important;
}
</style>
