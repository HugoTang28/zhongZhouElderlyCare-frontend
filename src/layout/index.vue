<template>
  <div class="layout-wrapper">
    <!-- 侧边栏 -->
    <aside class="layout-sidebar">
      <div class="logo">
        <img class="logo-img" src="@/assets/logo.png" alt="中州养老" />
        <span v-show="!isCollapse">中州养老</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          background-color="#001529"
          text-color="#bfcbd9"
          active-text-color="#409eff"
          router
        >
          <sidebar-item
            v-for="route in sidebarRouters"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </aside>

    <!-- 主区域 -->
    <div class="layout-main">
      <header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.meta?.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="28" :src="avatar">
                {{ name.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ name }}</span>
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
import SidebarItem from './components/SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const { sidebarRouters } = storeToRefs(permissionStore)
const { name, avatar } = storeToRefs(userStore)

const isCollapse = ref(false)
const activeMenu = computed(() => route.path)
const breadcrumbs = computed(() => route.matched.filter((item) => item.meta?.title))

function handleCommand(command) {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' }).then(() => {
      userStore.logout().then(() => {
        router.push('/login')
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.layout-wrapper {
  display: flex;
  height: 100%;
}

.layout-sidebar {
  width: v-bind('isCollapse ? "64px" : "210px"');
  background: #001529;
  transition: width 0.28s;
  display: flex;
  flex-direction: column;

  .logo {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    background: #002140;
    overflow: hidden;
    white-space: nowrap;

    .logo-img {
      width: 28px;
      height: 28px;
      object-fit: contain;
      border-radius: 6px;
    }
  }

  .el-menu {
    border-right: none;
  }
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  height: 56px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .collapse-btn {
      font-size: 18px;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;

    .user-name {
      font-size: 14px;
      color: #303133;
    }
  }
}

.layout-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: #f0f2f5;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
