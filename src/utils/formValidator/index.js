import validator from '@/utils/validator.js';
// 验证规则
let formRules = {
    // 是否为空
    isEmpty: (rule, value, callback, msg) => {
        if (
            value === '' ||
            value === null ||
            value === undefined ||
            _.trim(value) === ''
        ) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    },
    // 是否为空数组
    isEmptyArr: (rule, value, callback, msg) => {
        if (!Array.isArray(value) || value.length <= 0) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    },
    // 可以为空
    allowEmpty: (rule, value, callback, msg) => {
        callback();
        return true;
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
        if (value && !ipReg.test(value)) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    },
    timeRange: (rule, value, callback, msg, options) => {
        if (!Array.isArray(value)) {
            callback(new Error(msg));
            return false;
        } else if (value.length !== 2) {
            callback(new Error(msg));
            return false;
        } else {
            return true;
        }
    }
};

function generateValidator (opt) {
    let validatorArr = opt;
    return [
        {
            validator: (rule, value, callback) => {
                for (let i = 0; i < validatorArr.length; i++) {
                    let fnName = validatorArr[i].type;
                    let msg = validatorArr[i].msg;
                    let options = validatorArr[i];
                    if (
                        !formRules[fnName](rule, value, callback, msg, options)
                    ) {
                        return;
                    }
                }
                callback();
            },
            trigger: ['change', 'blur']
        }
    ];
}

//  需要导出的验证规则
let exportValidator = {
    // 是否为空
    isEmpty: (msg = '参数不能为空') => {
        let opt = [
            {
                type: 'isEmpty',
                msg
            }
        ];
        return generateValidator(opt);
    },
    isEmptyArr: (msg = '参数不能为空') => {
        let opt = [
            {
                type: 'isEmptyArr',
                msg
            }
        ];
        return generateValidator(opt);
    },
    allowEmpty: () => {
        let opt = [
            {
                type: 'allowEmpty',
                msg: ''
            }
        ];
        return generateValidator(opt);
    },
    // 邮箱
    isEmail: msg => {
        let opt = [
            {
                type: 'isEmpty',
                msg: '邮箱不能为空'
            },
            {
                type: 'isEmail',
                msg: '请输入正确邮箱地址'
            }
        ];
        return generateValidator(opt);
    },
    isIP: (msg, required = true) => {
        let opt = [];
        if (required) {
            opt = [
                {
                    type: 'isIP',
                    msg: `请输入正确的${msg}IP地址`
                }
            ];
        } else {
            opt = [
                {
                    type: 'isIP',
                    msg: `请输入正确的${msg}IP地址`
                }
            ];
        }

        return generateValidator(opt);
    },
    timeRange: msg => {
        let opt = [
            {
                type: 'timeRange',
                msg
            }
        ];
        return generateValidator(opt);
    }
};
export default {
    generateValidator,
    ...exportValidator
};
