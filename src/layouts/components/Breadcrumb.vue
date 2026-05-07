<template>
  <el-breadcrumb separator="/" class="breadcrumb-container">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item.title + index"
        :to="item.path ? { path: item.path } : undefined"
      >
        <span :class="{ 'breadcrumb-link': item.path }">
          {{ item.title }}
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useBreadcrumb } from "@/hooks/Brand/Breadcrumb/useBreadcrumb";

const { breadcrumbList } = useBreadcrumb();
</script>

<style scoped>
.breadcrumb-container {
  font-size: 14px;
  line-height: 1;
}

.breadcrumb-link {
  cursor: pointer;
  transition: all 0.3s;
}

:deep(.el-breadcrumb__item) {
  font-weight: 400;
}

:deep(.el-breadcrumb__inner) {
  color: #909399;
  transition: all 0.3s;
  font-size: 14px;
}

:deep(.el-breadcrumb__inner.is-link) {
  color: #909399;
  font-weight: 400;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  color: #409eff;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133;
  font-weight: 500;
}

:deep(.el-breadcrumb__separator) {
  color: #dcdfe6;
  margin: 0 12px;
  font-weight: 400;
}

/* 面包屑过渡动画 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
