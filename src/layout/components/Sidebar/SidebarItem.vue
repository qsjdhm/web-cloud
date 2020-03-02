<template>
    <div
        v-if="!item.hidden"
        class="menu-wrapper"
    >
        <template
            v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
        >
            <app-link
                v-if="onlyOneChild.meta"
                :to="resolvePath(onlyOneChild.path)"
            >
                <el-menu-item
                    :index="resolvePath(onlyOneChild.path)"
                    :class="{'submenu-title-noDropdown':!isNest}"
                >
                    <item
                        :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon) || 'opicate'"
                        :title="generateTitle(onlyOneChild.meta.title)"
                    />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu
            v-else
            ref="subMenu"
            :index="resolvePath(item.path)"
            popper-append-to-body
            popper-class="menu-left"
        >
            <template slot="title">
                <item
                    v-if="item.meta"
                    :icon="item.meta && item.meta.icon || 'opicate'"
                    :title="generateTitle(item.meta.title)"
                />
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import variables from '@/styles/variables.scss'

export default {
    name: 'SidebarItem',
    components: { Item, AppLink },
    mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data() {
        // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
        // TODO: refactor with render function
        this.onlyOneChild = null
        return {}
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item
                    return true
                }
            })

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = {
                    ...parent,
                    path: '',
                    noShowingChildren: true
                }
                return true
            }

            return false
        },
        resolvePath(routePath) {
            if (isExternal(routePath)) {
                return routePath
            }
            if (isExternal(this.basePath)) {
                return this.basePath
            }
            return path.resolve(this.basePath, routePath)
        },

        generateTitle
    }
}
</script>
<style lang="scss" scoped>
// svg和title距离
.hideSidebar{
    .submenu-title-noDropdown svg, .el-submenu__title svg{
        color: #fff!important;
    }
}
.menu-wrapper {
    margin: 0 11px 11px 10px;
    border-radius: 4px;
    overflow: hidden;
    & /deep/ .submenu-title-noDropdown svg, .el-submenu__title svg {
        width: 18px;
        margin-right: 20px !important;
        font-size: 14px;
        position: relative;
        color: #3365b3; // 修改
    }
    /* lizhiming 修改一级、二级、三级菜单栏文字大小及文字间隔*/
    & /deep/ .submenu-title-noDropdown span, .el-submenu__title span, .el-menu-item span {
        font-size: 14px;
        letter-spacing: 2px;
    }
    /* lizhiming 修改二级、三级菜单栏右侧小箭头*/
    & /deep/ .el-submenu__title i {
        color: $menuText;
    }

    /* lizhiming 修改二级菜单与父级对齐*/
    /deep/ .el-submenu {
        .el-menu {
            .menu-wrapper  {
                a {
                    .el-menu-item {
                        padding-left: 18px !important;
                        .el-tooltip {
                            background-color:red;
                        }
                    }
                }
                li.el-submenu {
                    .el-submenu__title {
                        padding-left: 12px  !important;
                        min-width: 192px !important;
                    }
                    ul.el-menu {
                        .menu-wrapper {
                            a {
                                .el-menu-item {
                                    padding-left: 20px !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// 菜单高度
/deep/ .el-menu-item, /deep/ .el-submenu__title {
    height: 30px !important;
    line-height: 30px !important;
    font-size: 14px;
}
</style>
