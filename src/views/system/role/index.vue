<template>
  <div class="app-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable style="width:180px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="queryParams.roleKey" placeholder="请输入权限字符" clearable style="width:180px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width:120px">
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
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" v-loading="loading" border>
        <el-table-column label="角色ID" prop="id" width="90" align="center" />
        <el-table-column label="角色名称" prop="roleName" min-width="140" />
        <el-table-column label="权限字符" prop="roleKey" min-width="140" />
        <el-table-column label="显示顺序" prop="sort" width="100" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="160" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-show="total > 0" class="pagination" :total="total"
        :current-page="queryParams.pageNum" :page-size="queryParams.pageSize"
        layout="total, prev, pager, next" @current-change="getList" />
    </el-card>

    <!-- 新增/编辑（含菜单权限） -->
    <el-dialog :title="title" v-model="open" width="720px" append-to-body>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限字符" prop="roleKey">
              <el-input v-model="form.roleKey" placeholder="如 admin / nursingManager" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sort">
              <el-input-number v-model="form.sort" :min="0" controls-position="right" style="width:100%" />
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
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单权限">
              <el-tree ref="menuTreeRef" :data="menuTreeData"
                :props="{ label: 'menuName', children: 'children' }" node-key="id"
                show-checkbox default-expand-all highlight-current
                :default-checked-keys="menuCheckedKeys" />
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
import { listRole, getRole, addRole, updateRole, delRole, menuTree } from '@/api/system'

const loading = ref(false)
const open = ref(false)
const title = ref('')
const total = ref(0)
const roleList = ref([])
const menuTreeData = ref([])
const menuCheckedKeys = ref([])
const menuTreeRef = ref()

const queryParams = reactive({ pageNum: 1, pageSize: 10, roleName: '', roleKey: '', status: undefined })
const form = ref({})
const rules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }]
}
const queryRef = ref()
const formRef = ref()

function getList(page) {
  if (page) queryParams.pageNum = page
  loading.value = true
  listRole(queryParams).then(res => {
    const pageObj = res.data
    roleList.value = pageObj.records || pageObj
    total.value = pageObj.total || 0
    loading.value = false
  })
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  handleQuery()
}

function loadMenuTree() {
  menuTree().then(res => { menuTreeData.value = res.data })
}

function reset() {
  form.value = { id: undefined, sort: 0, status: 0, menuIds: [] }
  menuCheckedKeys.value = []
  formRef.value?.clearValidate()
}

function handleAdd() {
  reset()
  open.value = true
  title.value = '新增角色'
}

function handleUpdate(row) {
  reset()
  getRole(row.id).then(res => {
    const { role, menuIds } = res.data
    form.value = { ...role }
    menuCheckedKeys.value = menuIds || []
    open.value = true
    title.value = '编辑角色'
  })
}

function handleDelete(row) {
  if (row.roleKey === 'admin') {
    ElMessage.warning('超级管理员角色不可删除')
    return
  }
  ElMessageBox.confirm('确认删除角色"' + row.roleName + '"吗？', '提示', { type: 'warning' }).then(() => {
    delRole(row.id).then(() => { ElMessage.success('删除成功'); getList() })
  })
}

function cancel() {
  open.value = false
}

function submitForm() {
  formRef.value.validate(valid => {
    if (!valid) return
    // 合并勾选 + 半选父节点，避免菜单树断裂
    const checked = menuTreeRef.value.getCheckedKeys().concat(menuTreeRef.value.getHalfCheckedKeys())
    const data = { ...form.value, menuIds: checked }
    if (data.id) {
      updateRole(data).then(() => { ElMessage.success('修改成功'); open.value = false; getList() })
    } else {
      addRole(data).then(() => { ElMessage.success('新增成功'); open.value = false; getList() })
    }
  })
}

onMounted(() => {
  getList()
  loadMenuTree()
})
</script>

<style scoped>
.search-card { margin-bottom: 12px; }
.mb8 { margin-bottom: 12px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
