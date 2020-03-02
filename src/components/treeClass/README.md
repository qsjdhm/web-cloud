# 左侧树右键菜单组件

### 组件内容


### FAQ

#### 树组件高度如何做到自适应？

1. flex 布局，tree高度受外部高度决定
2. 高度没有自适应，通过overflow: hidden;具体实现逻辑，参考[强信]()


<!--:::tip-->
<!--* 默认触发方法，有默认 右键触发-->
<!--*  :::-->
### 代码示例
    <!-- 右键菜单 -->
    <ul
        v-show="rightMenu.show"
        class="contextmenu"
        :style="{left: rightMenu.left +'px',top: rightMenu.top +'px'}"
    >
        <li
            v-for="(item, index) in rightMenu.list.filter(item => item.show)"
            :key="index"
            @click="handleRightEvent(item.type, item.data)"
        >{{ item.name }}</li>
    </ul>

### watch 监听
    //监听右键弹窗显示关闭弹窗事件
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
    //去掉特定区域系统默认的右键事件
    defaultEvent () {
        let content = document.getElementById('test');
        content.oncontextmenu = function(e) {
            return false;
        };
    }

    // 给树节点加右键事件
    @node-contextmenu="handleEvent"
    // 关闭右键菜单
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
            name: '刷新',       // 显示的name
            type: 'refresh',    // 类型
            data: data,         // 当前点击行的数据
            show: true          // 是否显示
        },
        {
            name: '新增',
            type: 'add',
            data: data,
            show: true
        },
        {
            name: '编辑',
            type: 'update',
            data: data,
            show: true
        },
        {
            name: '删除',
            type: 'delete',
            data: data,
            show: true
        }
    ]       //
},
```
### 组件功能逻辑简要说明
    1、首先给特定区域去系统默认的右键事件
    2、给树节点加上右键事件 @node-contextmenu="handleEvent"
    3、定义右键事件出现按钮弹窗，对弹窗位置进行跟随设置
    4、对选中的按钮根据不同的类型进行不同处理
    5、wacth监听页面弹窗是否显示，加关闭弹窗事件功能


### 组件测试用例

* 点击右键，特定区域是否能正常出现按钮菜单
* 点击选中按钮，按钮功能是否正常使用
  * 点击除了菜单以外的地方，右键菜单是否正常关闭
  * 点击不同的树节点位置，菜单是否跟随出现
  * 菜单按钮数量是否正常展示
  * 选中之后菜单按钮是否正常关闭
  * 树节点第一个不能编辑和删除菜单按钮是否正产显示
* 点击右键，除特定区域以为右键功能是否正常使用
### Changlog

* 2020-02-27；左侧树新增、编辑、删除功能按钮修改成右键点击出现菜单

### 参考

* [egrid](https://github.com/2017coding/BBS_admin)

