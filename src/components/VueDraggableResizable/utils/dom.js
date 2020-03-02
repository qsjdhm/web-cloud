import { isFunction } from './fns'

//将选择器与父元素匹配
export function matchesSelectorToParentElements (el, selector, baseNode) {
    let node = el

    const matchesSelectorFunc = [
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector'
    ].find(func => isFunction(node[func]))

    if (!isFunction(node[matchesSelectorFunc])) return false

    do {
        if (node[matchesSelectorFunc](selector)) return true
        if (node === baseNode) return false
        node = node.parentNode
    } while (node)

    return false
}

// 添加事件
export function addEvent (el, event, handler) {
    if (!el) {
        return
    }
    if (el.attachEvent) {
        el.attachEvent('on' + event, handler)
    } else if (el.addEventListener) {
        el.addEventListener(event, handler, true)
    } else {
        el['on' + event] = handler
    }
}

// 删除事件
export function removeEvent (el, event, handler) {
    if (!el) {
        return
    }
    if (el.detachEvent) {
        el.detachEvent('on' + event, handler)
    } else if (el.removeEventListener) {
        el.removeEventListener(event, handler, true)
    } else {
        el['on' + event] = null
    }
}

// 监听元素style属性变化事件
export function addStyleEvent (el, events, handler) {
    if (!el) {
        return
    }
    if (events.length === 0) {
        return
    }
    var flag = false;
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == "attributes") {
                flag = true
            }
        });
        if (flag) {
            // 回调
            handler()
        }
    });

    observer.observe(el, {
        attributes: true,  //configure it to listen to attribute changes,
        attributeFilter: ['style']
    });
}
