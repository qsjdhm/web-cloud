/**
 * @description 用于权限方法处理，
 */

/**
 * 获取权限列表
 * @returns {[]}
 */
export function getBtnList() {
    let authorityList = JSON.parse(window.sessionStorage.getItem('Admin-Authority')) || []
    let permissionBtnList = []
    authorityList.map((item) => {
        if (item.children && item.children.length > 0) {
            item.children.map((childrenItem) => {
                permissionBtnList.push(childrenItem.url)
            })
        }
    })
    return permissionBtnList
}

/**
 * 判断当前是否有按钮权限的
 * @param $route
 * @param value
 * @returns {boolean}
 */
export function has ($route, value) {
    let permissionBtnList = getBtnList()
    // 禁用
    return permissionBtnList && permissionBtnList.includes(`${$route.path}/${value}`)
}

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */

export function multi2array (target, init = []) {
    target.forEach(item => {
        // 固定路由字段的path，后端返回路径使用url
        init.push(item.url || item.path)
        item.children && multi2array(item.children, init)
    })
    return init
}

/* 通过后端返回数据 adminAuthority，进行筛选出可以利用路由表 */
/**
 *
 * @param arr 本地路由
 * @param sourceArr 后台返回权限路由
 * @param count 当前的成绩
 * @param target
 */
export function filterData(arr, sourceArr = [], count = 0, target = []) {
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].path !== '*') {
            let _sourceArr = JSON.parse(JSON.stringify(sourceArr))
            for (let m = 0, len_m = _sourceArr.length; m < len_m; m++) {
                // 循环权限路由
                let itemPath = _sourceArr[m].url.split('/')
                itemPath.splice(0, 1)
                // 这里的按钮权限只能是两级，当前arr也是最后一层级
                if (arr[i].path !== itemPath[count] && arr[i].path !== `/${itemPath[count]}`) {
                    if (~arr[i].path.indexOf('/')) {
                        if (arr[i].path !== `${itemPath[count]}/${itemPath[count+1]}` && arr[i].path !== `/${itemPath[count]}/${itemPath[count+1]}`) {
                            _sourceArr.splice(m, 1)
                            m--
                            len_m--
                        }
                    }else{
                        // 普通场景
                        _sourceArr.splice(m, 1)
                        m--
                        len_m--
                    }
                }
            }
            if (_sourceArr.length > 0) {
                if (arr[i].children && arr[i].children.length > 0) {
                    count += 1
                    target = arr
                    filterData(arr[i].children, _sourceArr, count, target)
                    count -= 1
                }
            } else {
                arr.splice(i, 1)
                i--
                len--
                if (arr.length === 0) {
                    // target.length = 0
                }
            }
        }
    }
}
/**
 * 清空内部的中children为空元素
 * @param arr
 */
export function clearChildren(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].children && arr[i].children.length === 0) {
            arr.splice(i, 1)
            i--
            len--
        } else if (arr[i].children && arr[i].children.length > 0) {
            clearChildren(arr[i].children)
        }
    }
}
