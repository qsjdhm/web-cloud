/* todo 未使用防抖函数处理 */
//全兼容的 事件绑定  and  阻止默认事件
let EventUtil = {
//Notice: type is not include 'on', for example: click mouseover mouseout and so on
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },

    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
};
let mediaQuery = function (callback) {
    outputSize(callback);
    EventUtil.addHandler(window, "resize", function () {
        outputSize(callback); //前面的this要单独保存，否则在这里this指的是window
    });
}
let outputSize =  function (callback) {
    let result = {}
    let result0 = window.matchMedia('(min-width:1920px)');
    let result1 = window.matchMedia('(min-width:1200px)');
    let result2 = window.matchMedia('(min-width:992px)');
    let result3 = window.matchMedia('(min-width:768px)');
    result.innerWidth = window.innerWidth
    result.innerHeight = window.innerHeight
    if (result0.matches) {
        result.type = 'xl'
        console.log(">=1900 超大型设备 显示器");
    } else if (result1.matches) {
        result.type = 'lg'
        // console.log(">=1200 大型设备 笔记本电脑和台式机");
    } else if (result2.matches) {
        result.type = 'md'
        // console.log("992=< <=1200 中型设备 台式电脑");
    } else if (result3.matches) {
        result.type = 'sm'
        // console.log("768<= <=992 小型设备 平板电脑");
    } else {
        result.type = 'xs'
        // console.log("<=768 超小设备 手机");
    }
    if (callback) callback(result)
}

// xs	<768px 响应式栅格数或者栅格属性对象	number/object (例如： {span: 4, offset: 4})
// sm	≥768px 响应式栅格数或者栅格属性对象	number/object (例如： {span: 4, offset: 4})
// md	≥992px 响应式栅格数或者栅格属性对象	number/object (例如： {span: 4, offset: 4})
// lg	≥1200px 响应式栅格数或者栅格属性对象	number/object (例如： {span: 4, offset: 4})
// xl	≥1920px 响应式栅格数或者栅格属性对象	number/object (例如： {span: 4, offset: 4})

export default mediaQuery
// window.onload = function () {
//     mediaQuery.init();
// };



