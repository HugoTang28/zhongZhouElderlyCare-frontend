<template>
  <div class="error-page">
    <h1>404</h1>
    <p>页面不存在或没有访问权限</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.error-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #f0f2f5;
}

h1 {
  font-size: 72px;
  color: #409eff;
}

p {
  color: #909399;
}
</style>
