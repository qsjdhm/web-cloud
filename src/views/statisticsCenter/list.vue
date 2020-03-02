<template>
    <!--统计中心-->
    <div class="page-pack">
        <div class="container-pack">
            <div class="top-tab-pack">
                <div
                    class="tab"
                    :class="currentTab === 'status' ? 'tab-active' : ''"
                    @click="doTabClick('status')"
                >
                    <span>状态</span>
                </div>
                <div
                    class="tab"
                    :class="currentTab === 'warning' ? 'tab-active' : ''"
                    @click="doTabClick('warning')"
                >
                    <span>异常</span>
                </div>
            </div>
            <div class="view-pack">
                <!--状态模块-->
                <Status v-if="currentTab === 'status'" />
                <!--异常模块-->
                <Warning v-if="currentTab === 'warning'" />
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * @module 统计中心
     * @author 李志鸣
     */
    import Status from './components/Status'  // 状态模块
    import Warning from './components/Warning' // 异常模块

    export default {
        name: 'StatisticsCenterList',
        components: {
            Status,
            Warning
        },
        data () {
            return {
                currentTab: 'status' // 选中tab
            }
        },
        methods: {
            // 点击顶部tab
            doTabClick (tabType) {
                this.currentTab = tabType
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page-pack {
        width: 100%;
        height: calc(100vh - 51px);
        padding: 5px 8px;
        .container-pack {
            height: 100%;
            width: 100%;
            display: flex;
            flex-flow: column;
            .top-tab-pack {
                height: 35px;
                background-color: #fff;
                border-radius: 4px;
                .tab {
                    cursor: pointer;
                    float: left;
                    width: 53px;
                    height: 35px;
                    line-height: 35px;
                    margin-left: 47px;
                    font-size: 13px;
                    text-align: center;
                }
                .tab-active {
                    border-bottom: 2px solid #438afe;
                    color: #438afe;
                }
            }
            .view-pack {
                flex: 1;
            }
        }
    }
</style>
