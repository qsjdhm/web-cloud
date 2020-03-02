<template>
    <div
        id="tags-view-container"
        class="tags-view-container"
    >
        <scroll-pane
            ref="scrollPane"
            class="tags-view-wrapper"
        >
            <router-link
                v-for="tag in visitedViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag)?'active':''"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                tag="span"
                class="tags-view-item"
                @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
                @contextmenu.prevent.native="openMenu(tag,$event)"
            >
                {{ generateTitle(tag.title) }}
                <span
                    v-if="!isAffix(tag)"
                    class="el-icon-close"
                    @click.prevent.stop="closeSelectedTag(tag)"
                />
            </router-link>
        </scroll-pane>
        <ul
            v-show="visible"
            :style="{left:left+'px',top:top+'px'}"
            class="contextmenu"
        >
            <li @click="refreshSelectedTag(selectedTag)">{{
                $t('tagsView.refresh') }}
            </li>
            <li
                v-if="!isAffix(selectedTag)"
                @click="closeSelectedTag(selectedTag)"
            >{{ $t('tagsView.close') }}
            </li>
            <li @click="closeOthersTags">{{ $t('tagsView.closeOthers') }}</li>
            <li @click="closeAllTags(selectedTag)">{{ $t('tagsView.closeAll')
            }}
            </li>
        </ul>
    </div>
</template>

<script>
import ScrollPane from './ScrollPane';
import { generateTitle } from '@/utils/i18n';
import path from 'path';

