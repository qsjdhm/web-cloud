/* 编辑器webstorm 识别别名 */
'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    resolve: {
        alias: {
            '@': resolve('src'),
            '@vt': resolve('packages'),
            '@webcl': resolve('components')
        }
    }
}
