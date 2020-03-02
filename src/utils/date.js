/**
 * Created by yan.zhang@yunshipei.com on 17/11/29.
 * date格式化 : 将数据库中的date格式转化为日常查看模式
 * 2017-11-29T03:23:13.000Z -> 2017-11-29 11:23:13
 * format('2017-11-29T03:23:13.000Z', 'yyyy-MM-dd')
 * format('2017-11-29T03:23:13.000Z', 'yyyy-MM-dd hh:mm:ss')
 */

export default {
    format (date, fmt) {
        let nowDate = new Date(date);
        let o = {
            'M+': nowDate.getMonth() + 1, //月份
            'd+': nowDate.getDate(), //日
            'h+': nowDate.getHours(), //小时
            'm+': nowDate.getMinutes(), //分
            's+': nowDate.getSeconds(), //秒
            'q+': Math.floor((nowDate.getMonth() + 3) / 3), //季度
            'S': nowDate.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (nowDate.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    },
    // 根据毫秒数获取具体时长
    getFrequentlyByMS (ms) {
        let days = parseInt(ms / (1000 * 60 * 60 * 24));
        if (days > 0) {
            let hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60));
            if (hours === 0) {
                return days + '天';
            } else if (hours !== 0 && minutes === 0) {
                return days + '天' + hours + '小时';
            } else {
                return days + '天' + hours + '小时' + minutes + '分钟';
            }
        } else {
            let hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (hours > 0) {
                let hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60));
                if (minutes === 0) {
                    return hours + '小时';
                } else {
                    return hours + '小时' + minutes + '分钟';
                }
            } else {
                // 最大单位只有分钟
                return parseInt(ms / (1000 * 60)) + '分钟';
            }
        }
    }
}


