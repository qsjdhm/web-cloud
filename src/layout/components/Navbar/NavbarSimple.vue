<template>
    <div class="navbar">
        <div class="left-pack">
            <hamburger
                id="hamburger-container"
                :is-active="sidebar.opened"
                class="hamburger-container"
                @toggleClick="toggleSideBar"
            />
            <!-- <div class="search-pack">
                <search
                    id="header-search"
                    class="right-menu-item"
                />
            </div> -->
        </div>
        <div class="middle-pack">
            <tags-view />
        </div>
        <div class="right-pack">
            <el-tooltip
                class="item"
                effect="light"
                content="全屏或结束全屏"
                placement="bottom"
            >
                <div class="full-pack">
                    <screenfull
                        id="screenfull"
                        class="right-menu-item hover-effect"
                    />
                </div>
            </el-tooltip>
            <el-tooltip
                class="item"
                effect="light"
                content="退出登录"
                placement="bottom"
            >
                <div
                    class="logout-pack"
                    @click="logout"
                >
                    <img
                        class="logout"
                        :src="require(`./images/logout.png`)"
                    >
                </div>
            </el-tooltip>
            <div class="spacer-pack">
                <p />
            </div>
            <el-dropdown @command="dropdownCommand">
                <div class="user-pack el-dropdown-link">
                    <img
                        class="logo"
                        :src="require(`./images/avatar.png`)"
                    >
                    <span>{{ username }}</span>
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="password">修改密码</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <update-password :password-dialog.sync="passwordDialog" />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Hamburger from '@/components/Hamburger'
    import Screenfull from '@/components/Screenfull'
    // import Search from './components/HeaderSearch'
    import UpdatePassword from '@/layout/components/Navbar/components/UpdatePassword'
    import TagsView from '../TagsView'


    export default {
        name: 'Navbar',
        components: {
            UpdatePassword,
            Hamburger,
            Screenfull,
            // Search,
            TagsView
        },
        data () {
            return {
                username: window.sessionStorage.getItem('Admin-Name') || '暂无',
                state: '',
                passwordDialog: false,
                timeout:  null
            }
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar',
                'device'
            ])
        },
        mounted() {
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            async logout() {
                try {
                    await this.$store.dispatch('user/logout')
                    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                } catch (error) {
                    console.log(error)
                }
            },
            dropdownCommand (command) {
                if (command === 'password') {
                    // 修改密码
                    this.passwordDialog = true
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$itemHover: #f1f1f1;
$borderColor: 1px solid #e2e2e2;
.navbar {
    width: 100%;
    height: 52px;
    overflow: hidden;
    position: relative;
    /*border-bottom: 1px solid #e8e8e8;*/
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 0;
    background-color: #fff;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    align-items: center;


    .left-pack {
        width: 50px;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        /deep/ .hamburger-container {
            line-height: 46px;
            height: 50px;
            -webkit-transition: all .3s,padding 0s;
            transition: all .3s,padding 0s;
            cursor: pointer;
            // &:hover {
            //     background: $itemHover;
            // }
        }
        .search-pack {
            position: relative;
            /deep/ .el-input__inner {
                height: 39px!important;
                line-height: 39px!important;
                border: 0px!important;
                background: #fff!important;
            }
            /deep/ .el-input__icon {
                line-height: 39px!important;
                font-size: 14px!important;
            }
        }
    }

    .middle-pack {
        height: 100%;
        flex: 1;
        overflow: hidden;
    }

    .right-pack {
        min-width: 238px;
        height: 100%;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        .cockpit-pack {
            height: 100%;
            padding: 0 17px;
            border-left: $borderColor;
            border-right: $borderColor;
            /*background-color: rgba(255, 255, 255, 0.2);*/
            display: -webkit-flex;
            display: flex;
            align-items: center;
            -webkit-transition: background .3s,padding 0s;
            transition: background .3s,padding 0s;
            &:hover {
                cursor: pointer;
                // background: $itemHover;
            }
            img {
                width: 24px;
                height: 24px;
                margin-right: 10px;
            }
            .title {
                font-size: 14px;
            }
        }
        .user-pack {
            height: 50px;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 17px;
            border-right: $borderColor;
            -webkit-transition: background .3s,padding 0s;
            transition: background .3s,padding 0s;
            &:hover {
                cursor: pointer;
                // background: $itemHover;
            }
            img {
                width: 28px;
                height: 28px;
                margin-right: 12px;
            }
            span {
                height: 28px;
                line-height: 28px;
                font-size: 12px;
                color: #bdbdbd;
                margin-right: 12px;
            }
            /* lizhiming 增加向下箭头icon */
            i {
                font-size: 12px;
                color: #bdbdbd;
                margin-top: -4px;
            }
        }
        .full-pack {
            height: 50px;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            color: #bdbdbd;
            // border-right: $borderColor;
            -webkit-transition: background .3s,padding 0s;
            transition: background .3s,padding 0s;
            &:hover {
                cursor: pointer;
                // background: $itemHover;
            }
            /deep/ .svg-icon {
                padding: 17px !important;
                width: 49px;
                height: 50px;
                margin-top: 2px;
            }
        }
        .logout-pack {
            height: 50px;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            padding: 0 17px 0 6px;
            // border-right: $borderColor;
            -webkit-transition: background .3s,padding 0s;
            transition: background .3s,padding 0s;
            &:hover {
                cursor: pointer;
                // background: $itemHover;
            }
            img {
                width: 16px;
                height: 16px;
            }
        }
        /* lizhiming 间隔线 */
        .spacer-pack {
            width: 30px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            p {
                height: 32px;
                width: 1px;
                background-color: #ebedf0;
            }
        }

    }
}

.my-autocomplete {
    li {
        line-height: normal;
        padding: 7px;

        .name {
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .addr {
            font-size: 12px;
            color: #b4b4b4;
        }

        .highlighted .addr {
            color: #ddd;
        }
    }
}
</style>
