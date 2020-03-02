/*  element-ui自身 提供的Table Methods */
const METHOD_NAMES = [
    'searchClick',
    'searchData',
    'reset',
    'resetClick'
]

const methods = {}

METHOD_NAMES.forEach(name => {
    // 使用过程获取当前this.$refs方法，进行调用传参
    methods[name] = function(...args) {
        const { VtSearch } = this.$refs
        if (VtSearch && VtSearch[name]) {
            VtSearch[name](...args)
        }
    }
})
export default methods
