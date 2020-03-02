<template>
    <div class="login-pack">
        <div class="left-bg-pack" />
        <div class="right-pack">
            <div class="content">
                <div class="title">
                    <span>欢迎登录</span>
                    <span>强信机械设备管理系统</span>
                </div>
                <div class="user-name">
                    <el-input
                        v-model="username"
                        name="userName"
                        style="background-color: #ffffff; color: #222;"
                        placeholder="请输入用户名"
                        @keyup.enter.native="loginClick()"
                    >
                        <template slot="prepend">
                            <svg-icon icon-class="login_username" />
                        </template>
                    </el-input>
                </div>
                <div class="pass-word">
                    <el-input
                        v-model="password"
                        name="password"
                        show-password
                        type="password"
                        placeholder="请输入密码"
                        style="background-color: #ffffff; color: #222;"
                        @keyup.enter.native="loginClick()"
                    >
                        <template slot="prepend">
                            <svg-icon icon-class="login_password" />
                        </template>
                    </el-input>
                </div>
                <div class="login-btn">
                    <el-button
                        v-if="loading"
                        disabled
                        :loading="true"
                    >
                        登录中
                    </el-button>
                    <el-button
                        v-else
                        @click="loginClick()"
                    >
                        登录
                    </el-button>
                </div>
            </div>
            <div class="version-pack">
                <span>version 1.2.9 山东万腾提供技术支持</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            code: '',
            language: true,
            loading: false,
            redirect: undefined,
            otherQuery: {}
        };
    },
    watch: {
        $route: {
            handler: function(route) {
                const query = route.query;
                if (query) {
                    this.redirect = query.redirect;
                    this.otherQuery = this.getOtherQuery(query);
                }
            },
            immediate: true
        }
    },
    created() {
        // window.sessionStorage.clear()
    },
    beforeMount() {
        // !判断浏览器内核
        // let userAgent = navigator.userAgent
        // if (userAgent.indexOf('Trident') !== -1 || userAgent.indexOf('MSIE') !== -1) {
        //     if (confirm('为了您更良好的产品体验, 请使用谷歌浏览器或使用兼容模式打开')) {
        //         window.opener = null
        //         window.open('https://www.google.cn/chrome/', '_self')
        //     } else {
        //         window.opener = null
        //         window.open('', '_self')
        //         window.close()
        //     }
        // }
    },
    async mounted() {
        /* 开发环境进行的登录设置 */
        this.$nextTick(() => {
            if (process.env.NODE_ENV === 'development') {
                let params = {
                    username: '',
                    password: ''
                };
                // this.loginClick(params)
            }
        });
    },
    methods: {
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        },
        async loginClick(value) {
            try {
                let params = {
                    username: this.username,
                    password: this.password
                };
                if (value) {
                    params = value;
                }
                this.loading = true;
                // 1、 获取登录返回的详细信息
                let response = await this.$service(
                    'POST',
                    '/proxy/login',
                    params
                );
                // let response = await this.$service('POST', 'simulation/login', params)
                // 2、根据信息将将accessToken、refreshToken、过期时间存储
                window.sessionStorage.setItem(
                    'Admin-Token',
                    `Bearer ${response.accessToken}`
                );
                window.sessionStorage.setItem(
                    'Admin-RefreshToken',
                    response.refreshToken
                );
                window.sessionStorage.setItem(
                    'Admin-ExpiresIn',
                    response.expiresIn * 1000 + new Date().getTime()
                );
                // 3、获取用户信息
                let userInfo = await this.$service(
                    'GET',
                    '/SERVICE-SYSTEM/api/v1/user'
                );
                // 4、查询当前用户可访问的菜单和按钮资源
                let authorityList = await this.$service(
                    'GET',
                    '/SERVICE-SYSTEM/api/v1/user/resource/list'
                );
                // 2.将获取的用户的信息和权限列表存放在session中
                window.sessionStorage.setItem(
                    'Admin-Username',
                    userInfo.username
                );
                window.sessionStorage.setItem('Admin-Name', userInfo.name);
                window.sessionStorage.setItem(
                    'Admin-Authority',
                    JSON.stringify(authorityList)
                );
                /*
                 * 1. 查看当前剩余时间是否大于0，做一个延迟触发
                 * 2. 再次循环的时候进行定时循环触发
                 * 3. 请求消耗时间，这里 减去10秒
                 * */
                if (
                    response.expiresIn &&
                    response.expiresIn * 1000 - 10 * 1000 > 0 &&
                    response.expiresIn < 60 * 60 * 60 * 9
                ) {
                    setTimeout(async () => {
                        let refreshRes = await this.refreshToken();
                        if (refreshRes.expiresIn) {
                            setInterval(() => {
                                this.refreshToken();
                            }, refreshRes.expiresIn * 1000 - 10 * 1000);
                        }
                    }, response.expiresIn * 1000 - 10 * 1000);
                }
                // 跳转页面
                // 是否有权限登录
                let flag = false;
                if (this.redirect) {
                    let AuthorityList = JSON.parse(
                        window.sessionStorage.getItem('Admin-Authority')
                    );
                    AuthorityList.map(item => {
                        if (item.url === this.redirect.split('?')[0]) {
                            flag = true;
                        }
                        if (item.children && item.children.length > 0) {
                            item.children.map(childrenItem => {
                                if (
                                    childrenItem.url ===
                                    this.redirect.split('?')[0]
                                ) {
                                    flag = true;
                                }
                            });
                        }
                    });
                }
                if (flag) {
                    this.$router.push({
                        path: this.redirect || '/',
                        query: this.otherQuery
                    });
                } else {
                    this.$router.push({ path: '/' });
                }
                this.loading = false;
            } catch {
                this.loading = false;
            }
        },
        async refreshToken() {
            return new Promise(async (resolve, reject) => {
                let refreshRes = await this.$store.dispatch(
                    'User/getTokenByRefresh',
                    {
                        refreshToken: window.sessionStorage.getItem(
                            'Admin-RefreshToken'
                        )
                    }
                );
                window.sessionStorage.setItem(
                    'Admin-Token',
                    `Bearer ${refreshRes.accessToken}`
                );
                window.sessionStorage.setItem(
                    'Admin-RefreshToken',
                    refreshRes.refreshToken
                );
                resolve(refreshRes);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
/* 更改光标颜色 骚操作 https://blog.csdn.net/weixin_41229588/article/details/90929429 */
/* todo 图片加载缓慢优化 */

.login-pack {
    width: 100%;
    height: 100%;
    .left-bg-pack {
        width: 65%;
        height: 100%;
        float: left;
        background: url('../../assets/login/bg_left.png');
        background-size: cover;
        background-repeat: no-repeat;
    }
    .right-pack {
        float: left;
        width: 35%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .content {
            height: 400px;
            width: 280px;
            .title {
                height: 100px;
                width: 100%;
                color: #352885;
                span {
                    letter-spacing: 3px;
                    display: block;
                    height: 50px;
                    line-height: 50px;
                    text-align: left;
                    font-size: 25px;
                    font-weight: 600;
                }
            }
            .user-name {
                margin-top: 50px;
                height: 45px;
                line-height: 45px;
                width: 100%;
                border-radius: 70px;
                border: 1.5px solid #352885;
                overflow: hidden;
                /deep/ .el-input-group__prepend {
                    border-radius: 70px 0 0 70px;
                    background-color: #ffffff;
                    border: 0;
                    padding: 0 20px !important;
                    font-size: 26px;
                    color: #352885;
                }
                /deep/ .el-input__inner {
                    background-color: #ffffff !important;
                }
            }
            .pass-word {
                margin-top: 25px;
                height: 45px;
                line-height: 45px;
                width: 100%;
                border-radius: 30px;
                border: 1.5px solid #352885;
                overflow: hidden;
                /deep/ .el-input-group__prepend {
                    border-radius: 70px 0 0 70px;
                    background-color: #ffffff;
                    border: 0;
                    padding: 0 20px !important;
                    font-size: 26px;
                    color: #352885;
                }
                /deep/.el-input__inner {
                    background-color: #ffffff !important;
                }
            }
            .login-btn {
                height: 45px;
                width: 100%;
                margin-top: 50px;
                /deep/ .el-button {
                    height: 45px;
                    width: 100%;
                    border-radius: 70px;
                    border: 0;
                    color: white;
                    font-size: 20px;
                    background-color: #352885;
                    .el-input__inner {
                        background-color: #ffffff !important;
                    }
                }
            }
        }
        .version-pack {
            position: fixed;
            bottom: 0;
            height: 40px;
            text-align: center;
            line-height: 40px;
            bottom: 0px;
            font-size: 12px;
            color: rgb(194, 198, 214);
        }
    }
    /deep/ .el-input__inner {
        border-radius: 70px;
        border: 0;
        padding-left: 0;
    }
    .el-input__inner::-webkit-input-placeholder {
        color: #d3d3d3;
    }
}
</style>
