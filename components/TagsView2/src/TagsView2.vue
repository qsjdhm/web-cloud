<template lang="html">
    <div>
        <el-button type="primary">主要按钮</el-button>
        <el-input v-model="input" placeholder="请输入内容" />
    </div>
</template>

<script>
export default {
  name: 'TagsView2',
  data () {
    return {
        input: 11
    }
  },
  methods: {
  },
  mounted () {
    console.info("TagsView2")
  }
}
</script>

<style lang="scss" scoped>
</style>
