<!-- 区块，数据列表组件 -->
<template>
    <div class="listPage-container">
        <!-- 搜索组件 -->
        <vt-search
            v-if="searchConfig.fields && searchConfig.fields.length > 0"
            ref="VtSearch"
            class="vt-search"
            :search-config="searchConfig"
            v-bind="setSearchAttr()"
            v-on="setSearchEvent()"
            @searchClick="getTableList"
            @reset="reset"
        />
        <div class="table-content">
            <!-- 表格头部的操作栏 -->
            <div
                v-if="$slots.operateHeader"
                class="operate-btn"
            >
                <slot name="operateHeader" />
                <div style="line-height: 26px">
                    <el-popover
                        placement="bottom"
                        width="160"
                        trigger="hover"
                        style="cursor: pointer"
                    >
                        <div class="config-pack">
                            <el-checkbox
                                v-model="checkAll"
                                :indeterminate="isIndeterminate"
                                @change="handleCheckAllChange"
                            >全选
                            </el-checkbox>
                            <el-divider />
                            <el-checkbox-group
                                v-model="checkedCities"
                                @change="handleCheckedCitiesChange"
                            >
                                <vue-draggable
                                    v-model="bsData.tableConfig.columns"
                                    v-bind="dragOptions"
                                    handle=".el-checkbox"
                                    @change="orderChange"
                                    @start="drag = true"
                                    @end="drag = false"
                                >
                                    <transition-group
                                        type="transition"
                                        :name="!drag ? 'flip-list' : null"
                                    >
                                        <el-checkbox
                                            v-for="item in bsData.tableConfig.columns"
                                            :key="item.prop"
                                            :label="item.prop"
                                        >
                                            {{ item.label }}
                                        </el-checkbox>
                                    </transition-group>
                                </vue-draggable>
                            </el-checkbox-group>
                        </div>
                        <span
                            slot="reference"
                            class="iconfont iconbiaotoushezhi"
                        />
                    </el-popover>
                    <span
                        style="margin-left: 14px;cursor: pointer"
                        class="iconfont iconshuaxin"
                    />
                </div>
            </div>
            <!-- 表格数据 -->
            <vt-table
                ref="VtTable"
                :table-config="tableConfig"
                v-bind="setTableAttr()"
                v-on="setTableEvent()"
                @onSizeChange="onSizeChange"
                @onCurrentChange="onCurrentChange"
            >
                <!-- 暴露插槽给父级元素 ，插槽嵌套插槽-->
                <template
                    v-for="(item) in tableConfig.columns"
                    v-slot:[item.slotName]="{scope}"
                >
                    <slot
                        v-if="item.slotName"
                        :name="item.slotName"
                        :scope="scope"
                    />
                </template>
            </vt-table>
        </div>
    </div>
</template>
<script>
import VtSearch from '@vt/VtSearch/VtSearch';
import VtTable from '@vt/VtTable/VtTable';
import VueDraggable from 'vuedraggable'
import methods from './methods.js'
/**
 * 由于是业务组件这里的请求方法需要特定，根据情况进行替换
 */
