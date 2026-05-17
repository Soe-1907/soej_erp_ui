<template>
  <div class="tag-breadcrumb-container">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="tag-tabs"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
      >
        <template #label>
          <span
            class="tab-label"
            @contextmenu.prevent="handleContextMenu($event, item.name)"
          >
            <TagTabBulletIcon class="tab-label__bullet" />
            <span class="tab-label__text">{{ item.title }}</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 右键菜单 -->
    <ul
      v-show="contextMenuVisible"
      :style="contextMenuStyle"
      class="context-menu"
    >
      <li @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        <span>刷新</span>
      </li>
      <li v-if="selectedTab !== tabList[0]?.name" @click="handleClose">
        <el-icon><Close /></el-icon>
        <span>关闭</span>
      </li>
      <li @click="handleCloseOthers">
        <el-icon><CircleClose /></el-icon>
        <span>关闭其他</span>
      </li>
      <li @click="handleCloseLeft">
        <el-icon><DArrowLeft /></el-icon>
        <span>关闭左侧</span>
      </li>
      <li @click="handleCloseRight">
        <el-icon><DArrowRight /></el-icon>
        <span>关闭右侧</span>
      </li>
      <li @click="handleCloseAll">
        <el-icon><CircleCloseFilled /></el-icon>
        <span>关闭所有</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import type { TabsPaneContext } from "element-plus";
import {
  Refresh,
  Close,
  CircleClose,
  DArrowLeft,
  DArrowRight,
  CircleCloseFilled,
} from "@element-plus/icons-vue";
import TagTabBulletIcon from "@/components/icons/TagTabBulletIcon.vue";
import { useBreadcrumb } from "@/hooks/Brand/Breadcrumb/useBreadcrumb";

const {
  tabList,
  activeTab,
  closeTab,
  switchTab,
  closeOtherTabs,
  closeLeftTabs,
  closeRightTabs,
  closeAllTabs,
  refreshTab,
} = useBreadcrumb();

// 点击标签页
const handleTabClick = (pane: TabsPaneContext) => {
  switchTab(pane.paneName as string);
};

// 移除标签页
const handleTabRemove = (targetName: string) => {
  closeTab(targetName);
};

// 右键菜单相关
const contextMenuVisible = ref(false);
const selectedTab = ref("");
const contextMenuStyle = ref({
  left: "0px",
  top: "0px",
});

// 显示右键菜单
const handleContextMenu = (event: MouseEvent, tabName: string) => {
  selectedTab.value = tabName;
  contextMenuVisible.value = true;
  contextMenuStyle.value = {
    left: `${event.clientX}px`,
    top: `${event.clientY}px`,
  };
};

// 隐藏右键菜单
const hideContextMenu = () => {
  contextMenuVisible.value = false;
  selectedTab.value = "";
};

// 刷新
const handleRefresh = () => {
  refreshTab();
  hideContextMenu();
};

// 关闭
const handleClose = () => {
  closeTab(selectedTab.value);
  hideContextMenu();
};

// 关闭其他
const handleCloseOthers = () => {
  closeOtherTabs(selectedTab.value);
  hideContextMenu();
};

// 关闭左侧
const handleCloseLeft = () => {
  closeLeftTabs(selectedTab.value);
  hideContextMenu();
};

// 关闭右侧
const handleCloseRight = () => {
  closeRightTabs(selectedTab.value);
  hideContextMenu();
};

// 关闭所有
const handleCloseAll = () => {
  closeAllTabs();
  hideContextMenu();
};

// 点击其他地方隐藏菜单
onMounted(() => {
  document.addEventListener("click", hideContextMenu);
  document.addEventListener("contextmenu", hideContextMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", hideContextMenu);
  document.removeEventListener("contextmenu", hideContextMenu);
});
</script>

<style scoped>
.tag-breadcrumb-container {
  position: relative;
}

.tag-tabs {
  margin: 0;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  user-select: none;
}

.tab-label__text {
  line-height: 1;
}

:deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
}

:deep(.el-tabs__nav) {
  border: none;
}

:deep(.el-tabs__item) {
  border: none;
  border-radius: 4px 4px 0 0;
  margin-right: 3px;
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  background-color: #f0f2f5;
  color: #606266;
  transition: all 0.3s;
  position: relative;
}

:deep(.el-tabs__item.is-active) {
  background-color: #409eff;
  color: white;
  font-weight: 500;
}

:deep(.el-tabs__item:hover) {
  background-color: #e6f7ff;
  color: #409eff;
}

:deep(.el-tabs__item.is-active:hover) {
  background-color: #409eff;
  color: white;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__content) {
  display: none;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 3000;
  padding: 5px 0;
  margin: 0;
  list-style: none;
  min-width: 120px;
}

.context-menu li {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: background-color 0.2s;
}

.context-menu li:hover {
  background-color: #f5f7fa;
}

.context-menu li .el-icon {
  margin-right: 8px;
  font-size: 14px;
}
</style>
