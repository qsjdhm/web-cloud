/* 基础组件 */
import { VtTable } from '@vt/VtTable/index'
import { VtSearch } from '@vt/VtSearch/index'


/* 复合组件 */
import { BsTable } from '@vt/BsTable'


const components = [
    VtTable,
    VtSearch,
    BsTable
]

export default {
    install(Vue) {
        components.map(component => {
            Vue.component(component.name, component)
        })
    }
}
