/*  element-ui自身 提供的Table Methods */
const METHOD_NAMES = [
    // VtSearch,搜索组件
    "resetClick",
    // VtTable，表格组件
    "clearSelection",
    "toggleRowSelection",
    "toggleRowExpansion",
    "toggleAllSelection",
    "setCurrentRow",
    "clearSort",
    "clearFilter",
    "doLayout",
    "sort",
];

const methods = {};

METHOD_NAMES.forEach(name => {
    // 使用过程获取当前this.$refs方法，进行调用传参
    methods[name] = function (...args) {
        const {VtTable,VtSearch} = this.$refs;
        if (VtTable && VtTable[name]) {
            VtTable[name](...args);
        }
        if (VtSearch && VtSearch[name]) {
            VtSearch[name](...args);
        }
    };
});
export default methods;
