## 业务方法-表单验证

#### 针对 elementUI 表单验证过于繁琐，进行二次封装的表单验证方法

#### demo

```js
export default {
      data () {
        return {
            Rules: {
                //  确保  exportValidator对象中有封装好的 isEmpty ，maxLength，isIP 等方法  可根据业务需求封装

                // 方法一   根据业务封装验证规则
                a: this.formValidator.isEmpty("请输入aa"),
                b: this.formValidator.isEmail(),
                isIP:this.formValidator.isIP('客户端'),

                // 方法二 根据已有验证规则自定义验证   适用于不便于统一封装的验证
                b: this.formValidator.generateValidator([
                    { type: "isEmpty", msg: "请输入b" }，
                    { type: "maxLength", msg: `b长度不能超过${20}`，maxLength:20 }
                ]),

            }
        }

};
```

```js
//  封装各种验证规则
let formRules = {
    isEmpty: (rule, value, callback, msg) => {
        if (
            value === "" ||
            value === null ||
            value === undefined ||
            _.trim(value) === ""
        ) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    },
    num: (rule, value, callback, msg) => {
        var Reg = /^[0-9]*$/;
        if (!Reg.test(value)) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    },
    // 最大输入长度
    maxLength: (rule, value, callback, msg, options) => {
        let maxLength = options.maxLength || 20;
        if (value.length > maxLength) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    },
    // ip地址
    isIP: (rule, value, callback, msg, options) => {
        var ipReg = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/;
        if (!ipReg.test(value)) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    }
};

//  需要导出的验证规则 在外部表单验证需要使用
let exportValidator = {
    // 是否为空
    isEmpty: (msg = "参数不能为空") => {
        let opt = [
            {
                type: "isEmpty",
                msg
            }
        ];
        return generateValidator(opt);
    },
    // 邮箱
    isEmail: msg => {
        let opt = [
            {
                type: "isEmpty",
                msg: "邮箱不能为空"
            },
            {
                type: "isEmail",
                msg: "请输入正确邮箱地址"
            }
        ];
        return generateValidator(opt);
    },
    isIP: msg => {
        let opt = [
            {
                type: "isEmpty",
                msg: `请输入${msg}`
            },
            {
                type: "isIP",
                msg: `请输入正确的${msg}IP地址`
            }
        ];
        return generateValidator(opt);
    }
};
```

#### tips

> 过于特殊复杂的验证请使用 elementUI 文档中的验证写法
