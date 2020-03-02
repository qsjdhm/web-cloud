/*
 * 进行挂载全局方法
 * */
// const install = function () {
//     Object.keys(common).forEach(key => {
//         Vue.prototype['$' + key] = common[key];
//     })
// }
import Vue from 'vue'
import moment from 'moment'
import service from '@/utils/service'
import fetch from '@/utils/fetch'
import {has} from '@/utils/permission'
import globalVariable from '@/utils/globalVariable'
import formValidator from '@/utils/formValidator/index' //表单校验
import {
    sleep,
    clearObject,
    isEmpty
} from '@/utils/index'
import { back } from '@/utils'

const install = function() {
    Vue.prototype.$sleep = sleep
    Vue.prototype.$clearObject = clearObject
    Vue.prototype.$isEmpty = isEmpty
    Vue.prototype.$moment = moment
    Vue.prototype.$service = service
    Vue.prototype.$fetch = fetch
    Vue.prototype.$has = has
    Vue.prototype.$global = globalVariable
    Vue.prototype.$back = back
    Vue.prototype.formValidator = formValidator //表单校验
}
export default install
