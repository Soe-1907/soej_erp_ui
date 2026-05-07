<template>
  <div class="user-centre-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="profile-card" shadow="never">
          <template #header>
            <span>个人信息</span>
          </template>
          <div class="avatar-wrapper">
            <el-avatar
              :size="96"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户姓名">
              {{ userInfo?.realName || userInfo?.userName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ userInfo?.mobile || '暂无' }}
            </el-descriptions-item>
            <el-descriptions-item label="所属角色">
              {{ userInfo?.roleName || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="创建日期">
              {{ userInfo?.createAt || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <span>修改密码</span>
          </template>
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            label-width="100px"
            class="password-form"
          >
            <el-form-item label="旧密码" required>
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入旧密码"
              />
            </el-form-item>
            <el-form-item label="新密码" required>
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>
            <el-form-item label="确认密码" required>
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请确认新密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="handleSave">
                保存
              </el-button>
              <el-button @click="handleClose">
                关闭
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { changePasswordApi } from '@/api/product/user'
import { useBreadcrumb } from '@/hooks/Brand/Breadcrumb/useBreadcrumb'
import { useUserStore } from '@/stores/user'

const PASSWORD_MAX_LENGTH = 16
const PASSWORD_PATTERN = /^[A-Za-z0-9]+$/

const userStore = useUserStore()
const { closeCurrentTab } = useBreadcrumb()

const userInfo = computed(() => userStore.userInfo)
const passwordFormRef = ref<FormInstance>()
const saving = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showValidationError = (message: string) => {
  ElMessage.error(message)
  return false
}

const validateRequired = (value: string, message: string) => {
  if (!value) {
    return showValidationError(message)
  }
  return true
}

const validateLength = (value: string, message: string) => {
  if (value.length > PASSWORD_MAX_LENGTH) {
    return showValidationError(message)
  }
  return true
}

const validateFormat = (value: string, message: string) => {
  if (!PASSWORD_PATTERN.test(value)) {
    return showValidationError(message)
  }
  return true
}

const validatePasswordForm = () => {
  if (!validateRequired(passwordForm.oldPassword, '旧密码必填，请重新输入。')) return false
  if (!validateLength(passwordForm.oldPassword, '旧密码长度错误，请重新输入。')) return false
  if (!validateFormat(passwordForm.oldPassword, '旧密码格式错误，请重新输入。')) return false

  if (!validateRequired(passwordForm.newPassword, '新密码必填，请重新输入。')) return false
  if (passwordForm.newPassword === passwordForm.oldPassword) {
    return showValidationError('新密码与旧密码重复，请重新输入。')
  }
  if (!validateLength(passwordForm.newPassword, '新密码长度错误，请重新输入。')) return false
  if (!validateFormat(passwordForm.newPassword, '新密码格式错误，请重新输入。')) return false

  if (!validateRequired(passwordForm.confirmPassword, '确认密码必填，请重新输入。')) return false
  if (passwordForm.confirmPassword !== passwordForm.newPassword) {
    return showValidationError('确认密码与新密码不一致，请重新输入。')
  }
  if (!validateLength(passwordForm.confirmPassword, '确认密码长度错误，请重新输入。')) return false
  if (!validateFormat(passwordForm.confirmPassword, '确认密码格式错误，请重新输入。')) return false

  return true
}

const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}

const handleSave = async () => {
  if (!validatePasswordForm()) {
    return
  }

  saving.value = true
  try {
    await changePasswordApi({ ...passwordForm })
    ElMessage.success('修改成功')
    resetPasswordForm()
  } catch {
    // 请求拦截器会展示后端返回的错误提示。
  } finally {
    saving.value = false
  }
}

const handleClose = () => {
  resetPasswordForm()
  closeCurrentTab()
}
</script>

<style scoped>
.user-centre-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.profile-card,
.password-form {
  height: 100%;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin: 12px 0 24px;
}

.password-form {
  max-width: 560px;
}
</style>
