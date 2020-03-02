<template>
    <section class="app-main">
        <transition
            name="fade-transform"
            mode="out-in"
        >
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        computed: {
            cachedViews() {
                return this.$store.state.tagsView.cachedViews
            },
            key() {
                return this.$route.path
            }
        }
    }
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    /*min-height: calc(100vh - 50px);*/
    min-height: 100vh;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    // background: #f0f2f5;
    background-color: #f3f6fe;
}

.fixed-header + .app-main {
    /* lizhiming 原值为60px */
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        /*min-height: calc(100vh - 84px);*/
        min-height: 100vh;
    }

    .fixed-header + .app-main {
        padding-top: 94px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}

/* 高度限制问题 */
.hasTagsView .oneScreen {
    height: calc(100vh - 94px);
}

.oneScreen {
    height: calc(100vh - 60px);
}
</style>
