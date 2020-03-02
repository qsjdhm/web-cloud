<!-- 侧边栏上方logo -->
<template>
    <div
        class="sidebar-logo-container"
        :class="{'collapse':collapse}"
    >
        <transition name="sidebarLogoFade">
            <router-link
                v-if="collapse"
                key="collapse"
                class="sidebar-logo-link"
                to="/"
            >
                <img
                    v-if="logo"
                    :src="collapseLogo"
                    class="sidebar-collapse-logo"
                >
                <h1
                    v-else
                    class="sidebar-title"
                >{{ title }} </h1>
            </router-link>
            <router-link
                v-else
                key="expand"
                class="sidebar-logo-link"
                to="/"
            >
                <img
                    v-if="logo"
                    :src="logo"
                    class="sidebar-logo"
                >
            </router-link>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'SidebarLogo',
        props: {
            collapse: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                title: '强信设备管理系统',
                logo: require('@/assets/sidebar/sidebar_log.png'),
                collapseLogo: require('@/assets/sidebar/sidebar_collapse_logo.png')
            }
        }
    }
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 52px;
    background: $menuBg;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    /* lizhiming 更改logo垂直居中显示 */
    & .sidebar-logo-link {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        /* lizhiming 收缩状态下logo样式 */
        & .sidebar-collapse-logo {
            width: 39px;
            height: 20px;
        }
        /* lizhiming 展开状态下logo样式 */
        & .sidebar-logo {
            width: 100%;
            height: 100%;
            transform: scale(1);
        }

    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}
</style>
