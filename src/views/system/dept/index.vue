<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd()">新增</el-button>
        </el-col>
      </el-row>

      <el-table :data="deptList" v-loading="loading" border row-key="id"
        :tree-props="{ children: 'children' }" default-expand-all>
        <el-table-column prop="deptName" label="部门名称" min-width="180" />
        <el-table-column prop="leader" label="负责人" width="120" align="center" />
        <el-table-column prop="phone" label="联系电话" width="140" align="center" />
        <el-table-column prop="sort" label="排序" width="70" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="160" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)">新增</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="父部门" prop="parentId">
          <el-tree-select v-model="form.parentId" :data="deptList"
            :props="{ label: 'deptName', children: 'children' }" value-key="id"
            placeholder="选择父部门" check-strictly style="width:100%" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" style="width:100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">正常</el-radio>
            <el-radio :value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
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
import { listDept, getDept, addDept, updateDept, delDept } from '@/api/system'

const loading = ref(false)
const open = ref(false)
const title = ref('')
const deptList = ref([])

const form = ref({})
const rules = {
  deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '父部门不能为空', trigger: 'change' }]
}
const formRef = ref()

function getList() {
  loading.value = true
  listDept().then(res => {
    deptList.value = res.data || []
    loading.value = false
  })
}

function reset() {
  form.value = { id: undefined, parentId: 0, sort: 0, status: 0 }
  formRef.value?.clearValidate()
}

function handleAdd(row) {
  reset()
  if (row && row.id) form.value.parentId = row.id
  open.value = true
  title.value = '新增部门'
}

function handleUpdate(row) {
  reset()
  getDept(row.id).then(res => {
    form.value = { ...res.data }
    open.value = true
    title.value = '编辑部门'
  })
}

function handleDelete(row) {
  ElMessageBox.confirm('确认删除部门"' + row.deptName + '"吗？', '提示', { type: 'warning' }).then(() => {
    delDept(row.id).then(() => { ElMessage.success('删除成功'); getList() })
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
      updateDept(data).then(() => { ElMessage.success('修改成功'); open.value = false; getList() })
    } else {
      addDept(data).then(() => { ElMessage.success('新增成功'); open.value = false; getList() })
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.mb8 { margin-bottom: 12px; }
</style>
