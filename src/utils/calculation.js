import * as math from 'mathjs'

// 浮点数类型运算
function numberOperation (number) {
    return math.format(number, {precision: 14})
}

export default {
    numberOperation
}
