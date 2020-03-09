<!-- 标准代码管理页面 -->
<template>
    <div class="welcome-box oneScreen">
        <color-picker value="#ddd" />
        <tags-view2 />
        <!--<div class="welcome-text">欢迎使用 <span>强信设备管理系统</span></div>-->
    </div>
</template>

<script>
import ColorPicker from '../../../components/color-picker/src/color-picker.vue';
import TagsView2 from '../../../components/TagsView2/src/TagsView2.vue';
export default {
    name: 'Welcome',
    components: { ColorPicker, TagsView2 },
    data() {
        return {}
    },
    mounted() {},
    methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.welcome-box {
    /* 84 = navbar + tags-view = 50 + 34 */
    /*background-image: url(../../assets/welcome/welcome.png);*/
    background-size: 100% 100%;

    .welcome-text {
        width: 100%;
        height: 300px;
        text-align: center;
        line-height: 300px;
        color: #333;
        font-size: 32px;
        font-weight: 500;

        span {
            color: #4978fc;
            margin-left: 20px;
        }
    }
}
.heart {
    width: 200px;
    height: 200px;
    background-color: darken(red, 10%);
    margin: 300px auto 0;
    position: relative;
    transform: rotate(-45deg);
    animation: heartbeat 2s ease-in infinite;

    &:before,
    &:after {
        content: '';
        display: block;
        width: 200px;
        height: 200px;
        position: absolute;
        background-color: darken(red, 10%);
        border-radius: 50%;
        animation: heartbeat 3s linear infinite;
    }

    &:before {
        left: 0;
        top: -90px;
    }

    &:after {
        top: 0;
        right: -90px;
    }
}

@keyframes heartbeat {
    50% {
        width: 180px;
    }
}
</style>
