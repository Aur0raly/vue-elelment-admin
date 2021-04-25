<template>
<div>
<!--  Home 组件-->
  <el-button @click="quit" type="info">退出登录</el-button>
</div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    }
  }
}
</script>

<style scoped>

</style>
