// 以下是注册组件的方法
import Vue from 'vue'
import VtPage from './index'

const install = function(Vue) {
    Vue.component(VtPage.name, VtPage)
}

if (window.Vue) {
    window.VtPage = VtPage
    Vue.use(install) // eslint-disable-line
}

VtPage.install = install
export default VtPage
