<template>
  <template v-for="(node, i) in nodes" :key="subIndex(i, node.title)">
    <el-sub-menu v-if="node.children?.length" :index="subIndex(i, node.title)">
      <template #title>
        <el-icon><Menu /></el-icon>
        <span>{{ node.title }}</span>
      </template>
      <SidebarMenuBranch :nodes="node.children" :parent-key="subIndex(i, node.title)" />
    </el-sub-menu>
    <el-menu-item v-else-if="node.path" :index="node.path">
      <el-icon><Grid /></el-icon>
      <template #title>{{ node.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import SidebarMenuBranch from './SidebarMenuBranch.vue'
import { Grid, Menu } from '@element-plus/icons-vue'
import type { MenuItemVO } from '@/type/user'

const props = withDefaults(
  defineProps<{
    nodes: MenuItemVO[]
    parentKey?: string
  }>(),
  { parentKey: 'root' }
)

const subIndex = (i: number, title: string) => `${props.parentKey}/${i}/${title}`
</script>
