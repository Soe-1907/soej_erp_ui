<template>
  <div class="pagination-container">
    <el-pagination
      background
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      :hide-on-single-page="false"
      @update:current-page="onPageNumChange"
      @update:page-size="onPageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    pageNum: number
    pageSize: number
    total: number
    pageSizes?: number[]
  }>(),
  {
    pageSizes: () => [10, 20, 30, 50],
  }
)

const emit = defineEmits<{
  (e: 'update:pageNum', v: number): void
  (e: 'update:pageSize', v: number): void
  (e: 'change'): void
}>()

const onPageNumChange = (v: number) => {
  emit('update:pageNum', v)
  emit('change')
}

const onPageSizeChange = (v: number) => {
  emit('update:pageSize', v)
  emit('update:pageNum', 1)
  emit('change')
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
