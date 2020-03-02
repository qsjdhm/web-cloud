<template>
    <div
        class="common-title-pack"
        :style="options.hasOwnProperty('MLPx') ? positionResolve(options.MLPx) : ''"
    >
        <div class="guide-pack">
            <div
                class="line"
                :style="options.hasOwnProperty('lineBgColor') ? lineStyleResolve(options.lineBgColor) : ''"
            />
            <div class="text-pack">{{ options.hasOwnProperty('text') ? options.text : '-' }}</div>
        </div>
    </div>
</template>

<script>
/**
 * @module 强信公用头部样式组件
 * @author 李志鸣
 * params:
 * 1.text (显示文字) String
 * 2.MLPx (左移像素值) Number
 * 3.lineBgColor (指引线颜色) String
 */
export default {
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data () {
        return {}
    },
    methods: {
        // 指引线样式解析
        lineStyleResolve (bgColor) {
            return `background-color: ${bgColor}`
        },
        // 位置调整
        positionResolve (pxiel) {
            return `margin-left: -${pxiel}px`
        }
    }
}
</script>

<style lang="scss" scoped>
// 强信 title通用样式
.common-title-pack {
    height: 30px;
    line-height: 30px;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .guide-pack {
        height: 30px;
        display: flex;
        align-items: center;
        .line {
            width: 3px;
            height: 20px;
            background-color: #1890ff;
        }
        .text-pack {
            padding-left: 7px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            font-weight: normal;
            color: #222222;
        }
    }
}
</style>