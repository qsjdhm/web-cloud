// ==UserScript==
// @name         Swagger  API BTN
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       Oliver_web@163.com
// @match        http://*/*swagger-ui.html*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.js
// @require      http://47.104.64.155/nginx/file/cdn/jquery.drag.js
// @grant        none
// ==/UserScript==
/*
* 需要浏览器安装油猴插件
*
*
* */
var status = 5
var apiDoc = {}

try {
    (function() {
        let prex = ''
        let target = location.href.split('/').filter((item) => {
            return item.includes('SERVICE-')
        })
        if (target[0]) {
            prex = '/' + target[0]
        }
        if (location.href.indexOf('swagger-ui.html') > 0) {
            /* 重置页面元素 */
            $('html').css('width', '100%')
            $('html').css('height', '100%')
            $('html').css('overflow-y', 'hidden')
            $('body').css('width', '100%')
            $('body').css('height', '100%')
            $('#swagger-ui').css('width', '100%')
            $('#swagger-ui').css('height', '100%')
            $('#swagger-ui').css('overflow', 'auto')
            $('#swagger-ui').on('click', '.opblock-summary-method', function(e) {
                e.stopPropagation()
                // 模块名称
                let moudleName = $(e.currentTarget).parent().parent().parent().parent().prev('.opblock-tag').find('span').text()
                //
                let summary = $(e.currentTarget).next().next().text()
                // 请求方法
                let method = $(e.currentTarget).text().toLowerCase()
                // 当前api
                let api = $(e.currentTarget).next().find('span').text()
                // api的最后的一位和请求方法的拼接
                let name = api.match(/{?\w+}?$/)[0].replace(/[{}]/g, '')
                let resultJson = ''
                /* 判断类型这里可以进行随意修改 */
                if (status === 1) {
                    try {
                        let schema = apiDoc.paths[api][method.toLowerCase()].parameters[0].schema.$ref.split('/')
                        console.log(schema)
                        let str = schema[schema.length - 1]
                        let json = apiDoc.definitions[str].properties
                        resultJson = clearObject(json)
                    } catch (error) {
                        console.log(error)
                    }
                    copyText('', `/**
             * @tag  ${moudleName}>${api}
             * @summary ${summary}
             */
             let params = ${JSON.stringify(resultJson)}
             this.$service('${method}', '${prex}${api}', params)`)
                } else if (status === 2) {
                    copyText('', `${moudleName}/${name}-${method.toLowerCase()}`)
                } else if (status === 3) {
                    copyText('',
                      `'${method}', '/${target[0]}${api}'`)
                } else if (status === 4) {
                    copyText('', `/**
             * @tag  ${moudleName}>${api}
             * @summary ${summary}
             */
             this.$service('${method}', '${prex}${api}', params)`)
                } else if (status === 5) {
                    copyText('', `this.$service('${method}', '${prex}${api}', params)`)
                } else {
                    console.log('\x1B[32m%s\x1B[0m', '未设置，可能有异常')
                }
            })
            $('body').on('click', '#dragEle', function(e) {
                let val = $(e.target).val()
                localStorage.setItem('checkValue', val)
            })
            setTimeout(() => {
                insetHtml()
                console.log($('.url').text())
                $.ajax({
                    type: 'GET',
                    url: $('.url').text(),
                    dataType: 'json',
                    success: function(data) {
                        apiDoc = data
                    }
                })
            }, 2000)

            function insetHtml() {
                document.getElementsByTagName('body')[0].insertAdjacentHTML(
                  'beforeend', `<div id="dragEle" style="cursor: move;width: 402px;height: 32px;line-height:32px;border-radius: 8px;color: #fff;background-color:#409eff;position: fixed;top: 13px;left: 160px;z-index: 9999999">
\t<input class="apicheckbox" name="AdPrintMode" type="radio" value="1"/>JSON字段
\t<input class="apicheckbox" name="AdPrintMode" type="radio" value="2"/>node脚本
\t<input class="apicheckbox" name="AdPrintMode" type="radio" value="3"/>simple
\t<input class="apicheckbox" name="AdPrintMode" type="radio" value="4"/>注释
\t<input class="apicheckbox" name="AdPrintMode" type="radio" value="5"/>常用
</div>`)
                // 设置拖拽元素，自由拖动
                $('#dragEle').draggable()
                let checkValue = localStorage.getItem('checkValue')
                // 点击选择框，选择模式
                $('.apicheckbox').click(function(e) {
                    status = Number($(e.target).val())
                })
                // 从本地localstorage，获取
                if (checkValue) {
                    $('.apicheckbox').eq(checkValue - 1).attr('checked', 'checked')
                    status = Number(checkValue)
                } else {
                    // 默认第二个
                    $('.apicheckbox').eq(1).attr('checked', 'checked')
                    status = 2
                }
            }

            /**
             * 点击事件
             */
            /**
             * 粘贴文本函数
             * @param id
             * @param attr
             */
            function copyText(id, attr) {
                let target = null
                if (attr) {
                    target = document.createElement('div')
                    target.id = 'tempTarget'
                    target.style.opacity = '0'
                    if (id) {
                        let curNode = document.querySelector('#' + id)
                        target.innerText = curNode[attr]
                    } else {
                        target.innerText = attr
                    }
                    document.body.appendChild(target)
                } else {
                    target = document.querySelector('#' + id)
                }

                try {
                    let range = document.createRange()
                    range.selectNode(target)
                    window.getSelection().removeAllRanges()
                    window.getSelection().addRange(range)
                    document.execCommand('copy')
                    window.getSelection().removeAllRanges()
                } catch (e) {
                    console.log('\x1B[31m%s\x1B[0m', '复制失败')
                }

                if (attr) {
                    // remove temp target
                    target.parentElement.removeChild(target)
                }
            }

            function clearObject(initObject, whiteList = []) {
                Object.keys(initObject).forEach((key) => {
                    if (whiteList.length > 0) {
                        whiteList.map((item) => {
                            if (item !== key) {
                                initObject[key] = null
                            }
                        })
                    } else {
                        initObject[key] = null
                    }
                })
                return initObject
            }
        }
    })()
} catch (error) {
    console.log(error)
}
// 电脑本地进行快速调试
// @require      file://D:\tools\TamperMonkey\swagger_1.0.1.js
// 缺少在线更新
// 直接复制到油侯插件中
