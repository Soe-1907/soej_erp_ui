<template>
  <BaseDialog
    v-model="visible"
    title="选择仓库"
    width="720px"
    :z-index="3620"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <div class="query-container picker-query-row">
        <div class="query-item">
          <span class="query-label">仓库编号</span>
          <el-input
            v-model="codeInput"
            placeholder="请输入仓库编号查询"
            clearable
            style="width: 220px"
          />
        </div>
        <div class="query-item">
          <span class="query-label">仓库名称</span>
          <el-input
            v-model="nameInput"
            placeholder="请输入仓库名称查询"
            clearable
            style="width: 220px"
          />
        </div>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
      </div>

      <el-table
        :data="list"
        style="width: 100%"
        height="320"
        highlight-current-row
        @current-change="onCurrentChange"
      >
        <el-table-column label="选择" width="70" align="center">
          <template #default="{ row }">
            <el-radio
              :model-value="selected?.warehouseCode"
              :value="row.warehouseCode"
              @click.stop="onCurrentChange(row)"
            >
              <span></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="70"
          :index="(i: number) => (query.pageNum! - 1) * query.pageSize! + i + 1"
        />
        <el-table-column prop="warehouseCode" label="仓库编号" />
        <el-table-column prop="warehouseName" label="仓库名称" />
      </el-table>

      <div class="picker-pagination">
        <BasePagination
          v-model:pageNum="query.pageNum!"
          v-model:pageSize="query.pageSize!"
          :total="total"
          @change="fetchList"
        />
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import BasePagination from '@/components/page/BasePagination.vue'
import type { WarehouseQuery, WarehouseVO } from '@/type/warehouse'
import { queryAllWarehousesApi } from '@/api/product/warehouse'

const props = defineProps<{
  modelValue: boolean
  initialCode?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'select', row: { warehouseCode: string; warehouseName: string }): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const codeInput = ref('')
const nameInput = ref('')

const list = ref<WarehouseVO[]>([])
const total = ref(0)
const query = ref<WarehouseQuery>({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  status: 1,
})

const selected = ref<WarehouseVO | null>(null)

/**
 * 后端仅一个 keyword，SQL 为「编号 OR 名称」LIKE %keyword%。
 * 两框都有值时优先用编号（更精确）；仅名称则用名称；否则空串表示不按关键字过滤（仍限制 status=启用）。
 */
function buildListKeyword(): string {
  const code = codeInput.value.trim()
  const name = nameInput.value.trim()
  if (code && name) return code
  if (code) return code
  if (name) return name
  return ''
}

const fetchList = async () => {
  query.value.keyword = buildListKeyword()
  const res = await queryAllWarehousesApi(query.value)
  list.value = res.data?.list ?? []
  total.value = res.data?.total ?? 0
}

const handleQuery = () => {
  query.value.pageNum = 1
  fetchList()
}

const onCurrentChange = (row: WarehouseVO | null) => {
  selected.value = row
}

watch(
  () => visible.value,
  async (open) => {
    if (!open) return
    codeInput.value = ''
    nameInput.value = ''
    query.value.pageNum = 1
    query.value.pageSize = 10
    query.value.keyword = ''
    await nextTick()
    await fetchList()
    if (props.initialCode) {
      selected.value = list.value.find((item) => item.warehouseCode === props.initialCode) ?? null
    } else {
      selected.value = null
    }
  }
)

const handleConfirm = () => {
  if (!selected.value) {
    ElMessage.warning('请选择仓库')
    return
  }
  emit('select', {
    warehouseCode: selected.value.warehouseCode,
    warehouseName: selected.value.warehouseName,
  })
  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}

const handleClosed = () => {
  selected.value = null
}
</script>

<style scoped>
.query-container {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.picker-query-row .query-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.picker-pagination {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 8px;
}
.picker-pagination :deep(.el-pagination) {
  justify-content: flex-end;
}
</style>
