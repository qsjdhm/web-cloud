<template lang="html">
    <div>
        <el-button type="primary">主要按钮22</el-button>
        <el-input v-model="input" placeholder="请输入内容" />
        <el-rate v-model="value1"></el-rate>
    </div>
</template>

<script>
export default {
  name: 'TagsView2',
  data () {
    return {
        value1: null,
        input: 11
    }
  },
  methods: {
  },
  mounted () {
    console.info("TagsView222")
  }
}
</script>

<style lang="scss" scoped>
</style>
