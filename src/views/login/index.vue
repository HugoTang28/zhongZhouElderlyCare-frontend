<template>
  <div class="login-container">
    <div class="login-blob blob-1"></div>
    <div class="login-blob blob-2"></div>
    <div class="login-blob blob-3"></div>
    <div class="login-card">
      <div class="login-brand">
        <img class="login-logo" src="@/assets/logo.png" alt="中州养老" />
        <h1>中州养老管理系统</h1>
        <p>专业 · 贴心 · 智慧的养老院管理平台</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="账号：admin">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登 录 中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref()
const loading = ref(false)
const loginForm = ref({
  username: 'admin',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

function handleLogin() {
  loginFormRef.value.validate((valid) => {
    if (!valid) return
    loading.value = true
    userStore
      .login(loginForm.value)
      .then(() => {
        ElMessage.success('登录成功，欢迎回来')
        router.push(route.query.redirect || '/')
      })
      .finally(() => {
        loading.value = false
      })
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1f2d3d 0%, #2b5876 50%, #4e4376 100%);
}

.login-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.45;
  pointer-events: none;
  animation: blob-float 14s ease-in-out infinite;
}

.blob-1 {
  width: 320px;
  height: 320px;
  top: -80px;
  left: -60px;
  background: radial-gradient(circle at 30% 30%, #4e9bff, #2b5876);
}

.blob-2 {
  width: 260px;
  height: 260px;
  bottom: -70px;
  right: -50px;
  background: radial-gradient(circle at 70% 70%, #b06ab3, #4568dc);
  animation-delay: -4s;
}

.blob-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 18%;
  background: radial-gradient(circle at 50% 50%, #43e97b, #38f9d7);
  animation-delay: -8s;
}

@keyframes blob-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 25px) scale(0.95);
  }
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.login-brand {
  text-align: center;
  margin-bottom: 32px;

  .login-logo {
    width: 56px;
    height: 56px;
    object-fit: contain;
    border-radius: 12px;
  }

  h1 {
    margin: 12px 0 8px;
    font-size: 24px;
    color: #303133;
  }

  p {
    font-size: 13px;
    color: #909399;
  }
}

.login-btn {
  width: 100%;
  letter-spacing: 4px;
}
</style>
