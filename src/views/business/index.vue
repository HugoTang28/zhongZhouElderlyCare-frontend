<template>
  <div class="app-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h3 class="page-title">{{ pageTitle }}</h3>
    </div>

    <!-- 未配置提示 -->
    <el-empty v-if="!cfg" description="该模块尚未配置" />

    <template v-else>
      <!-- 搜索栏 -->
      <el-card shadow="never" class="search-card">
        <el-form :model="queryParams" ref="queryRef" :inline="true">
          <el-form-item
            v-for="f in searchFields"
            :key="f.prop"
            :label="f.label"
            :prop="f.prop"
          >
            <el-select
              v-if="f.type === 'select'"
              v-model="queryParams[f.prop]"
              :placeholder="f.label"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="(label, val) in f.dict"
                :key="val"
                :label="label"
                :value="Number(val)"
              />
            </el-select>
            <el-input
              v-else
              v-model="queryParams[f.prop]"
              :placeholder="'请输入' + f.label"
              clearable
              style="width: 180px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
      <el-card shadow="never">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>

        <el-table :data="list" v-loading="loading" border>
          <el-table-column
            v-for="col in cfg.columns"
            :key="col.prop"
            :label="col.label"
            :min-width="col.minWidth"
            :width="col.width"
            :align="col.align || 'left'"
          >
            <template #default="scope">
              <el-tag v-if="col.type === 'tag'" :type="tagTypeOf(col, scope.row[col.prop])">
                {{ dictLabel(col, scope.row[col.prop]) }}
              </el-tag>
              <span v-else>{{ scope.row[col.prop] != null ? scope.row[col.prop] : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template #default="scope">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-show="total > 0"
          class="pagination"
          :total="total"
          :current-page="queryParams.pageNum"
          :page-size="queryParams.pageSize"
          layout="total, prev, pager, next"
          @current-change="getList"
        />
      </el-card>

      <!-- 新增/编辑 -->
      <el-dialog :title="title" v-model="open" width="640px" append-to-body>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12" v-for="f in cfg.form" :key="f.prop">
              <el-form-item :label="f.label" :prop="f.prop">
                <el-date-picker
                  v-if="f.type === 'datetime'"
                  v-model="form[f.prop]"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择"
                  style="width: 100%"
                />
                <el-select
                  v-else-if="f.type === 'select'"
                  v-model="form[f.prop]"
                  :placeholder="'请选择' + f.label"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(label, val) in f.dict"
                    :key="val"
                    :label="label"
                    :value="Number(val)"
                  />
                </el-select>
                <el-input
                  v-else-if="f.type === 'number'"
                  v-model="form[f.prop]"
                  type="number"
                  :placeholder="'请输入' + f.label"
                  style="width: 100%"
                />
                <el-input
                  v-else-if="f.type === 'textarea'"
                  v-model="form[f.prop]"
                  type="textarea"
                  :rows="3"
                  :placeholder="'请输入' + f.label"
                />
                <el-input
                  v-else
                  v-model="form[f.prop]"
                  :placeholder="'请输入' + f.label"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listBiz, getBiz, addBiz, editBiz, delBiz } from '@/api/business'
import { bizConfig } from '@/views/business/config'

const route = useRoute()

const loading = ref(false)
const open = ref(false)
const title = ref('')
const total = ref(0)
const list = ref([])
const cfg = ref(null)
const moduleKey = ref('')
const pageTitle = ref('')

const queryParams = ref({ pageNum: 1, pageSize: 10 })
const form = ref({})
const rules = ref({})
const queryRef = ref()
const formRef = ref()

// 搜索字段元信息（结合 form 配置，确定 select / text）
const searchFields = computed(() => {
  if (!cfg.value) return []
  const formMap = {}
  cfg.value.form.forEach((f) => { formMap[f.prop] = f })
  return cfg.value.search.map((prop) => formMap[prop] || { prop, label: prop })
})

function dictLabel(col, val) {
  if (!col.dict) return val
  return col.dict[val] != null ? col.dict[val] : (val != null ? val : '')
}

function tagTypeOf(col, val) {
  if (!col.tagType) return 'info'
  const t = col.tagType[val]
  return (t === '' || t === undefined || t === null) ? undefined : t
}

function cleanParams(obj) {
  const r = {}
  for (const k in obj) {
    const v = obj[k]
    if (v !== null && v !== undefined && v !== '') r[k] = v
  }
  return r
}

function buildEmptyForm() {
  const f = {}
  cfg.value.form.forEach((item) => {
    if (item.type === 'select') {
      f[item.prop] = item.default !== undefined ? item.default : undefined
    } else if (item.type === 'number') {
      f[item.prop] = null
    } else if (item.type === 'datetime') {
      f[item.prop] = null
    } else {
      f[item.prop] = undefined
    }
  })
  return f
}

function initModule() {
  const c = bizConfig[route.path] || null
  cfg.value = c
  if (!c) {
    list.value = []
    total.value = 0
    return
  }
  moduleKey.value = c.moduleKey
  pageTitle.value = route.meta?.title || c.moduleKey

  // 初始化查询参数
  const q = { pageNum: 1, pageSize: 10 }
  c.search.forEach((prop) => {
    const meta = c.form.find((f) => f.prop === prop)
    q[prop] = undefined
    void meta
  })
  queryParams.value = q

  // 初始化校验规则
  const r = {}
  c.form.forEach((f) => {
    if (f.required) {
      r[f.prop] = [{ required: true, message: f.label + '不能为空', trigger: 'blur' }]
    }
  })
  rules.value = r

  getList()
}

function getList(page) {
  if (!moduleKey.value) return
  if (page) queryParams.value.pageNum = page
  loading.value = true
  listBiz(moduleKey.value, cleanParams({ ...queryParams.value }))
    .then((res) => {
      const pageObj = res.data
      list.value = pageObj.records || []
      total.value = pageObj.total || 0
      loading.value = false
    })
    .catch(() => { loading.value = false })
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  // 重新置空（resetFields 对动态字段可能不生效）
  cfg.value.search.forEach((prop) => { queryParams.value[prop] = undefined })
  handleQuery()
}

function reset() {
  form.value = buildEmptyForm()
  formRef.value?.clearValidate()
}

function handleAdd() {
  reset()
  open.value = true
  title.value = '新增' + pageTitle.value
}

function handleUpdate(row) {
  getBiz(moduleKey.value, row.id).then((res) => {
    const data = res.data || {}
    const f = buildEmptyForm()
    f.id = data.id
    cfg.value.form.forEach((item) => {
      if (data[item.prop] !== undefined && data[item.prop] !== null) {
        f[item.prop] = data[item.prop]
      }
    })
    form.value = f
    open.value = true
    title.value = '编辑' + pageTitle.value
  })
}

function handleDelete(row) {
  ElMessageBox.confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
    delBiz(moduleKey.value, row.id).then(() => {
      ElMessage.success('删除成功')
      getList()
    })
  })
}

function cancel() {
  open.value = false
}

function normalizeForm(data) {
  cfg.value.form.forEach((item) => {
    let v = data[item.prop]
    if (v === '') v = null
    if (item.type === 'number' && v != null) {
      v = Number(v)
    }
    data[item.prop] = v
  })
  return data
}

function submitForm() {
  formRef.value.validate((valid) => {
    if (!valid) return
    const data = normalizeForm({ ...form.value })
    if (data.id) {
      editBiz(moduleKey.value, data).then(() => {
        ElMessage.success('修改成功')
        open.value = false
        getList()
      })
    } else {
      delete data.id
      addBiz(moduleKey.value, data).then(() => {
        ElMessage.success('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

onMounted(() => {
  initModule()
})

// 路由复用（18 个业务页共用此组件）时重新初始化
watch(() => route.path, () => {
  initModule()
})
</script>

<style scoped>
.page-header { margin-bottom: 12px; }
.page-title { margin: 0; font-size: 18px; font-weight: 600; color: var(--el-text-color-primary); }
.search-card { margin-bottom: 12px; }
.mb8 { margin-bottom: 12px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
