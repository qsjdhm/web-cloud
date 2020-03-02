<template>
    <div
        :class="{'has-logo':showLogo}"
    >
        <logo
            v-if="showLogo"
            :collapse="isCollapse"
        />
        <!-- 修改侧边栏文字颜色 -->
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="isCollapse ? '#3365b3' : variables.menuBg"
                :text-color="isCollapse ? '#ffffff' : variables.menuText"
                :unique-opened="true"
                :active-text-color="isCollapse ? '#3365b3' : variables.menuActiveText"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="route in permission_routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
        <!--<div-->
        <!--    v-if="!isCollapse"-->
        <!--    class="bg-logo-pack"-->
        <!--/>-->
        <!--<div class="power-by text-center">山东万腾提供技术支持</div>-->
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
    components: {SidebarItem, Logo},
    computed: {
        ...mapGetters([
            'permission_routes',
            'sidebar'
        ]),
        activeMenu() {
            const route = this.$route
            const {meta, path} = route
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    }
}
</script>
<style lang="scss">
    .menu-left{
        .el-menu--popup .nest-menu a li:hover{
            color: #3365bc!important;
        }
    }
    /* lizhiming 强信修改版 */
    .hideSidebar{
        .sidebar-container.has-logo .el-scrollbar{
            background: #3365bc;
        }
        .is-active {
            background-image: linear-gradient(-225deg, #fff 100%, #fff 100%)!important;
            .el-tooltip svg{
                color: #3365b3!important;
            }
        }
        .menu-wrapper .is-active .el-submenu__title{
            background-image: linear-gradient(-225deg, #fff 0%, #f3f3f3 100%);
            svg{
                color: #3365b3!important;
            }
        }
        .el-submenu__title{
            color: red!important;
        }
        .submenu-title-noDropdown:hover svg{
            color: #3365b3 !important;
        }
        .el-submenu__title:hover svg{
            color: #3365b3 !important;
        }
    }
    .power-by {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        background-color: #2C579A;
        color: #E2E9F1;
        text-align: center;
    }

    .bg-logo-pack {
        width: 210px;
        height: 204px;
        background: url('../../../assets/sidebar/sidebar_bg.png') no-repeat;
        background-size: 100% 100%;
        position: fixed;
        bottom: 100px;
        z-index: -1;
    }

    /*==================== 迁移sidebar.scss文件 start ====================*/
    .main-container {
        min-height: 100%;
        transition: margin-left .28s;
        margin-left: $sideBarWidth;
        position: relative;
    }

    .sidebar-container {
        transition: width 0.28s;
        width: $sideBarWidth !important;
        /* todo 背景颜色重置 */
        background-color: $menuBgReset;
        height: 100%;
        position: fixed;
        font-size: 0px;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);

        // reset element-ui css
        .horizontal-collapse-transition {
            transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
        }

        // 阴影设置位置
        .scrollbar-wrapper {
            padding-top: 16px;
            overflow-x: hidden !important;
            /*box-shadow: 2px 15px 8px -13px rgba(29, 58, 102, 0.08) inset;*/
        }

        .el-scrollbar__bar.is-vertical {
            right: 0px;
        }

        .el-scrollbar {
            height: 100%;
        }

        &.has-logo {
            .el-scrollbar {
                /*height: calc(100% - 100px);*/
                height: 100%;
            }
        }

        .is-horizontal {
            display: none;
        }

        a {
            display: inline-block;
            width: 100%;
            overflow: hidden;
        }

        .svg-icon {
            margin-right: 16px;
        }

        .el-menu {
            border: none;
            height: 100%;
            width: 100% !important;
        }

        // menu hover
        .submenu-title-noDropdown,
        .el-submenu__title {
            &:hover {
                background-color: $menuHover !important;
            }
        }

        /* sidebar:菜单激活选中颜色修改 */
        /* todo 设置 menu submenu 两种背景颜色 */
        a > .is-active {
            color: #ffffff !important;
            /* background-image: linear-gradient(-225deg, #fff 0%, #f3f3f3 100%);*/
            /* 这里修改，目前背景颜色只能使用 background-image */
            background-image: linear-gradient(-225deg, #3365b3 100%, #3365b3 100%);
        }

        .is-active svg {
            color: #ffffff !important;
        }

        .el-submenu__title svg {
            color: #3365b3 !important;
        }

        .is-active > .el-submenu__title {
            color: $subMenuActiveText !important;
        }

        & .nest-menu .el-submenu > .el-submenu__title,
        & .el-submenu .el-menu-item {
            min-width: $sideBarWidth !important;
            background-color: $subMenuBg !important;

            &:hover {
                background-color: $subMenuHover !important;
            }
        }
    }

    .hideSidebar {
        .sidebar-container {
            width: 50px !important;
        }

        .main-container {
            margin-left: 54px;
        }

        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;

            .el-tooltip {
                padding: 0 !important;

                .svg-icon {
                    margin-left: 20px;
                }
            }
        }

        .el-submenu {
            overflow: hidden;

            & > .el-submenu__title {
                padding: 0 !important;

                .svg-icon {
                    margin-left: 20px;
                }

                .el-submenu__icon-arrow {
                    display: none;
                }
            }
        }

        .el-menu--collapse {
            /* lizhiming 收起状态下svg图标margin修改*/
            .menu-wrapper {
                a {
                    .el-menu-item {
                        .el-tooltip {
                            .svg-icon {
                                margin-left: 6px !important;
                            }
                        }
                    }
                }

                li {
                    .el-submenu__title {
                        .svg-icon {
                            margin-left: 6px !important;
                        }
                    }
                }
            }

            .el-submenu {
                & > .el-submenu__title {
                    & > span {
                        height: 0;
                        width: 0;
                        overflow: hidden;
                        visibility: hidden;
                        display: inline-block;
                    }
                }
            }
        }
    }

    .el-menu--collapse .el-menu .el-submenu {
        min-width: $sideBarWidth !important;
    }

    // mobile responsive
    .mobile {
        .main-container {
            margin-left: 0px;
        }

        .sidebar-container {
            transition: transform .28s;
            width: $sideBarWidth !important;
        }

        &.hideSidebar {
            .sidebar-container {
                pointer-events: none;
                transition-duration: 0.3s;
                transform: translate3d(-$sideBarWidth, 0, 0);
            }
        }
    }

    .withoutAnimation {

        .main-container,
        .sidebar-container {
            transition: none;
        }
    }

    // when menu collapsed
    .el-menu--vertical {
        & > .el-menu {
            .svg-icon {
                margin-right: 16px;
            }
        }

        /* lizhiming 收起状态下悬浮submenu is-active样式修改 */
        & .el-menu {
            .menu-wrapper {
                a {
                    li.is-active {
                        background-color: $sideBarItemActiveBg !important;
                    }
                }
            }
        }

        .nest-menu .el-submenu > .el-submenu__title,
        .el-menu-item {
            &:hover {
                // you can use $subMenuHover
                background-color: $menuHover !important;
            }
        }

        // the scroll bar appears when the subMenu is too long
        > .el-menu--popup {
            max-height: 100vh;
            overflow-y: auto;

            &::-webkit-scrollbar-track-piece {
                background: #d3dce6;
            }

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-thumb {
                background: #99a9bf;
                border-radius: 20px;
            }
        }
    }

    /*==================== 迁移sidebar.scss文件 end ====================*/
</style>
