<template>
  <div class="app-container">
    <div class="page-header">
      <h3 class="page-title">工作台 · 数据看板</h3>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row" v-loading="loading">
      <el-col :span="6" v-for="card in statCards" :key="card.key">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{ background: card.bg }">
            <el-icon :size="22"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-value">
              {{ formatValue(card, stats[card.key]) }}
            </div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 今日来访 -->
    <el-card shadow="never" class="mt16">
      <template #header>
        <span class="card-title">今日来访预约</span>
      </template>
      <el-table :data="recentVisits" border>
        <el-table-column prop="visitorName" label="访客姓名" min-width="110" />
        <el-table-column prop="elderName" label="探访老人" min-width="110" />
        <el-table-column prop="visitTime" label="预约时间" min-width="160" />
        <el-table-column prop="purpose" label="来访事由" min-width="160" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="visitStatusType(scope.row.status)">
              {{ visitStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!recentVisits.length" description="今日暂无来访预约" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWorkbenchStats } from '@/api/workbench'

const loading = ref(false)
const stats = ref({})
const recentVisits = ref([])

const statCards = [
  { key: 'residentInHouse', label: '在住老人', unit: '人', icon: 'User', bg: '#e8f3ff' },
  { key: 'residentTotal', label: '累计入住', unit: '人', icon: 'HomeFilled', bg: '#e6f7ec' },
  { key: 'checkinToday', label: '今日入住', unit: '人', icon: 'SwitchButton', bg: '#fff4e6' },
  { key: 'visitToday', label: '今日来访', unit: '次', icon: 'Calendar', bg: '#f0e8ff' },
  { key: 'visitPending', label: '待接待', unit: '次', icon: 'Bell', bg: '#fff0f0' },
  { key: 'billUnpaid', label: '未缴账单', unit: '单', icon: 'Tickets', bg: '#fff7e6' },
  { key: 'billUnpaidAmount', label: '未缴金额', unit: '元', icon: 'Wallet', bg: '#fdeef0', money: true },
  { key: 'deviceOnline', label: '在线设备', unit: '台', icon: 'Cpu', bg: '#e8f7ff' },
  { key: 'alarmRuleEnabled', label: '启用报警规则', unit: '条', icon: 'Warning', bg: '#fdeef0' },
  { key: 'checkoutPending', label: '待处理退住', unit: '单', icon: 'Right', bg: '#fff4e6' },
  { key: 'taskPending', label: '待执行护理任务', unit: '项', icon: 'List', bg: '#e6f7ec' },
  { key: 'customerTotal', label: '客户总数', unit: '人', icon: 'UserFilled', bg: '#e8f3ff' }
]

function formatValue(card, v) {
  if (v == null) return '0'
  if (card.money) {
    return '¥' + Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return v
}

function visitStatusLabel(s) {
  return { 0: '待接待', 1: '已接待', 2: '已取消' }[s] ?? s
}
function visitStatusType(s) {
  return { 0: 'info', 1: 'success', 2: 'danger' }[s] ?? 'info'
}

function load() {
  loading.value = true
  getWorkbenchStats()
    .then((res) => {
      const data = res.data || {}
      stats.value = data
      recentVisits.value = data.recentVisits || []
      loading.value = false
    })
    .catch(() => { loading.value = false })
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.page-header { margin-bottom: 16px; }
.page-title { margin: 0; font-size: 18px; font-weight: 600; color: var(--el-text-color-primary); }
.mt16 { margin-top: 16px; }
.card-title { font-weight: 600; }
.stat-row { margin-bottom: 4px; }
.stat-card { border: none; }
.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}
.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  flex-shrink: 0;
}
.stat-body { min-width: 0; }
.stat-value { font-size: 22px; font-weight: 700; line-height: 1.2; color: var(--el-text-color-primary); }
.stat-label { font-size: 13px; color: var(--el-text-color-secondary); margin-top: 2px; }
</style>
