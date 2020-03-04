import TagsView from './TagsView/lib'

const components = [
    TagsView
]

export default {
    install(Vue) {
        components.map(component => {
            Vue.component(component.name, component)
        })
    }
}
