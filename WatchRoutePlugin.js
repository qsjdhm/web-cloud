/**
 * @description 监听本地路由改变，进行更新本地路由表
 * @Webpack打包改造--插入自定义内容 https://juejin.im/post/5df4a220f265da33de3a74b0
 * @官网 https://webpack.js.org/api/compiler-hooks/#root
 */
const path = require('path')
function resolve(dir = '') {
    return path.join(__dirname, dir)
}
class WatchRoutePlugin {

    constructor(doneCallback, failCallback,options) {
        // 存下在构造函数中传入的回调函数
        this.doneCallback = doneCallback
        this.failCallback = failCallback
        this.options = options
        this.WATCH_ROUTER = false
    }

    apply(compiler) {
        const pluginName = 'WatchRoutePlugin';
        /**
         * 监听运行
         */
        compiler.hooks.watchRun.tap(pluginName, (watch) => {
            // 获取发生变化的文件列表
            const changedFiles = watch.watchFileSystem.watcher.mtimes
            let changeFiles = Object.keys(changedFiles)
            this.WATCH_ROUTER = changeFiles.some((item) => item.includes('src\\router'));
        })
        /**
         * 编译成功后处理
         */
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(pluginName, (htmlPluginData) => {
                const injectStr = this.getInjectContent();
                htmlPluginData.html = htmlPluginData.html.replace('<!-- built files will be auto injected -->', injectStr)
            })
        })
        compiler.hooks.done.tap(pluginName, (stats) => {
            console.log('\x1B[32m%s\x1B[0m', `${resolve('')}`)
        })
    }
    /** 生成格式化后时间截 */
    getInjectContent() {
        const injectStr = `
      <!-- built files will be auto injected -->
			<script type="text/javascript">var WATCH_ROUTER = ${this.WATCH_ROUTER}</script></html>
			`;

        return injectStr;
    }
}

// 导出插件
module.exports = WatchRoutePlugin
