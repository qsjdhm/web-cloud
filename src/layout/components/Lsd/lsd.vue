<template>
    <div class="lsd-layout-page">
        <router-view />
    </div>
</template>

<script>

    export default {
        name: 'LSDLayout',
        data () {
            return {
            }
        },
        computed: {
        },
        mounted () {
            console.info('------------------------');
        },
        methods: {
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .lsd-layout-page {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
