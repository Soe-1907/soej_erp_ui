<template>
  <div class="navbar-wrapper">
    <!-- 第一行：面包屑导航 + 用户信息 -->
    <div class="navbar">
      <div class="navbar-left">
        <Breadcrumb />
      </div>

      <div class="navbar-right">
        <!-- 通知铃铛 -->
        <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
          <el-icon size="23" class="notification-icon" @click="handleNotificationClick">
            <Bell />
          </el-icon>
        </el-badge>

        <el-dialog
          v-model="systemMessageVisible"
          title="系统消息"
          width="620px"
          class="system-message-dialog"
        >
          <div v-loading="systemMessageLoading" class="system-message-body">
            <el-empty
              v-if="systemMessages.length === 0"
              description="暂无消息内容"
              :image-size="70"
            />
            <div v-else :class="['message-list', { expanded: systemMessageExpanded }]">
              <div
                v-for="message in systemMessages"
                :key="message.id"
                class="message-item"
              >
                <span class="message-content">{{ message.content }}</span>
              </div>
            </div>
            <div
              v-if="!systemMessageExpanded && systemMessages.length >= 10"
              class="expand-message"
              @click="handleExpandMessages"
            >
              展开全部消息
            </div>
          </div>
        </el-dialog>

        <!-- 头像 + 用户名 + 下拉菜单 -->
        <el-dropdown @command="handleCommand" trigger="hover">
          <div class="user-info">
            <el-avatar shape="square" :size="40"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
            <span class="username">{{ userInfo?.userName }}</span>
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><UserFilled /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 第二行：标签页导航 -->
    <div class="tag-breadcrumb-wrapper">
      <TagBreadcrumb />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { ArrowDown, UserFilled, SwitchButton } from '@element-plus/icons-vue'
import { countSystemMessagesApi, querySystemMessagesApi } from '@/api/product/systemMessage'
import { ROLE_WAREHOUSE_SPECIALIST } from '@/constants/role'
import { useUserStore } from '@/stores/user'
import { useLogin } from '@/hooks/useLogin'
import type { SystemMessageVO } from '@/type/systemMessage'
import Bell from '@/components/icons/BellIcon.vue'
import Breadcrumb from './Breadcrumb.vue'
import TagBreadcrumb from './TagBreadcrumb.vue'

const userStore = useUserStore()
const router = useRouter()
const { handleLogout: logout } = useLogin()

const userInfo = computed(() => userStore.userInfo)
const isWarehouseSpecialist = computed(() => userInfo.value?.roleCode === ROLE_WAREHOUSE_SPECIALIST)
const notificationCount = ref(0)
const systemMessageVisible = ref(false)
const systemMessageExpanded = ref(false)
const systemMessageLoading = ref(false)
const systemMessages = ref<SystemMessageVO[]>([])

const refreshMessageCount = async () => {
  if (!isWarehouseSpecialist.value) {
    notificationCount.value = 0
    systemMessages.value = []
    return
  }
  try {
    const res = await countSystemMessagesApi()
    notificationCount.value = Number(res.data ?? 0)
  } catch {
    notificationCount.value = 0
  }
}

const fetchSystemMessages = async (expanded = false) => {
  if (!isWarehouseSpecialist.value) {
    systemMessages.value = []
    return
  }
  systemMessageLoading.value = true
  try {
    const res = expanded
      ? await querySystemMessagesApi({ expanded: true, pageNum: 1, pageSize: 50 })
      : await querySystemMessagesApi({ limit: 10 })
    const raw = res.data as unknown
    systemMessages.value = Array.isArray(raw)
      ? raw
      : raw && typeof raw === 'object' && 'records' in raw
        ? ((raw as { records: SystemMessageVO[] }).records ?? [])
        : []
  } finally {
    systemMessageLoading.value = false
  }
}

const handleNotificationClick = async () => {
  systemMessageExpanded.value = false
  systemMessageVisible.value = true
  await refreshMessageCount()
  await fetchSystemMessages(false)
}

const handleExpandMessages = async () => {
  systemMessageExpanded.value = true
  await fetchSystemMessages(true)
}

watch(
  () => userInfo.value?.roleCode,
  () => {
    refreshMessageCount()
  },
  { immediate: true }
)

const handleCommand = async (command: string) => {
  if (command === 'profile') {
    router.push('/user')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        logout()
      })
      .catch(() => {
        // 取消退出
      })
  }
}
</script>

<style scoped>
.navbar-wrapper {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.navbar-left {
  flex: 1;
  overflow: hidden;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  margin-left: 20px;
}

.notification-badge {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.notification-icon {
  color: #606266;
  cursor: pointer;
  transition: color 0.3s;
}

.notification-icon:hover {
  color: #409eff;
}

.system-message-body {
  min-height: 160px;
}

.message-list {
  max-height: 360px;
  overflow: hidden;
}

.message-list.expanded {
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: center;
  min-height: 36px;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  color: #303133;
}

.message-content {
  flex: 1;
  word-break: break-all;
}

.expand-message {
  padding-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #909399;
  cursor: pointer;
}

.expand-message:hover {
  color: #409eff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.tag-breadcrumb-wrapper {
  padding: 8px 20px;
  background: white;
}
</style>
