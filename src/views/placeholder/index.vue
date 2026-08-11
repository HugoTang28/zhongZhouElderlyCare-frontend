<template>
  <div class="placeholder">
    <el-empty :description="`${title} 模块开发中，敬请期待`">
      <template #image>
        <el-icon :size="80" color="#c0c4cc"><Tools /></el-icon>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta?.title || '当前')
</script>

<style scoped>
.placeholder {
  background: #fff;
  border-radius: 8px;
  height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
