<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable style="width:180px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width:120px">
            <el-option label="正常" :value="0" />
            <el-option label="停用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd()">新增</el-button>
        </el-col>
      </el-row>

      <el-table :data="menuList" v-loading="loading" border row-key="id"
        :tree-props="{ children: 'children' }" default-expand-all>
        <el-table-column prop="menuName" label="菜单名称" min-width="160" />
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="scope">
            <el-icon v-if="scope.row.icon"><component :is="scope.row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="70" align="center" />
        <el-table-column prop="perms" label="权限标识" min-width="160" />
        <el-table-column prop="component" label="组件路径" min-width="180" />
        <el-table-column label="类型" width="80" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.menuType === 'M'" type="warning">目录</el-tag>
            <el-tag v-else-if="scope.row.menuType === 'C'" type="success">菜单</el-tag>
            <el-tag v-else type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)">新增</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="父菜单" prop="parentId">
          <el-tree-select v-model="form.parentId" :data="menuTreeOptions"
            :props="{ label: 'menuName', children: 'children' }" value-key="id"
            placeholder="选择父菜单" check-strictly style="width:100%" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="form.menuType">
            <el-radio value="M">目录</el-radio>
            <el-radio value="C">菜单</el-radio>
            <el-radio value="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" :min="0" controls-position="right" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="如 user" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="如 system/user/index" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="perms">
              <el-input v-model="form.perms" placeholder="如 system:user:list" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" placeholder="如 User" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :value="0">正常</el-radio>
                <el-radio :value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否可见" prop="visible">
              <el-radio-group v-model="form.visible">
                <el-radio :value="0">显示</el-radio>
                <el-radio :value="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listMenu, getMenu, addMenu, updateMenu, delMenu, menuTreeselect } from '@/api/system'

const loading = ref(false)
const open = ref(false)
const title = ref('')
const menuList = ref([])
const menuTreeOptions = ref([])

const queryParams = reactive({ menuName: '', status: undefined })
const form = ref({})
const rules = {
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '父菜单不能为空', trigger: 'change' }]
}
const queryRef = ref()
const formRef = ref()

// 平铺列表转树
function buildTree(list) {
  const map = {}
  const roots = []
  list.forEach(m => { map[m.id] = { ...m, children: [] } })
  list.forEach(m => {
    if (m.parentId && map[m.parentId]) {
      map[m.parentId].children.push(map[m.id])
    } else {
      roots.push(map[m.id])
    }
  })
  return roots
}

function getList() {
  loading.value = true
  listMenu(queryParams).then(res => {
    menuList.value = buildTree(res.data || [])
    loading.value = false
  })
}

function loadMenuTreeOptions() {
  menuTreeselect().then(res => { menuTreeOptions.value = res.data })
}

function handleQuery() {
  getList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  getList()
}

function reset() {
  form.value = { id: undefined, parentId: 0, menuType: 'C', sort: 0, status: 0, visible: 0, icon: '' }
  formRef.value?.clearValidate()
}

function handleAdd(row) {
  reset()
  if (row && row.id) form.value.parentId = row.id
  open.value = true
  title.value = '新增菜单'
}

function handleUpdate(row) {
  reset()
  getMenu(row.id).then(res => {
    form.value = { ...res.data }
    open.value = true
    title.value = '编辑菜单'
  })
}

function handleDelete(row) {
  ElMessageBox.confirm('确认删除菜单"' + row.menuName + '"吗？', '提示', { type: 'warning' }).then(() => {
    delMenu(row.id).then(() => { ElMessage.success('删除成功'); getList(); loadMenuTreeOptions() })
  })
}

function cancel() {
  open.value = false
}

function submitForm() {
  formRef.value.validate(valid => {
    if (!valid) return
    const data = { ...form.value }
    if (data.id) {
      updateMenu(data).then(() => { ElMessage.success('修改成功'); open.value = false; getList(); loadMenuTreeOptions() })
    } else {
      addMenu(data).then(() => { ElMessage.success('新增成功'); open.value = false; getList(); loadMenuTreeOptions() })
    }
  })
}

onMounted(() => {
  getList()
  loadMenuTreeOptions()
})
</script>

<style scoped>
.search-card { margin-bottom: 12px; }
.mb8 { margin-bottom: 12px; }
</style>
