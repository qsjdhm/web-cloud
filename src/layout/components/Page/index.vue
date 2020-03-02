<!-- 用于区分列表页和详情页是否铺满一整屏 -->
<template>
    <div :class="[type === 'one' ? 'oneScreen' : '', 'page-style']">
        <div :class="['list-contain',className ? className: '']">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'VtPage',
    props: {
        type: {
            type: String,
            default: ''
        },
        className: {
            type: String,
            default: ''
        },
    }
}
</script>

<style lang="scss" scoped>
.oneScreen{
    display: flex;
    flex-direction: column;
}
.page-style {
    /*padding: 5px 8px;*/
    background: $pageBg;
}

.list-contain {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