export default {
    name: 'BsTable',
    components: {
        VtTable,
        VtSearch,
        VueDraggable
    },
    inheritAttrs: false,
    props: {
        bsData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            userColLost: [],
            drag: false,
            checkAll: false,
            checkedCities: this.getCheckedCities(),
            isIndeterminate: true,
            searchConfig: {
                // 添加默认值
                fields: [],
                initTrigger: true,   // 页面加载时候就进行触发searchClick
                ...this.bsData.searchConfig
            },
            // 添加默认数据
            tableConfig: {
                data: [],
                loading: false,
                pagination: {
                    total: 0,
                    'current-page': 1,
                    'page-sizes': [50, 100, 200, 500], // 确保 page-sizes中要含有page-siz
                    'page-size': 50
                },
                ...this.bsData.tableConfig
            },
            searchParams: {}
        };
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            };
        }
    },
    mounted() {
        // 如果有搜索插件话，通过搜索触发
        // if (!this.bsData.tableConfig.forbid) {
        //     this.initTable();
        // }
        this.handleStorage()
    },
    // 路由表meta中cache: true 触发
    activated() {
        // 存在搜索栏，默认搜搜条件为tru
        if (this.$refs.VtSearch && this.searchConfig.initTrigger) {
            this.tableConfig.data = [];
            this.$refs.VtSearch.searchClick('searchCache');
        }
    },
    methods: {
        updateLocalStorage() {
            // 再把组织好的页面数据合到主分支上
            let allStorage = _.cloneDeep(JSON.parse(window.localStorage.getItem('Admin-ColList')))
            allStorage[this.username] = {[this.$route.path]: _.cloneDeep(this.bsData.tableConfig.columns)}
            window.localStorage.setItem('Admin-ColList', JSON.stringify(allStorage))
        },
        // 列顺序 变化事件
        orderChange(evt) {
            console.log(this.bsData.tableConfig.columns)
            // if (item.checked === true) {
            //     list.push(_.cloneDeep(item))
            // }
            let tmp = this.bsData.tableConfig.columns.filter((item) => this.checkedCities.includes(item.prop))
            this.tableConfig.columns = _.cloneDeep(tmp)
            this.updateLocalStorage()
        },
        getCheckedCities() {
            let checkedCities = []
            this.bsData.tableConfig.columns.map((item) => {
                checkedCities.push(item.prop)
            })
            return checkedCities
        },
        /* ================= config start ================= */
        handleCheckAllChange(val) {
            let allOptions = []
            this.bsData.tableConfig.columns.map((item) => {
                allOptions.push(item.prop)
            })
            this.checkedCities = val ? allOptions : [];
            this.tableConfig.columns = val ? this.bsData.tableConfig.columns : []
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            console.log('\x1B[32m%s\x1B[0m', '打印', value)
            let checkedCount = value.length;
            this.tableConfig.columns = this.bsData.tableConfig.columns.filter((item) => value.includes(item.prop))
            this.checkAll = checkedCount === this.bsData.tableConfig.columns.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.bsData.tableConfig.columns.length;
            this.updateLocalStorage()
        },
        /* ================= config end ================= */
        ...methods,
        //重置方法触发
        resetTable() {
            this.$refs.VtSearch.resetClick();
        },
        // 页面初始化加载
        initTable(params) {
            this.getTableList(params, 'searchBtn');
        },
        /**
         * @method 表格查询，
         * @val 搜索的参数值，进行添加多余的值
         * @type 类型：searchBtn、''; 判断是否是点击搜索按钮触发
         * * */
        async getTableList(val = {}, type) {
            // 用于模拟数据测试数据，可以不穿
            if (
                this.tableConfig.mockData &&
                this.tableConfig.mockData.length > 0
            ) {
                this.tableConfig.data = this.tableConfig.mockData;
            } else {
                this.tableConfig.loading = true;
                // 点击搜索，当前分页为一
                if (type === 'searchBtn') {
                    this.tableConfig.pagination['current-page'] = 1;
                }
                let params = {
                    pageNum: this.tableConfig.pagination['current-page'],
                    pageSize: this.tableConfig.pagination['page-size'],
                    ...this.tableConfig.params,
                    ...val
                };
                this.searchParams = _.cloneDeep(params);
                try {
                    let res = await this.$service(
                        this.tableConfig.methods,
                        this.tableConfig.url,
                        params
                    );
                    // 这里暂时不添加，有时间在维护，防止其他问题，
                    if (res.list.length === 0 && res.pageNum !== 1) {
                        this.tableConfig.pagination['current-page'] -= 1;
                        this.getTableList(val, type);
                        // 通过当前id获取子节点数据
                    } else {
                        this.tableList = _.cloneDeep(res.list);
                        this.total = _.cloneDeep(res.total);
                        this.tableLoading = false;
                    }
                    this.tableConfig.data = res.list;
                    this.tableConfig.pagination.total = res.total;
                    this.tableConfig.loading = false;
                } catch (error) {
                    this.tableConfig.loading = false;
                }
            }
        },
        /**
         * @method 重置，当前页面设置
         * */
        reset(val) {
            this.tableConfig.pagination['current-page'] = 1;
            this.initTable(val);
        },
        // 分页码改变触发
        onCurrentChange(val) {
            this.tableConfig.pagination['current-page'] = val;
            let searchParams = this.$refs.VtSearch.searchParams;
            console.log('\x1B[32m%s\x1B[0m', '打印searchParams', searchParams)
            this.getTableList(searchParams);
        },
        // 一页显示的分页个数触发
        onSizeChange(val) {
            this.tableConfig.pagination['current-page'] = 1;
            this.tableConfig.pagination['page-size'] = val;
            let searchParams = this.$refs.VtSearch.searchParams;
            this.getTableList(searchParams);
        },
        // table 绑定属性
        setTableAttr() {
            return this.$attrs;
        },
        // table 绑定事件
        setTableEvent() {
            let Event = Object.assign({}, this.$listeners);
            return Event;
        },
        // search 搜索组件 绑定属性
        setSearchAttr() {
            return this.$attrs;
        },
        // search 绑定事件
        setSearchEvent() {
            let Event = Object.assign({}, this.$listeners);
            return Event;
        },
        handleStorage() {
            // 1. 先从缓存中获取用户名
            this.username = window.sessionStorage.getItem('Admin-Username')
            // 2. 如果缓存中没有对应数据，就设置每列都是选中状态
            let localColList = window.localStorage.getItem('Admin-ColList')
            if (localColList === null || JSON.parse(localColList)[this.username] === undefined || JSON.parse(localColList)[this.username][this.$route.path] === undefined) {
                // 本地什么都没有进行保存
                this.bsData.tableConfig.columns.map(item => {
                    if(this.checkedCities.includes(item.prop))item.checked = true
                })

                let userColLost = _.cloneDeep(this.bsData.tableConfig.columns)
                // 3. localStorage没有Admin-ColList信息（这个电脑没有登录过任何用户）
                if (window.localStorage.getItem('Admin-ColList') === null) {
                    window.localStorage.setItem('Admin-ColList', JSON.stringify({
                        [this.username]: {
                            [this.$route.path]:  userColLost
                        }
                    }))
                }
                // 4. Admin-ColList中没有此用户信息（这个电脑没有登录过此用户）
                if (JSON.parse(window.localStorage.getItem('Admin-ColList'))[this.username] === undefined) {
                    let userStorage = {
                        [this.username]: {
                            [this.$route.path]:  userColLost
                        }
                    }
                    let afterStorage = Object.assign(userStorage, JSON.parse(window.localStorage.getItem('Admin-ColList')))
                    window.localStorage.setItem('Admin-ColList', JSON.stringify(afterStorage))
                }
                // 5. Admin-ColList中此用户没有此页面信息（此用户没有打开过此页面）
                if (JSON.parse(window.localStorage.getItem('Admin-ColList'))[this.username][this.$route.path] === undefined) {
                    let pathStorage = Object.assign({[this.$route.path]:  userColLost}, JSON.parse(window.localStorage.getItem('Admin-ColList'))[this.username])
                    // 再把组织好的页面数据合到主分支上
                    let allStorage = _.cloneDeep(JSON.parse(window.localStorage.getItem('Admin-ColList')))
                    allStorage[this.username] = pathStorage
                    window.localStorage.setItem('Admin-ColList', JSON.stringify(allStorage))
                }
            } else {
                // 如果缓存中已经保存了此用户此页面每列的状态就从缓存中取出来赋值给userColLost
                this.bsData.tableConfig.columns = _.cloneDeep(JSON.parse(localColList)[this.username][this.$route.path])
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.config-pack {
    /deep/ .el-divider--horizontal {
        margin: 10px 0 !important;
    }

    /deep/ .el-checkbox {
        display: block !important;
        margin-left: 4px;
    }
}

.listPage-container {
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
}

.vt-search {
    margin-bottom: 2px;
}

.table-content {
    background: #fff;
    padding: 10px;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .operate-btn {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.no-drop {
    cursor: no-drop;
}
</style>
