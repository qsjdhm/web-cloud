// 导入组件
import TagsView2 from './src/TagsView2.vue'

// 为组件提供 install 安装方法，供按需引入
TagsView2.install = function (Vue) {
  Vue.component(TagsView2.name, TagsView2)
}

// 默认导出组件
export default TagsView2
