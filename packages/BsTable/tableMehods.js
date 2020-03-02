/*  element-ui自身 提供的Table Methods */
const METHOD_NAMES = [
  "clearSelection",
  "toggleRowSelection",
  "toggleRowExpansion",
  "toggleAllSelection",
  "setCurrentRow",
  "clearSort",
  "clearFilter",
  "doLayout",
  "sort"
];

const methods = {};

METHOD_NAMES.forEach(name => {
  // 使用过程获取当前this.$refs方法，进行调用传参
  methods[name] = function(...args) {
    const { BsTable } = this.$refs;
    if (BsTable && BsTable[name]) {
      BsTable[name](...args);
    }
  };
});
export default methods;
