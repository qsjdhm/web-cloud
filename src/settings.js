module.exports = {
    title: 'vtcloud管理系统',
    /**
     * @type {boolean} true | false
     * @description 不需要登陆，就可以进行本地开发，使用本地路由表
     */
    freeLogin: true,
    /**
     * @type {boolean} true | false
     * @description 是否显示中英文切换问题
     */
    langSelect: true,
    /**
     * @type {boolean} true | false
     * @description Whether show the settings right-panel只有在开发模式进行显示
     */
    showSettings: process.env.NODE_ENV === 'development',
    /**
     * @type {boolean} true | false
     * @description navbar开发模式
     */
    navBarMode: false,

    /**
     * @type {boolean} true | false
     * @description Whether need tagsView
     */
    tagsView: false,

    /**
     * @type {boolean} true | false
     * @description Whether fix the header
     */
    fixedHeader: true,

    /**
     * @type {boolean} true | false
     * @description Whether show the logo in sidebar
     */
    sidebarLogo: true,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production'
}
