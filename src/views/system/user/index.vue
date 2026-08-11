<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable style="width:180px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="queryParams.nickName" placeholder="请输入昵称" clearable style="width:180px"
            @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width:120px">
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

    <!-- 表格 -->
    <el-card shadow="never">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" v-loading="loading" border>
        <el-table-column label="用户ID" prop="id" width="90" align="center" />
        <el-table-column label="用户名" prop="username" min-width="120" />
        <el-table-column label="昵称" prop="nickName" min-width="120" />
        <el-table-column label="手机号" prop="phone" min-width="130" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="160" />
        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button link type="primary" icon="Key" @click="handleResetPwd(scope.row)">重置密码</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-show="total > 0" class="pagination" :total="total"
        :current-page="queryParams.pageNum" :page-size="queryParams.pageSize"
        layout="total, prev, pager, next" @current-change="getList" />
    </el-card>

    <!-- 新增/编辑 -->
    <el-dialog :title="title" v-model="open" width="620px" append-to-body>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" :disabled="form.id !== undefined" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!form.id">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <el-tree-select v-model="form.deptId" :data="deptOptions"
                :props="{ label: 'deptName', children: 'children' }" value-key="id"
                placeholder="请选择部门" check-strictly style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :value="0">男</el-radio>
                <el-radio :value="1">女</el-radio>
              </el-radio-group>
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
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width:100%">
                <el-option v-for="item in roleOptionsList" :key="item.id" :label="item.roleName" :value="item.id" />
              </el-select>
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
import {
  listUser, getUser, addUser, updateUser, delUser, resetUserPwd, roleOptions, listDept
} from '@/api/system'

const loading = ref(false)
const open = ref(false)
const title = ref('')
const total = ref(0)
const userList = ref([])
const deptOptions = ref([])
const roleOptionsList = ref([])

const queryParams = reactive({ pageNum: 1, pageSize: 10, username: '', nickName: '', status: undefined })
const form = ref({})
const rules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }]
}
const queryRef = ref()
const formRef = ref()

function getList(page) {
  if (page) queryParams.pageNum = page
  loading.value = true
  listUser(queryParams).then(res => {
    const pageObj = res.data
    userList.value = pageObj.records || pageObj
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

function loadDept() {
  listDept().then(res => { deptOptions.value = res.data })
}

function loadRoles() {
  roleOptions().then(res => { roleOptionsList.value = res.data })
}

function reset() {
  form.value = { id: undefined, sex: 0, status: 0, roleIds: [] }
  formRef.value?.clearValidate()
}

function handleAdd() {
  reset()
  open.value = true
  title.value = '新增用户'
}

function handleUpdate(row) {
  reset()
  getUser(row.id).then(res => {
    const { user, roleIds } = res.data
    form.value = { ...user, roleIds: roleIds || [] }
    open.value = true
    title.value = '编辑用户'
  })
}

function handleDelete(row) {
  ElMessageBox.confirm('确认删除用户"' + row.username + '"吗？', '提示', { type: 'warning' }).then(() => {
    delUser(row.id).then(() => { ElMessage.success('删除成功'); getList() })
  })
}

function handleResetPwd(row) {
  ElMessageBox.prompt('请输入新密码（5-20位）', '重置密码 - ' + row.username, {
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: '密码长度需为 5-20 位'
  }).then(({ value }) => {
    resetUserPwd(row.id, value).then(() => { ElMessage.success('密码重置成功') })
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
      updateUser(data).then(() => { ElMessage.success('修改成功'); open.value = false; getList() })
    } else {
      addUser(data).then(() => { ElMessage.success('新增成功'); open.value = false; getList() })
    }
  })
}

onMounted(() => {
  getList()
  loadDept()
  loadRoles()
})
</script>

<style scoped>
.search-card { margin-bottom: 12px; }
.mb8 { margin-bottom: 12px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
