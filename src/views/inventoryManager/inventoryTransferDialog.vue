<template>
  <BaseDialog
    v-model="visible"
    :title="dialogTitle"
    width="1180px"
    :confirmable="!isView"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form v-loading="detailLoading" label-width="130px" @submit.prevent>
        <div v-if="isView" class="basic-info">
          <div class="info-item">
            <span class="info-label">库存调拨单号：</span>
            <span class="info-value">{{ sourceMain?.transferCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">调出仓库：</span>
            <span class="info-value">{{ form.fromWarehouseName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">调入仓库：</span>
            <span class="info-value">{{ form.toWarehouseName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">调拨状态：</span>
            <span class="info-value">{{ sourceMain?.transferStatusDesc || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发起人：</span>
            <span class="info-value">{{ sourceMain?.initiatorName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">操作时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.operationTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核人：</span>
            <span class="info-value">{{ sourceMain?.auditorsDisplay || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.auditTime) }}</span>
          </div>
          <div v-if="sourceMain?.rejectReason" class="info-item info-reject">
            <span class="info-label">拒绝原因：</span>
            <span class="info-value">{{ sourceMain.rejectReason }}</span>
          </div>
        </div>

        <div v-else class="header-row">
          <el-form-item label="调出仓库名称" required>
            <el-input
              v-model="form.fromWarehouseName"
              readonly
              clearable
              placeholder="请选择调出仓库"
              style="width: 240px"
              @click="openWarehouseDialog('from')"
              @clear="clearWarehouse('from')"
            />
          </el-form-item>
          <el-form-item label="调入仓库名称" required>
            <el-input
              v-model="form.toWarehouseName"
              readonly
              clearable
              placeholder="请选择调入仓库"
              style="width: 240px"
              @click="openWarehouseDialog('to')"
              @clear="clearWarehouse('to')"
            />
          </el-form-item>
        </div>

        <el-form-item label="商品列表" :required="!isView">
          <div class="detail-block">
            <div v-if="!isView" class="detail-actions">
              <el-button
                type="primary"
                plain
                :icon="Plus"
                :disabled="!form.fromWarehouseCode"
                @click="openProductDialog"
              >
                新增
              </el-button>
              <el-button
                type="danger"
                plain
                :icon="Delete"
                :disabled="!form.fromWarehouseCode"
                @click="onDeleteRows"
              >
                删除
              </el-button>
            </div>

            <el-table
              ref="detailTableRef"
              :data="details"
              border
              style="width: 100%"
              @selection-change="onDetailSelectionChange"
            >
              <el-table-column v-if="!isView" type="selection" width="55" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="productCode" label="商品编号" width="130" />
              <el-table-column prop="productName" label="商品名称" width="150" />
              <el-table-column prop="categoryName" label="商品分类" width="120" />
              <el-table-column prop="brandName" label="商品品牌" width="120" />
              <el-table-column
                v-if="showAvailableColumn"
                prop="availableQuantity"
                label="可用库存数量"
                width="130"
              />
              <el-table-column label="调出数量" width="130">
                <template #default="{ row }">
                  <span v-if="isView">{{ row.outQuantity ?? '-' }}</span>
                  <el-input
                    v-else
                    v-model="row.outQuantity"
                    clearable
                    placeholder="请输入"
                    @input="(v: string) => onOutQuantityInput(row, v)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="调入数量" width="120">
                <template #default="{ row }">{{ row.inQuantity ?? row.outQuantity ?? '-' }}</template>
              </el-table-column>
              <el-table-column prop="uomName" label="商品单位" width="100" />
              <el-table-column label="备注" min-width="180">
                <template #default="{ row }">
                  <span v-if="isView">{{ row.lineRemark || '-' }}</span>
                  <el-input
                    v-else
                    v-model="row.lineRemark"
                    clearable
                    placeholder="请输入备注"
                    maxlength="160"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </template>
  </BaseDialog>

  <el-dialog v-model="warehouseDialogVisible" :title="warehouseDialogTitle" width="720px" append-to-body>
    <div class="query-container">
      <QueryInput
        v-model="warehouseQuery.warehouseCodeKeyword"
        placeholder="请输入仓库编号查询"
        style="width: 210px"
      />
      <QueryInput
        v-model="warehouseQuery.warehouseNameKeyword"
        placeholder="请输入仓库名称查询"
        style="width: 210px"
      />
      <el-button type="primary" :icon="Search" @click="handleWarehouseQuery">查询</el-button>
    </div>
    <el-table
      v-loading="warehouseLoading"
      :data="warehouseList"
      border
      highlight-current-row
      style="width: 100%"
      @row-click="selectWarehouseRow"
    >
      <el-table-column label="选择" width="70" align="center">
        <template #default="{ row }">
          <el-radio v-model="selectedWarehouseCode" :value="row.warehouseCode">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" :index="warehouseIndexMethod" />
      <el-table-column prop="warehouseCode" label="仓库编号" min-width="150" />
      <el-table-column prop="warehouseName" label="仓库名称" min-width="150" />
    </el-table>
    <Pagination
      v-model:pageNum="warehouseQuery.pageNum!"
      v-model:pageSize="warehouseQuery.pageSize!"
      :total="warehouseTotal"
      :page-sizes="[10, 20, 30, 50]"
      @change="fetchWarehouses"
    />
    <template #footer>
      <el-button type="primary" @click="saveWarehouseSelection">保存</el-button>
      <el-button @click="warehouseDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="productDialogVisible" title="选择商品" width="980px" append-to-body>
    <div class="query-container">
      <QueryInput
        v-model="productQuery.keyword"
        placeholder="请输入商品编号/名称查询"
        style="width: 230px"
      />
      <div class="query-item">
        <span class="query-label">商品分类</span>
        <el-select v-model="productQuery.categoryName" clearable placeholder="请选择" style="width: 160px">
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="query-item">
        <span class="query-label">商品品牌</span>
        <el-select v-model="productQuery.brandName" clearable placeholder="请选择" style="width: 160px">
          <el-option v-for="item in brandOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <el-button type="primary" :icon="Search" @click="handleProductQuery">查询</el-button>
    </div>
    <el-table
      ref="productTableRef"
      v-loading="productLoading"
      :data="productList"
      border
      row-key="productCode"
      style="width: 100%"
      @selection-change="onProductSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="60" :index="productIndexMethod" />
      <el-table-column prop="productCode" label="商品编号" width="130" />
      <el-table-column prop="productName" label="商品名称" width="150" />
      <el-table-column prop="categoryName" label="商品分类" width="120" />
      <el-table-column prop="brandName" label="商品品牌" width="120" />
      <el-table-column prop="availableQuantity" label="可用库存数量" width="130" />
      <el-table-column prop="uomName" label="商品单位" width="100" />
    </el-table>
    <Pagination
      v-model:pageNum="productQuery.pageNum!"
      v-model:pageSize="productQuery.pageSize!"
      :total="productTotal"
      :page-sizes="[10, 20, 30, 50]"
      @change="fetchProducts"
    />
    <template #footer>
      <el-button type="primary" @click="saveProductSelection">保存</el-button>
      <el-button @click="productDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Plus, Search } from '@element-plus/icons-vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import Pagination from '@/layouts/components/Pagination.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import type {
  InventoryTransferDetailItem,
  InventoryTransferDetailViewVo,
  InventoryTransferDto,
  InventoryTransferProductPickerVo,
  InventoryTransferProductQuery,
  InventoryTransferWarehousePickerVo,
  InventoryTransferWarehouseQuery,
} from '@/type/inventoryTransfer'
import {
  getInventoryTransferDetailApi,
  pickerFilterOptionsApi,
  pickerFromWarehousesApi,
  pickerProductsApi,
  pickerToWarehousesApi,
} from '@/api/product/inventoryTransfer'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    mode?: 'add' | 'edit' | 'view'
    transferCode?: string
  }>(),
  { mode: 'add' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', dto: InventoryTransferDto): void
}>()

interface DetailRow extends InventoryTransferDetailItem {
  _key: number
}

type WarehouseSide = 'from' | 'to'

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const isView = computed(() => props.mode === 'view')
const isEdit = computed(() => props.mode === 'edit')
const showAvailableColumn = computed(() => !isView.value || sourceMain.value?.transferStatus !== 3)
const dialogTitle = computed(() => {
  if (isView.value) return '查看库存调拨单'
  return isEdit.value ? '修改库存调拨单' : '新增库存调拨单'
})

const detailLoading = ref(false)
const warehouseLoading = ref(false)
const productLoading = ref(false)
const sourceMain = ref<InventoryTransferDetailViewVo | null>(null)
const selectedDetailRows = ref<DetailRow[]>([])
const selectedProductRows = ref<InventoryTransferProductPickerVo[]>([])
const details = ref<DetailRow[]>([])
const detailTableRef = ref()
const productTableRef = ref()
let rowKeySeed = 0

const form = reactive({
  fromWarehouseCode: '',
  fromWarehouseName: '',
  toWarehouseCode: '',
  toWarehouseName: '',
})

const warehouseDialogVisible = ref(false)
const warehouseSide = ref<WarehouseSide>('from')
const warehouseQuery = ref<InventoryTransferWarehouseQuery>(createDefaultWarehouseQuery())
const warehouseList = ref<InventoryTransferWarehousePickerVo[]>([])
const warehouseTotal = ref(0)
const selectedWarehouseCode = ref('')
const selectedWarehouse = ref<InventoryTransferWarehousePickerVo | null>(null)
const warehouseDialogTitle = computed(() =>
  warehouseSide.value === 'from' ? '选择调出仓库' : '选择调入仓库'
)

const productDialogVisible = ref(false)
const productQuery = ref<InventoryTransferProductQuery>(createDefaultProductQuery())
const productList = ref<InventoryTransferProductPickerVo[]>([])
const productTotal = ref(0)
const categoryOptions = ref<string[]>([])
const brandOptions = ref<string[]>([])

function resetForm() {
  form.fromWarehouseCode = ''
  form.fromWarehouseName = ''
  form.toWarehouseCode = ''
  form.toWarehouseName = ''
  details.value = []
  selectedDetailRows.value = []
  selectedProductRows.value = []
  sourceMain.value = null
  rowKeySeed = 0
}

function createDefaultWarehouseQuery(): InventoryTransferWarehouseQuery {
  return {
    warehouseCodeKeyword: undefined,
    warehouseNameKeyword: undefined,
    excludeWarehouseCode: undefined,
    pageNum: 1,
    pageSize: 10,
  }
}

function createDefaultProductQuery(): InventoryTransferProductQuery {
  return {
    fromWarehouseCode: undefined,
    keyword: undefined,
    categoryName: undefined,
    brandName: undefined,
    pageNum: 1,
    pageSize: 10,
  }
}

async function openWarehouseDialog(side: WarehouseSide) {
  if (isView.value) return
  warehouseSide.value = side
  warehouseQuery.value = createDefaultWarehouseQuery()
  warehouseQuery.value.excludeWarehouseCode =
    side === 'from' ? form.toWarehouseCode : form.fromWarehouseCode
  selectedWarehouseCode.value = side === 'from' ? form.fromWarehouseCode : form.toWarehouseCode
  selectedWarehouse.value = null
  warehouseDialogVisible.value = true
  await fetchWarehouses()
}

async function fetchWarehouses() {
  warehouseLoading.value = true
  try {
    const apiCall =
      warehouseSide.value === 'from' ? pickerFromWarehousesApi : pickerToWarehousesApi
    const res = (await apiCall(warehouseQuery.value)) as {
      data: { list: InventoryTransferWarehousePickerVo[]; total: number }
    }
    warehouseList.value = res.data?.list ?? []
    warehouseTotal.value = res.data?.total ?? 0
    selectedWarehouse.value =
      warehouseList.value.find((item) => item.warehouseCode === selectedWarehouseCode.value) ?? null
  } finally {
    warehouseLoading.value = false
  }
}

async function handleWarehouseQuery() {
  warehouseQuery.value.pageNum = 1
  await fetchWarehouses()
}

function selectWarehouseRow(row: InventoryTransferWarehousePickerVo) {
  selectedWarehouse.value = row
  selectedWarehouseCode.value = row.warehouseCode
}

function saveWarehouseSelection() {
  if (!selectedWarehouse.value) {
    ElMessage.warning('请选择仓库')
    return
  }
  if (warehouseSide.value === 'from') {
    const changed = form.fromWarehouseCode !== selectedWarehouse.value.warehouseCode
    form.fromWarehouseCode = selectedWarehouse.value.warehouseCode
    form.fromWarehouseName = selectedWarehouse.value.warehouseName
    if (changed) {
      details.value = []
      selectedDetailRows.value = []
    }
  } else {
    form.toWarehouseCode = selectedWarehouse.value.warehouseCode
    form.toWarehouseName = selectedWarehouse.value.warehouseName
  }
  warehouseDialogVisible.value = false
}

function clearWarehouse(side: WarehouseSide) {
  if (side === 'from') {
    form.fromWarehouseCode = ''
    form.fromWarehouseName = ''
    details.value = []
    selectedDetailRows.value = []
  } else {
    form.toWarehouseCode = ''
    form.toWarehouseName = ''
  }
}

async function openProductDialog() {
  if (!form.fromWarehouseCode) {
    ElMessage.warning('请先选择调出仓库')
    return
  }
  productQuery.value = createDefaultProductQuery()
  productQuery.value.fromWarehouseCode = form.fromWarehouseCode
  selectedProductRows.value = []
  productDialogVisible.value = true
  await fetchProductOptions()
  await fetchProducts()
}

async function fetchProductOptions() {
  if (!productQuery.value.fromWarehouseCode) return
  const res = (await pickerFilterOptionsApi(productQuery.value)) as {
    data: { categories: string[]; brands: string[] }
  }
  categoryOptions.value = res.data?.categories ?? []
  brandOptions.value = res.data?.brands ?? []
}

async function fetchProducts() {
  productLoading.value = true
  try {
    const res = (await pickerProductsApi(productQuery.value)) as {
      data: { list: InventoryTransferProductPickerVo[]; total: number }
    }
    productList.value = res.data?.list ?? []
    productTotal.value = res.data?.total ?? 0
    await nextTick()
    const selectedCodes = new Set(details.value.map((item) => item.productCode))
    productList.value.forEach((row) => {
      if (selectedCodes.has(row.productCode)) {
        productTableRef.value?.toggleRowSelection(row, true)
      }
    })
  } finally {
    productLoading.value = false
  }
}

async function handleProductQuery() {
  productQuery.value.pageNum = 1
  await fetchProductOptions()
  await fetchProducts()
}

function onProductSelectionChange(rows: InventoryTransferProductPickerVo[]) {
  selectedProductRows.value = rows
}

function saveProductSelection() {
  if (!selectedProductRows.value.length) {
    ElMessage.warning('请选择商品')
    return
  }
  const existingMap = new Map(details.value.map((row) => [row.productCode, row]))
  const merged = [...details.value]
  selectedProductRows.value.forEach((row) => {
    if (existingMap.has(row.productCode)) return
    merged.push(
      toDetailRow({
        productCode: row.productCode,
        productName: row.productName,
        categoryName: row.categoryName,
        brandName: row.brandName,
        uomName: row.uomName,
        availableQuantity: row.availableQuantity,
        outQuantity: '',
        inQuantity: undefined,
        lineRemark: '',
      })
    )
  })
  details.value = merged
  productDialogVisible.value = false
}

function onDetailSelectionChange(rows: DetailRow[]) {
  selectedDetailRows.value = rows
}

function onDeleteRows() {
  if (!selectedDetailRows.value.length) {
    ElMessage.warning('请先勾选要删除的商品')
    return
  }
  const keys = new Set(selectedDetailRows.value.map((row) => row._key))
  details.value = details.value.filter((row) => !keys.has(row._key))
  selectedDetailRows.value = []
  detailTableRef.value?.clearSelection()
}

function onOutQuantityInput(row: DetailRow, value: string) {
  row.outQuantity = (value ?? '').replace(/[^\d]/g, '').slice(0, 8)
  row.inQuantity = row.outQuantity ? Number(row.outQuantity) : undefined
}

function toDetailRow(row: InventoryTransferDetailItem): DetailRow {
  const outQuantity = row.outQuantity != null ? String(row.outQuantity) : ''
  return {
    ...row,
    _key: ++rowKeySeed,
    outQuantity,
    inQuantity: row.inQuantity ?? (outQuantity ? Number(outQuantity) : undefined),
    lineRemark: row.lineRemark ?? '',
  }
}

async function loadViewData(code: string) {
  detailLoading.value = true
  try {
    const res = (await getInventoryTransferDetailApi(code)) as {
      data: InventoryTransferDetailViewVo
    }
    const main = res.data
    sourceMain.value = main
    form.fromWarehouseCode = main.fromWarehouseCode ?? ''
    form.fromWarehouseName = main.fromWarehouseName ?? ''
    form.toWarehouseCode = main.toWarehouseCode ?? ''
    form.toWarehouseName = main.toWarehouseName ?? ''
    details.value = (main.lines ?? []).map((line) =>
      toDetailRow({
        detailId: line.detailId,
        lineNo: line.lineNo,
        productCode: line.productCode,
        productName: line.productName,
        categoryName: line.categoryName,
        brandName: line.brandName,
        uomName: line.uomName,
        availableQuantity: line.availableQtySnapshot,
        outQuantity: line.outQuantity,
        inQuantity: line.inQuantity,
        lineRemark: line.lineRemark,
      })
    )
  } catch {
    ElMessage.error('加载库存调拨单失败')
    visible.value = false
  } finally {
    detailLoading.value = false
  }
}

watch(
  () => [visible.value, props.mode, props.transferCode] as const,
  async ([open, mode, code]) => {
    if (!open) return
    resetForm()
    await nextTick()
    if (mode === 'add') return
    if (!code) {
      ElMessage.error('缺少库存调拨单号')
      visible.value = false
      return
    }
    await loadViewData(code)
  }
)

function validate(): boolean {
  if (!form.fromWarehouseCode) {
    ElMessage.warning('调出仓库必填，请重新输入。')
    return false
  }
  if (!form.toWarehouseCode) {
    ElMessage.warning('调入仓库必填，请重新输入。')
    return false
  }
  if (form.fromWarehouseCode === form.toWarehouseCode) {
    ElMessage.warning('调出仓库和调入仓库不能相同，请重新输入。')
    return false
  }
  if (!details.value.length) {
    ElMessage.warning('商品列表至少存在1行，请新增。')
    return false
  }
  const seen = new Set<string>()
  for (const row of details.value) {
    const productCode = row.productCode ?? ''
    if (!productCode || seen.has(productCode)) {
      ElMessage.warning('商品列表数据有误，请重新选择。')
      return false
    }
    seen.add(productCode)
    const quantityText = String(row.outQuantity ?? '').trim()
    if (!quantityText) {
      ElMessage.warning('调出数量必填，请重新输入。')
      return false
    }
    const quantity = Number(quantityText)
    const limit = Number(row.availableQuantity ?? 0)
    if (!/^\d+$/.test(quantityText) || quantity <= 0 || quantity > limit) {
      ElMessage.warning('调出数量输入有误，请重新输入。')
      return false
    }
    const remark = String(row.lineRemark ?? '').trim()
    if (!remark) {
      ElMessage.warning('备注必填，请重新输入。')
      return false
    }
    if (remark.length > 160) {
      ElMessage.warning('备注输入有误，请重新输入。')
      return false
    }
  }
  return true
}

function handleConfirm() {
  if (isView.value) return
  if (!validate()) return
  const detailsPayload: InventoryTransferDetailItem[] = details.value.map((row) => ({
    productCode: row.productCode,
    productName: row.productName,
    categoryName: row.categoryName,
    brandName: row.brandName,
    uomName: row.uomName,
    outQuantity: Number(row.outQuantity),
    lineRemark: String(row.lineRemark ?? '').trim(),
  }))
  emit('submit', {
    transferCode: sourceMain.value?.transferCode,
    fromWarehouseCode: form.fromWarehouseCode,
    fromWarehouseName: form.fromWarehouseName,
    toWarehouseCode: form.toWarehouseCode,
    toWarehouseName: form.toWarehouseName,
    details: detailsPayload,
  })
}

function handleCancel() {
  visible.value = false
}

function handleClosed() {
  resetForm()
}

function warehouseIndexMethod(index: number) {
  return ((warehouseQuery.value.pageNum ?? 1) - 1) * (warehouseQuery.value.pageSize ?? 10) + index + 1
}

function productIndexMethod(index: number) {
  return ((productQuery.value.pageNum ?? 1) - 1) * (productQuery.value.pageSize ?? 10) + index + 1
}

function formatDateTimeText(value: string | undefined) {
  if (!value) return '-'
  if (value.includes('T')) return value.replace('T', ' ').slice(0, 19)
  return value.length >= 19 ? value.slice(0, 19) : value
}
</script>

<style scoped>
.header-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}
.basic-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: 12px;
  column-gap: 36px;
  margin-bottom: 18px;
  font-size: 14px;
  color: #303133;
}
.info-item {
  display: flex;
  min-width: 0;
}
.info-reject {
  grid-column: 1 / -1;
}
.info-label {
  flex: 0 0 130px;
  color: #606266;
  text-align: right;
}
.info-value {
  flex: 1;
  min-width: 0;
  word-break: break-all;
}
.detail-block {
  width: 100%;
}
.detail-actions {
  margin-bottom: 12px;
  display: flex;
  gap: 10px;
}
.query-container {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.query-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.query-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}
</style>
