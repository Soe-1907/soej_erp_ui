<template>
  <el-table :data="data" style="width: 100%">
    <el-table-column
      fixed
      type="index"
      label="序号"
      :index="indexMethod"
      width="70"
      align="center"
      header-align="center"
    />
    <el-table-column
      v-for="colum in columns"
      :key="colum.prop"
      :prop="colum.prop"
      :label="colum.label"
      :width="colum.width"
      :min-width="colum.minWidth ?? 180"
      :align="colum.align || 'center'"
      :header-align="colum.headerAlign || colum.align || 'center'"
      :formatter="colum.imageThumb ? undefined : colum.formatter"
    >
      <template v-if="colum.imageThumb" #default="{ row }">
        <el-image
          v-if="row[colum.prop]"
          :src="row[colum.prop]"
          :preview-src-list="[row[colum.prop]]"
          fit="cover"
          preview-teleported
          style="width: 48px; height: 48px; border-radius: 4px"
        />
        <span v-else class="text-muted">—</span>
      </template>
    </el-table-column>

    <!-- 操作列：用 slot 渲染，每行都能拿到 row -->
    <el-table-column
      label="操作"
      :width="operationWidth"
      :align="operationAlign"
      :header-align="operationAlign"
      fixed="right"
    >
      <template #default="scope">
        <!-- 把 scope 透传给父组件（row、$index 等都在 scope 里） -->
        <slot name="operations" v-bind="scope" />
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页区 -->
   
</template>


<script setup lang="ts">
import type { TableColumn } from "@/type/table";

const props = withDefaults(
  defineProps<{
    data: any[];
    columns: TableColumn[];
    /** 序号起始偏移，用于分页： (pageNum - 1) * pageSize */
    indexBase?: number;
    operationWidth?: number;
    operationAlign?: "left" | "center" | "right";
  }>(),
  {
    indexBase: 0,
    operationWidth: 140,
    operationAlign: "center",
  }
);

const indexMethod = (index: number) => props.indexBase + index + 1;
</script>

<style scoped>
.text-muted {
  color: #909399;
  font-size: 13px;
}

:deep(.el-table__header th.el-table__cell .cell) {
  font-weight: 700;
  color: var(--el-text-color-primary, #303133);
}
</style>
