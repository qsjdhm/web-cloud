# 左侧树鼠标移上去显示点组件

### 组件内容
    左侧树加操作功能
    鼠标移上去树节点显示 点图标 点击点图标显示操作按钮菜单列表

### FAQ

#### 树组件高度如何做到自适应？

1. flex 布局，tree高度受外部高度决定
2. 高度没有自适应，通过overflow: hidden;具体实现逻辑，参考[强信]()


<!--:::tip-->
<!--* 默认触发方法，有默认 点击触发-->
<!--*  :::-->

### watch 监听
    //监听弹窗显示关闭弹窗事件
    'rightMenu.show'(val) {
        if (val) {
            //如果弹窗显示添加关闭弹窗事件
            document.body.addEventListener('click', this.handlecCloseMenu);
        } else {
            //如果弹窗不显示去除关闭弹窗事件
            document.body.removeEventListener(
                'click',
                this.handlecCloseMenu
            );
        }
    }
### methods方法
    //显示菜单事件
    showMenu () {
        this.rightMenu.show = true;
        this.rightMenu.top = event.clientY + 10;
        let arr = [];
        if (data.level === 0) {
            this.rightMenu.left = event.clientX - 40;
            arr = [
                {
                    name: '刷新',
                    type: 'refresh',
                    data: data,
                    icon: 'el-icon-refresh',
                    show: true
                },
                {
                    name: '新增',
                    type: 'add',
                    data: data,
                    icon: 'el-icon-circle-plus-outline',
                    show: true
                }
            ];
        } else {
            this.rightMenu.left = event.clientX - 80;
            arr = [
                {
                    name: '刷新',
                    type: 'refresh',
                    data: data,
                    icon: 'el-icon-refresh',
                    show: true
                },
                {
                    name: '新增',
                    type: 'add',
                    data: data,
                    icon: 'el-icon-circle-plus-outline',
                    show: true
                },
                {
                    name: '编辑',
                    type: 'update',
                    data: data,
                    icon: 'el-icon-edit',
                    show: true
                },
                {
                    name: '删除',
                    type: 'delete',
                    data: data,
                    icon: 'el-icon-delete',
                    show: true
                }
            ];
        }
        this.rightMenu.list = arr;
    }

    // 关闭操作菜单事件
    handlecCloseMenu() {
        this.rightMenu.show = false;
    },
### 字段说明
>
```js
rightMenu: {
    show: false,   // 弹窗是否显示
    left: 0,       // 弹窗出现的位置left值
    top: 0,        // 弹窗出现的位置top值
    list: [
        {
            name: '刷新',               // 显示的name
            type: 'refresh',            // 类型
            data: data,                 // 当前点击行的数据
            icon: 'el-icon-refresh',    // 图标
            show: true                  // 是否显示
        },
        {
            name: '新增',
            type: 'add',
            icon: 'el-icon-circle-plus-outline',
            data: data,
            show: true
        },
        {
            name: '编辑',
            type: 'update',
            icon: 'el-icon-edit',
            data: data,
            show: true
        },
        {
            name: '删除',
            type: 'delete',
            icon: 'el-icon-delete',
            data: data,
            show: true
        }
    ]       //
},
```
### 组件功能逻辑简要说明
    1、首先给特定区域去


### 组件测试用例

* 鼠标移入树节点，是否正常显示点图标
* 点击3点图标，是否正常显示操作按钮菜单
  * 鼠标移入操作按钮菜单，3点图标是否正常显示
  * 鼠标移除树节点
  * 菜单按钮数量是否正常展示
  * 选中之后菜单按钮是否正常关闭
  * 树节点第一个不能编辑和删除菜单按钮是否正产显示
* 点击右键，除特定区域以为右键功能是否正常使用
### Changlog

* 2020-02-27；左侧树新增、编辑、删除功能按钮修改成右键点击出现菜单

### 参考

* [egrid](https://github.com/2017coding/BBS_admin)

