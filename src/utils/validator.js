/**
 * Created by yan.zhang@yunshipei.com on 17/12/11.
 * 字符串格式验证
 * validator.notExceedMax('123', 3)  -> true
 * validator.notExceedMax('12 3', 3)  -> false
 * validator.notExceedMax(undefined, 3)  -> false
 * validator.httpFront('https://www.bai')  -> true
 * validator.httpFront('sdfhttps://www.bai')  -> false
 */

import _ from 'lodash';

export default {
    // 是否不为空
    notEmpty (str) {
        if (str !== undefined && str !== null && str !== '' && _.trim(str) !== '') {
            return true;
        } else {
            return false;
        }
    },
    // 字符串是否不超过字符串限制区间
    notExceedMax (str, minNum, maxNum) {
        if (this.notEmpty(str)) {
            if (str.length > maxNum) {
                return false;
            } else {
                return true;
            }
        } else {
            if (minNum === 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    // 字符串是否小于最小数
    notLessMin (str, minNum) {
        if (this.notEmpty(str)) {
            if (str.length < minNum) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 字符串是否以http或https开头
    httpFront (str) {
        if (this.notEmpty(str)) {
            var urlText = /^(http|https):\/\/([\w.]+\/?)\S*?$/;
            if (!urlText.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 是否是host
    isHost (str) {
        if (this.notEmpty(str)) {
            let hostReg = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
            if (!hostReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 是否是host 文件
    isHostFile (str) {
        if (this.notEmpty(str)) {
            let hostFileReg = /^(http(s){0,1}:\/\/)([a-zA-Z0-9]+[a-zA-Z0-9\-]*?(\.|\:))+(([0-9]+|com|cn|net|org|gov|info|la|cc|co))/;
            if (!hostFileReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 是否是邮箱格式
    isEmail (str) {
        if (this.notEmpty(str)) {
            var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!emailReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 是否是手机格式
    isPhone (str) {
        if (this.notEmpty(str)) {
            var phoneReg = /^1[3|4|5|7|8|9][0-9]{9}$/;
            if (!phoneReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // IP地址格式判断
    isIP (str) {
        if (this.notEmpty(str)) {
            var ipReg = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/;
            if (!ipReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 开头不能为0 的整数 小数 和横线的正则验证 小数点前4位后两位
    test (str) {
        if (this.notEmpty(str)) {
            //
            var ipReg = /^\d+([.]?\d)*\*\d+([.]?\d)*\*\d+([.]?\d)*$/;
            if (!ipReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 只匹配正整数且不超过4位
    posit (str) {
        if (this.notEmpty(str)) {
            var ipReg = /^[0-9]{1,4}$/;
            if (!ipReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 只匹配整数
    potNumber (str) {
        if (this.notEmpty(str)) {
            var ipReg = /^[0-9]$/;
            if (!ipReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    // 只匹配数字和小数 小数点前不超过4位 小数点后不超过两位
    pot (str) {
        if (this.notEmpty(str)) {
            var ipReg = /^\d{1,9}(\.\d{1,2})?$/;
            if (!ipReg.test(str)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    //  配置管理  兼容配置 弹出窗口 例外网站  *.example.com
    popupWindowException (str) {
        var newPopupArry = str.split('.');
        for (var i = 1; i <= newPopupArry.length -1; i ++) {
            if (newPopupArry[i].indexOf('*') > -1) {
                return false;
            }
        }
        return true;
    },
    examineItem (str) {
        if (this.notEmpty(str)) {
            str.forEach((item, index) => {
                if (item.actualValue === null) {
                    return false;
                } else {
                    return true;
                }
            });
        } else {
            return false;
        }
    },
    // 是否包含中文
    isChinese (str) {
        if (escape(str).indexOf('%u') < 0) {
            return true;
        } else {
            return false;
        }
    },
    // 只匹配大小写英文字母
    isOnlyEnglishLetter (str) {
        if (this.notEmpty(str)) {
            let reg = /^[a-zA-Z]+$/;
            if (reg.test(str)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    // 只匹配中文
    isOnlyChineseLetter (str) {
        if (this.notEmpty(str)) {
            let reg = /^[\u4e00-\u9fa5]+$/;
            if (reg.test(str)) {
                return true
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    // 只匹配中文、数字、英文字母
    isOnlyRegularLetter (str) {
        if (this.notEmpty(str)) {
            let reg = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;
            if (reg.test(str)) {
                return true
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    // 匹配数字字母和特殊字符的密码
    checkPassword (str) {
        if (this.notEmpty(str)) {
            let reg = /^[A-Za-z0-9~!@#$%^&_*?]{6,16}$/;
            if (reg.test(str)) {
                return true
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}


