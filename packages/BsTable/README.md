# 数据列表组件

### 组件内容

* [功能组件表格](../VtTable)
* [功能组件搜索](../VtSearch)

* 通过版本号，进行colstorage。目前后端不支持，对比进行配置；登录时候进行判断是否清空colstorage

### FAQ

#### 表格高度如何做到自适应？

1. flex 布局，table高度受外部高度决定
2. 高度没有自适应，通过overflow: hidden;具体实现逻辑，参考[强信]()


#### 表格中边框错位？

1. 通过`<el-table>`默认提供方法dolayout方法
2. 通过通过给`<el-table>`的`v-if`让组件重新渲染

#### 固定列后，底部滚动条不能横向滚动？

`<el-table>`添加`max-height`属性

<!--:::tip-->
<!--* 默认触发方法就，有默认 searchClick-->
<!--* 搜索默认执行（trigger：false 是否组件加载后就触发） :::-->

### methods方法


### 字段说明
> 由于表格字段嵌套成绩过多，文档形式采用table不方便阅读
```js
let bsData= {
    searchConfig: {
        initTrigger: true,
        fields: [
            {
                label: '设备编号',
                type: 'INPUT',
                value: '0',
                key: 'equipmentNo',
                placeholder: '请输入设备编号'
            },
            {
                label: '派工单ID',
                type: 'INPUT',
                key: 'workingOrderNo',
                placeholder: '请输入派工单ID'
            },
            {
                label: '工序名称',
                type: 'INPUT',
                key: 'processStepName',
                placeholder: '请输入工序名称'
            },
            {
                label: 'NC程序名称',
                type: 'INPUT',
                key: 'programName',
                placeholder: '请输入NC程序名称'
            }
        ]
    },
    tableConfig: {
        url: '/SERVICE-BUSINESS/api/productionExecutionProgram/page',
        methods: 'GET',
        data: [],
        columns: [
            {
                type: 'selection',
                align: 'center'
            },
            {label: 'NC程序名称', prop: 'programName', slotName: 'programName'},
            {label: '派工单ID', prop: 'workingOrderNo'},
            {label: '设备编号', prop: 'equipmentNo'},
            {label: '修改次数', prop: 'changeCount', align: 'right'},
            {
                label: '最后修改时间',
                prop: 'lastChangeTime',
                'min-width': 120,
                align: 'center',
                slotName: 'lastChangeTime'
            }
        ]
    }
}
```

### 组件测试用例

* 点击分页码，默认搜索条件是否起作用
* 点击重置按钮，默认搜索条件是否起作用
  * 在第二页（非第一页），点击重置按钮后，分页码是否返回第一页
  * 更改分页栏，一次显示个数
  * 数据量是否显示正常
  * 分页码是否显示在第一个页
  * 默认的筛选条件是否起作用
* 点击第二页（非第一页），点击搜索按钮
  * 查看分页码是否处于第一页
  * 查看搜索条件是否起作用
  * 默认条件（例如：时间传递的格式）是否正常格式传递
* 字段：时间，编码，数量等量词是否有排序功能
* 操作栏固定可供选择

### Changlog

* 2020-02-11；取消去控制compont进行选择两种搜索组件

### 参考

* [egrid](https://github.com/kinglisky/egrid)
  通过v-on、v-bind实现属性和方法多成绩传递

