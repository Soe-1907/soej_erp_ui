<template>
  <div class="data-cleanup-page">
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">数据清理</span>
          <span class="card-desc">清空除用户账号与清理配置外的全部业务数据，便于软件测试</span>
        </div>
      </template>

      <el-alert
        type="warning"
        show-icon
        :closable="false"
        title="危险操作"
        description="立即清空将删除所有主数据、单据、库存、审核与结算记录，且不可恢复。仅保留 sys_user 与定时配置。"
        class="warn-alert"
      />

      <el-descriptions v-if="config" :column="1" border class="status-block">
        <el-descriptions-item label="上次执行">{{ config.lastRunAt || '—' }}</el-descriptions-item>
        <el-descriptions-item label="下次执行">{{ config.nextRunAt || '—' }}</el-descriptions-item>
        <el-descriptions-item label="上次结果">{{ config.lastResult || '—' }}</el-descriptions-item>
      </el-descriptions>

      <el-form
        :model="form"
        label-width="120px"
        class="config-form"
        @submit.prevent
      >
        <el-form-item label="定时清库">
          <el-switch v-model="form.enabled" active-text="启用" inactive-text="关闭" />
        </el-form-item>
        <el-form-item label="清库间隔">
          <el-select v-model="form.intervalHours" style="width: 200px">
            <el-option :value="2" label="每 2 小时" />
            <el-option :value="6" label="每 6 小时" />
            <el-option :value="12" label="每 12 小时" />
            <el-option :value="24" label="每 24 小时" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存配置</el-button>
          <el-button type="danger" plain :loading="executing" @click="handleExecute">
            立即清空
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  executeDataCleanupApi,
  getDataCleanupConfigApi,
  saveDataCleanupConfigApi,
  type DataCleanupConfigVO,
} from '@/api/system/dataCleanup'

const CONFIRM_TEXT = 'RESET_ALL_DATA'

const config = ref<DataCleanupConfigVO | null>(null)
const saving = ref(false)
const executing = ref(false)

const form = reactive({
  enabled: false,
  intervalHours: 24,
})

async function loadConfig() {
  const res = (await getDataCleanupConfigApi()) as { data?: DataCleanupConfigVO }
  const data = res.data
  if (!data) {
    return
  }
  config.value = data
  form.enabled = data.enabled
  form.intervalHours = data.intervalHours ?? 24
}

async function handleSave() {
  saving.value = true
  try {
    await saveDataCleanupConfigApi({
      enabled: form.enabled,
      intervalHours: form.intervalHours,
    })
    ElMessage.success('配置已保存')
    await loadConfig()
  } finally {
    saving.value = false
  }
}

async function handleExecute() {
  try {
    const { value } = await ElMessageBox.prompt(
      '此操作将清空全部业务数据且不可恢复。请输入确认文案后继续。',
      '立即清空',
      {
        confirmButtonText: '确认清空',
        cancelButtonText: '取消',
        inputPlaceholder: CONFIRM_TEXT,
        inputPattern: new RegExp(`^${CONFIRM_TEXT}$`),
        inputErrorMessage: `请输入 ${CONFIRM_TEXT}`,
        type: 'warning',
      }
    )
    if (value !== CONFIRM_TEXT) {
      ElMessage.warning(`请输入 ${CONFIRM_TEXT}`)
      return
    }
  } catch {
    return
  }

  executing.value = true
  try {
    await executeDataCleanupApi({ confirmText: CONFIRM_TEXT })
    ElMessage.success('清库完成')
    await loadConfig()
  } finally {
    executing.value = false
  }
}

onMounted(() => {
  loadConfig().catch(() => {})
})
</script>

<style scoped>
.data-cleanup-page {
  max-width: 720px;
}

.config-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.card-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.warn-alert {
  margin-bottom: 20px;
}

.status-block {
  margin-bottom: 24px;
}

.config-form {
  margin-top: 8px;
}
</style>
