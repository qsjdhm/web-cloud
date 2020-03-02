import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization

/* =================== icon图标 iconfont 字体库：https://www.iconfont.cn/ start=================== */
import './icons' // icon
import './assets/iconfont/iconfont.css'
import './assets/fonts/font.scss'
/* =================== iconfont 字体 end=================== */

import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import has from '@/directive/permission' //页面按钮权限
import dragDialog from '@/directive/drag-dialog' //页面按钮权限
import waves from '@/directive/waves' //页面按钮权限
import clipboard from '@/directive/clipboard' //页面按钮权限
import Page from '@/layout/components/Page/page' // 是否全屏
import install from '@/install'
import ui from '@/ui'

import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'

Vue.use(VueDirectiveImagePreviewer, {
    background: {     // or : background: '#000'
        color: '#000' // or rgba or rgb     // or image: 'url(xxx)'
    },
    // transition
    animate: {
        duration: 600,
        delay: 0
    },
    zIndex: 11,
    // cursor(css)
    cursor: 'pointer'
})
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

Vue.use(install)
Vue.use(waves)
Vue.use(clipboard)
Vue.use(Page)
Vue.use(has)
Vue.use(dragDialog)
Vue.use(ui)
Vue.use(Element, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