export default {
    components: { ScrollPane },
    data() {
        return {
            visible: false,
            top: 0,
            left: 0,
            selectedTag: {},
            affixTags: []
        };
    },
    computed: {
        visitedViews() {
            // console.log(this.$store.state.tagsView.visitedViews);
            return this.$store.state.tagsView.visitedViews;
        },
        routes() {
            return this.$store.state.permission.routes;
        }
    },
    watch: {
        $route() {
            this.addTags();
            this.moveToCurrentTag();
        },
        visible(value) {
            if (value) {
                document.body.addEventListener('click', this.closeMenu);
            } else {
                document.body.removeEventListener('click', this.closeMenu);
            }
        }
    },
    mounted() {
        this.initTags();
        this.addTags();
    },
    methods: {
        generateTitle, // generateTitle by vue-i18n
        isActive(route) {
            return route.path === this.$route.path;
        },
        isAffix(tag) {
            return tag.meta && tag.meta.affix;
        },
        filterAffixTags(routes, basePath = '/') {
            let tags = [];
            routes.forEach(route => {
                if (route.meta && route.meta.affix) {
                    const tagPath = path.resolve(basePath, route.path);
                    tags.push({
                        fullPath: tagPath,
                        path: tagPath,
                        name: route.name,
                        meta: { ...route.meta }
                    });
                }
                if (route.children) {
                    const tempTags = this.filterAffixTags(
                        route.children,
                        route.path
                    );
                    if (tempTags.length >= 1) {
                        tags = [...tags, ...tempTags];
                    }
                }
            });
            return tags;
        },
        initTags() {
            const affixTags = (this.affixTags = this.filterAffixTags(
                this.routes
            ));
            for (const tag of affixTags) {
                // Must have tag name
                if (tag.name) {
                    this.$store.dispatch('tagsView/addVisitedView', tag);
                }
            }
        },
        addTags() {
            const { name } = this.$route;
            // console.log(name);
            if (name) {
                this.$store.dispatch('tagsView/addView', this.$route);
            }
            return false;
        },
        moveToCurrentTag() {
            const tags = this.$refs.tag;
            this.$nextTick(() => {
                for (const tag of tags) {
                    if (tag.to.path === this.$route.path) {
                        this.$refs.scrollPane.moveToTarget(tag);
                        // when query is different then update
                        if (tag.to.fullPath !== this.$route.fullPath) {
                            this.$store.dispatch(
                                'tagsView/updateVisitedView',
                                this.$route
                            );
                        }
                        break;
                    }
                }
            });
        },
        refreshSelectedTag(view) {
            this.$store.dispatch('tagsView/delCachedView', view).then(() => {
                const { fullPath } = view;
                this.$nextTick(() => {
                    this.$router.replace({
                        path: '/redirect' + fullPath
                    });
                });
            });
        },
        closeSelectedTag(view) {
            this.$store
                .dispatch('tagsView/delView', view)
                .then(({ visitedViews }) => {
                    if (this.isActive(view)) {
                        this.toLastView(visitedViews, view);
                    }
                });
        },
        closeOthersTags() {
            this.$router.push(this.selectedTag);
            this.$store
                .dispatch('tagsView/delOthersViews', this.selectedTag)
                .then(() => {
                    this.moveToCurrentTag();
                });
        },
        closeAllTags(view) {
            this.$store
                .dispatch('tagsView/delAllViews')
                .then(({ visitedViews }) => {
                    if (this.affixTags.some(tag => tag.path === view.path)) {
                        return;
                    }
                    this.toLastView(visitedViews, view);
                });
        },
        toLastView(visitedViews, view) {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
                this.$router.push(latestView.fullPath);
            } else {
                // now the default is to redirect to the home page if there is no tags-view,
                // you can adjust it according to your needs.
                if (view.name === 'Welcome') {
                    // to reload home page
                    this.$router.replace({ path: '/redirect' + view.fullPath });
                } else {
                    this.$router.push('/');
                }
            }
        },
        openMenu(tag, e) {
            const menuMinWidth = 105;
            const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
            const offsetWidth = this.$el.offsetWidth; // container width
            const maxLeft = offsetWidth - menuMinWidth; // left boundary
            const left = e.clientX - offsetLeft + 15; // 15: margin right

            if (left > maxLeft) {
                this.left = maxLeft;
            } else {
                this.left = left;
            }

            this.top = e.clientY;
            this.visible = true;
            this.selectedTag = tag;
        },
        closeMenu() {
            this.visible = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 100%;
    line-height: 52px;
    width: 100%;
    background: #fff;
    /* lizhiming 去掉tags-view组件下边框 */
    // border-bottom: 1px solid #e8e8e8;
    /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);*/
    .tags-view-wrapper {
        /deep/ .is-vertical {
            .el-scrollbar__thumb {
                display: none !important;
            }
        }
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 52px;
            line-height: 52px;
            color: #666666;
            background: #fff;
            padding: 0 26px;
            font-size: 14px;
            /*margin-left: 10px;*/
            /*border-radius: 3px;*/
            /*margin-top: 4px;*/

            &:first-of-type {
                margin-left: 15px;
            }

            &:last-of-type {
                margin-right: 15px;
            }

            &.active {
                /*background-color: #42b983;*/
                // background-color: #32a8fe;
                // color: #fff;
                color: #3365b3;
                // border-color: #32a8fe;
                background-color: rgba(67, 138, 254, 0.2);
                /*border-radius: 3px;*/
                border-top: solid 2px #3365b3;

                // &::before {
                //     content: '';
                //     background: #fff;
                //     display: inline-block;
                //     width: 8px;
                //     height: 8px;
                //     border-radius: 50%;
                //     position: relative;
                //     margin-right: 2px;
                // }
            }
        }
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item:hover{
        background-color: rgba(67, 138, 254, 0.2)!important;
    }
    .tags-view-item:hover .el-icon-close{
        display: block;
        color: #3365b3;
    }
    .active .el-icon-close{
        display: block!important;
    }
    .tags-view-item {
        &:after{
            content: '';
            display: inline-block;
            width: 1px;
            position: absolute;
            right: 0;
            top: 8px;
            height: 32px;
            background-color: #ebedf0;
        }
        position: relative;
        .el-icon-close {
            display: none;
            width: 16px;
            height: 16px;
            vertical-align: 1px;
            /*border-radius: 50%;*/
            text-align: center;
            position: absolute;
            top: 36%;
            right: 4px;
            /*transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);*/
            /*transform-origin: 100% 50%;*/

            &:before {
                /*transform: scale(0.6);*/
                display: inline-block;
                /*vertical-align: -3px;*/
            }

            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>
