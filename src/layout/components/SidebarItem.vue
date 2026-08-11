<template>
  <template v-if="!item.hidden">
    <!-- 无子菜单：直接渲染菜单项 -->
    <el-menu-item v-if="!hasChildren" :index="resolvePath(singleChild.path)">
      <el-icon v-if="menuIcon"><component :is="menuIcon" /></el-icon>
      <template #title>{{ menuTitle }}</template>
    </el-menu-item>

    <!-- 有子菜单：渲染子菜单组 -->
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(item.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SidebarItem' })

const props = defineProps({
  item: { type: Object, required: true },
  basePath: { type: String, default: '' }
})

const visibleChildren = computed(() =>
  (props.item.children || []).filter((child) => !child.hidden)
)

const hasChildren = computed(() => visibleChildren.value.length > 0)

const singleChild = computed(() =>
  hasChildren.value ? visibleChildren.value[0] : props.item
)

const menuTitle = computed(() =>
  hasChildren.value
    ? singleChild.value.meta?.title
    : props.item.meta?.title
)

const menuIcon = computed(() =>
  hasChildren.value ? singleChild.value.meta?.icon : props.item.meta?.icon
)

function resolvePath(routePath) {
  if (routePath.startsWith('/')) {
    return routePath
  }
  return props.basePath.replace(/\/$/, '') + '/' + routePath
}
</script>
