import Vue from 'vue'
import { getBtnList } from '@/utils/permission'
/* 权限验证指令 */
const has = {
    inserted(el, binding, vnode) {
        let permissionBtnList = getBtnList()
        try {
            let path = vnode.context.$route.path
            if (!permissionBtnList || !permissionBtnList.includes(`${path}/${binding.value.role}`)) {
                el.parentNode.removeChild(el)
            }
        } catch (error) {
            console.log(`btnPermission.js===>${error}`)
        }
    }
}
/**权限指令**/
const install = function(Vue) {
    Vue.directive('has', has)
}

if (window.Vue) {
    window.has = has
    Vue.use(install) // eslint-disable-line
}

has.install = install
export default has

