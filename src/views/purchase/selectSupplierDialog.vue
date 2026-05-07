<template>
  <BaseDialog
    v-model="visible"
    title="选择供应商"
    width="820px"
    :z-index="3620"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <div class="query-container picker-query-row">
        <div class="query-item">
          <span class="query-label">供应商编号</span>
          <el-input
            v-model="codeInput"
            placeholder="请输入供应商编号查询"
            clearable
            style="width: 220px"
          />
        </div>
        <div class="query-item">
          <span class="query-label">供应商名称</span>
          <el-input
            v-model="nameInput"
            placeholder="请输入供应商名称查询"
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
              :model-value="selected?.supplierCode"
              :value="row.supplierCode"
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
        <el-table-column prop="supplierCode" label="供应商编号" />
        <el-table-column prop="supplierName" label="供应商名称" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="mobile" label="联系电话" />
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
import type { SupplierQuery, SupplierVO } from '@/type/supplier'
import { queryAllSuppliersApi } from '@/api/product/supplier'

const props = defineProps<{
  modelValue: boolean
  initialCode?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'select', row: { supplierCode: string; supplierName: string }): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const codeInput = ref('')
const nameInput = ref('')

const list = ref<SupplierVO[]>([])
const total = ref(0)
const query = ref<SupplierQuery>({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  status: 1,
})

const selected = ref<SupplierVO | null>(null)

/**
 * 后端仅一个 keyword，对编号/名称做 OR 模糊。两框都有值时优先编号；否则空串不按关键字过滤（仍 status=启用）。
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
  const res = await queryAllSuppliersApi(query.value)
  list.value = res.data?.list ?? []
  total.value = res.data?.total ?? 0
}

const handleQuery = () => {
  query.value.pageNum = 1
  fetchList()
}

const onCurrentChange = (row: SupplierVO | null) => {
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
      selected.value = list.value.find((item) => item.supplierCode === props.initialCode) ?? null
    } else {
      selected.value = null
    }
  }
)

const handleConfirm = () => {
  if (!selected.value) {
    ElMessage.warning('请选择供应商')
    return
  }
  emit('select', {
    supplierCode: selected.value.supplierCode,
    supplierName: selected.value.supplierName,
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
