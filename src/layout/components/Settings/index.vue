<template>
    <div class="drawer-container">
        <div>
            <h3 class="drawer-title">{{ $t('settings.title') }}</h3>

            <div class="drawer-item">
                <span>{{ $t('settings.theme') }}</span>
                <theme-picker
                    style="float: right;height: 26px;margin: -3px 8px 0 0;"
                    @change="themeChange"
                />
            </div>

            <div class="drawer-item">
                <span>{{ $t('settings.tagsView') }}</span>
                <el-switch
                    v-model="tagsView"
                    class="drawer-switch"
                />
            </div>

            <div class="drawer-item">
                <span>{{ $t('settings.fixedHeader') }}</span>
                <el-switch
                    v-model="fixedHeader"
                    class="drawer-switch"
                />
            </div>

            <div class="drawer-item">
                <span>{{ $t('settings.sidebarLogo') }}</span>
                <el-switch
                    v-model="sidebarLogo"
                    class="drawer-switch"
                />
            </div>
            <div class="drawer-item">
                <span>{{ $t('settings.langSelect') }}</span>
                <el-switch
                    v-model="langSelect"
                    class="drawer-switch"
                />
            </div>
            <div class="drawer-item">
                <span>{{ $t('settings.navBarMode') }}</span>
                <el-switch
                    v-model="navBarMode"
                    class="drawer-switch"
                />
            </div>
            <el-button
                size="small"
                type="primary"
                @click="updatePermissions()"
            >更新权限表</el-button>
            <div class="drawer-item">
                <el-input
                    v-model="inputData"
                    :readonly="true"
                />
                <el-button
                    v-clipboard:copy="inputData"
                    style="margin-top: 10px"
                    type="primary"
                    size="mini"
                >
                    copy token
                </el-button>
            </div>
            <a
                v-if="isShowJob"
                href="https://panjiachen.github.io/vue-element-admin-site/zh/job/"
                target="_blank"
                class="job-link"
            >
                <el-alert
                    title="系统布局高级功能正在努力开发中."
                    type="success"
                    :closable="false"
                />
            </a>

        </div>
    </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import getRoutes from '@/utils/generateRouter'
export default {
    components: { ThemePicker },
    data() {
        return {
            inputData: window.sessionStorage.getItem('Admin-Token') || '暂无'
        }
    },
    computed: {
        isShowJob() {
            return this.$store.getters.language === 'zh'
        },
        fixedHeader: {
            get() {
                return this.$store.state.settings.fixedHeader
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'fixedHeader',
                    value: val
                })
            }
        },
        tagsView: {
            get() {
                return this.$store.state.settings.tagsView
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'tagsView',
                    value: val
                })
            }
        },
        sidebarLogo: {
            get() {
                return this.$store.state.settings.sidebarLogo
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'sidebarLogo',
                    value: val
                })
            }
        },
        langSelect: {
            get() {
                return this.$store.state.settings.langSelect
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'langSelect',
                    value: val
                })
            }
        },
        navBarMode: {
            get() {
                return this.$store.state.settings.navBarMode
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'navBarMode',
                    value: val
                })
            }
        }
    },
    methods: {
        themeChange(val) {
            this.$store.dispatch('settings/changeSetting', {
                key: 'theme',
                value: val
            })
        },
        async updatePermissions () {
            let routerList = getRoutes()
            // await this.$service('post', '/SERVICE-SYSTEM/api/v1/resource/list', routerList)      // 向后台发送当前权限表
            let authorityList = await this.$service('get', '/SERVICE-SYSTEM/api/v1/user/resource/list')        // 获取重新获取权限列表存放于本地
            window.sessionStorage.setItem('Admin-Authority', JSON.stringify(authorityList))
            window.location.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
.drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
        margin-bottom: 12px;
        color: rgba(0, 0, 0, .85);
        font-size: 14px;
        line-height: 22px;
    }

    .drawer-item {
        color: rgba(0, 0, 0, .65);
        font-size: 14px;
        padding: 12px 0;
    }

    .drawer-switch {
        float: right
    }

    .job-link {
        display: block;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
    }
}
</style>
