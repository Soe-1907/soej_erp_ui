<template>
  <BaseDialog
    v-model="visible"
    :title="dialogTitle"
    width="1180px"
    :confirmable="false"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form v-loading="detailLoading" label-width="120px" @submit.prevent>
        <div v-if="isView" class="basic-info">
          <div class="info-item">
            <span class="info-label">销售出库单号：</span>
            <span class="info-value">{{ sourceMain?.outboundCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">仓库名称：</span>
            <span class="info-value">{{ form.warehouseName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户名称：</span>
            <span class="info-value">{{ form.customerName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核状态：</span>
            <span class="info-value">{{ sourceMain?.auditStatusName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">备注：</span>
            <span class="info-value">{{ headerRemark || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发起人：</span>
            <span class="info-value">{{ sourceMain?.initiator || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">操作时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.operationTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核人：</span>
            <span class="info-value">{{ sourceMain?.auditor || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.auditTime) }}</span>
          </div>
        </div>

        <div v-else class="header-row">
          <el-form-item label="仓库名称" required>
            <el-input
              v-model="form.warehouseName"
              readonly
              placeholder="请选择仓库"
              clearable
              style="width: 240px"
              @click="openWarehouseDialog"
              @clear="clearWarehouse"
            />
          </el-form-item>
          <el-form-item label="客户名称" required>
            <el-input
              v-model="form.customerName"
              readonly
              placeholder="请选择客户"
              clearable
              style="width: 240px"
              @click="openCustomerDialog"
              @clear="clearCustomer"
            />
          </el-form-item>
        </div>

        <el-form-item label="商品列表" :required="!isView">
          <div class="detail-block">
            <div v-if="!isView" class="detail-actions">
              <el-button type="primary" plain :icon="Plus" :disabled="!form.warehouseCode" @click="openProductDialog">
                新增
              </el-button>
              <el-button type="danger" plain :icon="Delete" :disabled="!form.warehouseCode" @click="onDeleteRows">
                批量删除
              </el-button>
            </div>

            <el-table
              ref="detailTableRef"
              :data="displayDetails"
              border
              empty-text="暂无数据"
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
                v-if="showStockColumns"
                prop="availableQuantity"
                label="可用库存数量"
                width="130"
              />
              <el-table-column label="销售出库数量" width="140">
                <template #default="{ row }">
                  <span v-if="isView">{{ row.outboundQuantity ?? '-' }}</span>
                  <el-input
                    v-else
                    v-model="row.outboundQuantity"
                    placeholder="请输入"
                    clearable
                    @input="(v: string) => onOutboundQuantityInput(row, v)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="uomName" label="商品单位" width="100" />
              <el-table-column label="建议销售价（元）" width="140">
                <template #default="{ row }">{{ formatMoney(row.suggestedPrice) }}</template>
              </el-table-column>
              <el-table-column label="实际销售价（元）" width="150">
                <template #default="{ row }">
                  <span v-if="isView">{{ formatMoney(row.actualPrice) }}</span>
                  <el-input
                    v-else
                    v-model="row.actualPrice"
                    placeholder="请输入"
                    clearable
                    @input="(v: string) => onActualPriceInput(row, v)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="销售结算金额（元）" width="160">
                <template #default="{ row }">{{ formatMoney(row.settlementAmount) }}</template>
              </el-table-column>
            </el-table>

            <div class="total-row">
              <span>合计：</span>
              <span class="total-amount">销售结算金额 {{ formatMoney(totalSettlementAmount) }}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="showRecords" label="操作记录">
          <div class="record-block">
            <div v-if="recordLoading" class="record-empty">加载中...</div>
            <template v-else-if="records.length">
              <div v-for="(r, idx) in records" :key="`${r.recordId ?? idx}-${idx}`" class="record-item">
                <div class="record-line">
                  <span class="record-user">{{ r.operator || '-' }}</span>
                  <span class="record-action">{{ r.operationType || '-' }}</span>
                  <span v-if="r.rejectReason" class="record-remark">{{ r.rejectReason }}</span>
                </div>
                <div class="record-time">{{ formatDateTimeText(r.operationTime) }}</div>
              </div>
            </template>
            <div v-else class="record-empty">暂无操作记录</div>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div v-if="!isView" class="dialog-footer">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button v-if="props.mode === 'add'" type="primary" plain @click="onSaveAndNew">保存并新增</el-button>
        <el-button v-if="showSubmitInDialog" type="success" @click="onCommit">提交</el-button>
        <el-button @click="onFooterCancel">取消</el-button>
      </div>
      <div v-else class="dialog-footer">
        <el-button type="primary" @click="onFooterCancel">关闭</el-button>
      </div>
    </template>
  </BaseDialog>

  <el-dialog v-model="warehouseDialogVisible" title="选择仓库" width="760px" :close-on-click-modal="false">
    <div class="popup-query">
      <QueryInput v-model="warehouseQuery.warehouseCode" placeholder="请输入仓库编号查询" style="width: 220px" />
      <QueryInput v-model="warehouseQuery.warehouseName" placeholder="请输入仓库名称查询" style="width: 220px" />
      <el-button type="primary" :icon="Search" @click="queryWarehouses">查询</el-button>
    </div>
    <el-table
      ref="warehouseTableRef"
      v-loading="warehouseLoading"
      :data="warehouses"
      border
      highlight-current-row
      @current-change="selectedWarehouse = $event"
    >
      <el-table-column width="60" align="center">
        <template #default="{ row }">
          <el-radio :model-value="selectedWarehouse?.warehouseCode" :label="row.warehouseCode">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="warehouseCode" label="仓库编号" />
      <el-table-column prop="warehouseName" label="仓库名称" />
    </el-table>
    <BasePagination
      v-model:pageNum="warehouseQuery.pageNum!"
      v-model:pageSize="warehouseQuery.pageSize!"
      :total="warehouseTotal"
      @change="queryWarehouses"
    />
    <template #footer>
      <el-button type="primary" @click="saveWarehouse">保存</el-button>
      <el-button @click="warehouseDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="customerDialogVisible" title="选择客户" width="900px" :close-on-click-modal="false">
    <div class="popup-query">
      <QueryInput v-model="customerQuery.customerCode" placeholder="请输入客户编号查询" style="width: 220px" />
      <QueryInput v-model="customerQuery.customerName" placeholder="请输入客户名称查询" style="width: 220px" />
      <el-button type="primary" :icon="Search" @click="queryCustomers">查询</el-button>
    </div>
    <el-table
      ref="customerTableRef"
      v-loading="customerLoading"
      :data="customers"
      border
      highlight-current-row
      @current-change="selectedCustomer = $event"
    >
      <el-table-column width="60" align="center">
        <template #default="{ row }">
          <el-radio :model-value="selectedCustomer?.customerCode" :label="row.customerCode">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="customerCode" label="客户编号" />
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column prop="contactName" label="联系人" />
      <el-table-column prop="mobile" label="联系电话" />
    </el-table>
    <BasePagination
      v-model:pageNum="customerQuery.pageNum!"
      v-model:pageSize="customerQuery.pageSize!"
      :total="customerTotal"
      @change="queryCustomers"
    />
    <template #footer>
      <el-button type="primary" @click="saveCustomer">保存</el-button>
      <el-button @click="customerDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="productDialogVisible" title="选择商品" width="980px" :close-on-click-modal="false">
    <div class="popup-query">
      <QueryInput v-model="productQuery.keyword" placeholder="请输入商品编号/名称查询" style="width: 240px" />
      <el-select v-model="productQuery.categoryName" clearable placeholder="请选择商品分类" style="width: 180px">
        <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="productQuery.brandName" clearable placeholder="请选择商品品牌" style="width: 180px">
        <el-option v-for="item in brandOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button type="primary" :icon="Search" @click="queryProducts">查询</el-button>
    </div>
    <el-table
      ref="productTableRef"
      v-loading="productLoading"
      :data="products"
      border
      @selection-change="selectedProducts = $event"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="productCode" label="商品编号" width="130" />
      <el-table-column prop="productName" label="商品名称" width="150" />
      <el-table-column prop="categoryName" label="商品分类" width="120" />
      <el-table-column prop="brandName" label="商品品牌" width="120" />
      <el-table-column prop="availableQuantity" label="可用库存数量" width="130" />
      <el-table-column prop="uomName" label="商品单位" width="100" />
    </el-table>
    <BasePagination
      v-model:pageNum="productQuery.pageNum!"
      v-model:pageSize="productQuery.pageSize!"
      :total="productTotal"
      @change="queryProducts"
    />
    <template #footer>
      <el-button type="primary" @click="saveProducts">保存</el-button>
      <el-button @click="productDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Plus, Search } from '@element-plus/icons-vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import BasePagination from '@/components/page/BasePagination.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import { queryAllCustomersApi } from '@/api/product/customer'
import { queryAllWarehousesApi } from '@/api/product/warehouse'
import type {
  CustomerOptionVO,
  SalesOutboundDetailDto,
  SalesOutboundDetailLineViewVO,
  SalesOutboundDetailViewVO,
  SalesOutboundDto,
  SalesOutboundProductPickerQuery,
  SalesOutboundProductPickerVO,
  SalesOutboundRecordVO,
  SalesOutboundVO,
  WarehouseOptionVO,
} from '@/type/salesOutbound'
import {
  getSalesOutboundDetailViewApi,
  querySalesOutboundPickerFilterOptionsApi,
  querySalesOutboundPickerProductsApi,
} from '@/api/product/salesOutbound'
import type { CustomerVO } from '@/type/customer'
import type { WarehouseVO } from '@/type/warehouse'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    mode?: 'add' | 'edit' | 'view'
    outboundCode?: string
    /** 编辑时从列表行带入（详情接口无仓/客编号） */
    initialHeader?: {
      warehouseCode: string
      customerCode: string
      warehouseName?: string
      customerName?: string
    } | null
  }>(),
  { mode: 'add', initialHeader: null }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', dto: SalesOutboundDto, opts?: { saveAndNew?: boolean }): void
  (e: 'commit', outboundCode: string): void
}>()

interface DetailRow extends SalesOutboundDetailDto {
  _key: number
}

function unwrapPage<T>(res: unknown): { list: T[]; total: number } {
  const data = (res as { data?: { list?: T[]; total?: number } })?.data
  if (!data || typeof data !== 'object') return { list: [], total: 0 }
  const list = Array.isArray(data.list) ? data.list : []
  const total = typeof data.total === 'number' ? data.total : Number(data.total ?? 0)
  return { list, total }
}

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const isView = computed(() => props.mode === 'view')
const isEdit = computed(() => props.mode === 'edit')
const showRecords = computed(() => isView.value || isEdit.value)
const showStockColumns = computed(() => !isView.value || sourceMain.value?.auditStatus !== 2)
const showSubmitInDialog = computed(
  () =>
    !isView.value &&
    isEdit.value &&
    !!sourceMain.value?.outboundCode &&
    (sourceMain.value.auditStatus === 0 || sourceMain.value.auditStatus === 3)
)
const dialogTitle = computed(() => {
  if (isView.value) return '查看销售出库单'
  return isEdit.value ? '修改销售出库单' : '新增销售出库单'
})

const detailLoading = ref(false)
const recordLoading = ref(false)
const records = ref<SalesOutboundRecordVO[]>([])
const sourceMain = ref<SalesOutboundVO | null>(null)
const headerRemark = ref('')
const selectedDetailRows = ref<DetailRow[]>([])
const details = ref<DetailRow[]>([])
let rowKeySeed = 0

const form = reactive({
  warehouseCode: '',
  warehouseName: '',
  customerCode: '',
  customerName: '',
})

const displayDetails = computed(() => details.value)
const totalSettlementAmount = computed(() =>
  details.value.reduce((sum, row) => sum + toNumber(row.settlementAmount), 0)
)

const warehouseDialogVisible = ref(false)
const warehouseLoading = ref(false)
const warehouses = ref<WarehouseOptionVO[]>([])
const warehouseTotal = ref(0)
const selectedWarehouse = ref<WarehouseOptionVO | null>(null)
const warehouseQuery = reactive({
  warehouseCode: undefined as string | undefined,
  warehouseName: undefined as string | undefined,
  pageNum: 1,
  pageSize: 10,
})

const customerDialogVisible = ref(false)
const customerLoading = ref(false)
const customers = ref<CustomerOptionVO[]>([])
const customerTotal = ref(0)
const selectedCustomer = ref<CustomerOptionVO | null>(null)
const customerQuery = reactive({
  customerCode: undefined as string | undefined,
  customerName: undefined as string | undefined,
  pageNum: 1,
  pageSize: 10,
})

const productDialogVisible = ref(false)
const productLoading = ref(false)
const products = ref<SalesOutboundProductPickerVO[]>([])
const productTotal = ref(0)
const selectedProducts = ref<SalesOutboundProductPickerVO[]>([])
const categoryOptions = ref<string[]>([])
const brandOptions = ref<string[]>([])
const productQuery = reactive<SalesOutboundProductPickerQuery>({
  warehouseCode: '',
  keyword: undefined,
  categoryName: undefined,
  brandName: undefined,
  pageNum: 1,
  pageSize: 10,
})

const warehouseTableRef = ref()
const customerTableRef = ref()
const productTableRef = ref()

function mapStatusLabel(auditStatus: number, desc: string) {
  if (auditStatus === 2) return '已完成'
  return desc || ''
}

function resetForm() {
  form.warehouseCode = ''
  form.warehouseName = ''
  form.customerCode = ''
  form.customerName = ''
  details.value = []
  selectedDetailRows.value = []
  records.value = []
  sourceMain.value = null
  headerRemark.value = ''
  rowKeySeed = 0
}

function resetAfterSaveAndNew() {
  resetForm()
}

defineExpose({ resetAfterSaveAndNew })

function openWarehouseDialog() {
  if (isView.value) return
  selectedWarehouse.value = form.warehouseCode
    ? { warehouseCode: form.warehouseCode, warehouseName: form.warehouseName }
    : null
  warehouseDialogVisible.value = true
  queryWarehouses()
}

function warehouseKeywordParam(): string | undefined {
  const parts = [warehouseQuery.warehouseCode, warehouseQuery.warehouseName]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
  const k = parts.join(' ').trim()
  return k || undefined
}

async function queryWarehouses() {
  warehouseLoading.value = true
  try {
    const res = await queryAllWarehousesApi({
      keyword: warehouseKeywordParam(),
      pageNum: warehouseQuery.pageNum,
      pageSize: warehouseQuery.pageSize,
      status: 1,
    })
    const { list, total } = unwrapPage<WarehouseVO>(res)
    warehouses.value = list.map((w) => ({
      warehouseCode: w.warehouseCode,
      warehouseName: w.warehouseName,
    }))
    warehouseTotal.value = total
    await nextTick()
    const current = warehouses.value.find((item) => item.warehouseCode === selectedWarehouse.value?.warehouseCode)
    if (current) {
      warehouseTableRef.value?.setCurrentRow(current)
    }
  } finally {
    warehouseLoading.value = false
  }
}

function saveWarehouse() {
  if (!selectedWarehouse.value) {
    ElMessage.warning('请选择仓库')
    return
  }
  const changed = form.warehouseCode && form.warehouseCode !== selectedWarehouse.value.warehouseCode
  form.warehouseCode = selectedWarehouse.value.warehouseCode
  form.warehouseName = selectedWarehouse.value.warehouseName
  if (changed) {
    details.value = []
    selectedDetailRows.value = []
  }
  warehouseDialogVisible.value = false
}

function clearWarehouse() {
  form.warehouseCode = ''
  form.warehouseName = ''
  details.value = []
  selectedDetailRows.value = []
}

function openCustomerDialog() {
  if (isView.value) return
  selectedCustomer.value = form.customerCode
    ? { customerCode: form.customerCode, customerName: form.customerName }
    : null
  customerDialogVisible.value = true
  queryCustomers()
}

function customerKeywordParam(): string | undefined {
  const parts = [customerQuery.customerCode, customerQuery.customerName]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
  const k = parts.join(' ').trim()
  return k || undefined
}

async function queryCustomers() {
  customerLoading.value = true
  try {
    const res = await queryAllCustomersApi({
      keyword: customerKeywordParam(),
      pageNum: customerQuery.pageNum,
      pageSize: customerQuery.pageSize,
      status: 1,
    })
    const { list, total } = unwrapPage<CustomerVO>(res)
    customers.value = list.map((c) => ({
      customerCode: c.customerCode,
      customerName: c.customerName,
      contactName: c.contactName,
      mobile: c.mobile,
    }))
    customerTotal.value = total
    await nextTick()
    const current = customers.value.find((item) => item.customerCode === selectedCustomer.value?.customerCode)
    if (current) {
      customerTableRef.value?.setCurrentRow(current)
    }
  } finally {
    customerLoading.value = false
  }
}

function saveCustomer() {
  if (!selectedCustomer.value) {
    ElMessage.warning('请选择客户')
    return
  }
  form.customerCode = selectedCustomer.value.customerCode
  form.customerName = selectedCustomer.value.customerName
  customerDialogVisible.value = false
}

function clearCustomer() {
  form.customerCode = ''
  form.customerName = ''
}

async function openProductDialog() {
  if (!form.warehouseCode) {
    ElMessage.warning('仓库必填，请重新输入。')
    return
  }
  productQuery.warehouseCode = form.warehouseCode
  productDialogVisible.value = true
  await Promise.all([loadProductOptions(), queryProducts()])
}

async function loadProductOptions() {
  if (!productQuery.warehouseCode) return
  const res = await querySalesOutboundPickerFilterOptionsApi({
    warehouseCode: productQuery.warehouseCode,
  })
  const data = (res as { data?: { categories?: string[]; brands?: string[] } }).data
  categoryOptions.value = data?.categories ?? []
  brandOptions.value = data?.brands ?? []
}

async function queryProducts() {
  productLoading.value = true
  try {
    await loadProductOptions()
    const res = await querySalesOutboundPickerProductsApi(productQuery)
    const { list, total } = unwrapPage<SalesOutboundProductPickerVO>(res)
    products.value = list
    productTotal.value = total
    await nextTick()
    const selectedCodes = new Set(details.value.map((item) => item.productCode))
    products.value.forEach((row) => {
      if (selectedCodes.has(row.productCode)) {
        productTableRef.value?.toggleRowSelection(row, true)
      }
    })
  } finally {
    productLoading.value = false
  }
}

function saveProducts() {
  const existing = new Map(details.value.map((row) => [row.productCode, row]))
  for (const product of selectedProducts.value) {
    if (!product.productCode || existing.has(product.productCode)) {
      continue
    }
    details.value.push(toDetailRowFromPicker(product))
  }
  productDialogVisible.value = false
}

function toDetailRowFromPicker(row: SalesOutboundProductPickerVO): DetailRow {
  const detail: DetailRow = {
    productCode: row.productCode,
    productName: row.productName,
    categoryName: row.categoryName,
    brandName: row.brandName,
    availableQuantity: row.availableQuantity,
    uomName: row.uomName,
    suggestedPrice: row.suggestSalePrice,
    outboundQuantity: '',
    actualPrice: '',
    settlementAmount: '',
    _key: ++rowKeySeed,
  }
  recomputeSettlementAmount(detail)
  return detail
}

function lineViewToDetailRow(line: SalesOutboundDetailLineViewVO): DetailRow {
  const detail: DetailRow = {
    detailId: line.detailId,
    lineNo: line.lineNo,
    productCode: line.productCode,
    productName: line.productName,
    categoryName: line.categoryName,
    brandName: line.brandName,
    availableQuantity: line.availableQuantity ?? undefined,
    uomName: line.uomName,
    suggestedPrice: line.suggestSalePrice,
    outboundQuantity: line.outboundQuantity != null ? String(line.outboundQuantity) : '',
    actualPrice: line.actualSalePrice != null ? String(line.actualSalePrice) : '',
    settlementAmount: line.lineSettlementAmount != null ? String(line.lineSettlementAmount) : '',
    _key: ++rowKeySeed,
  }
  return detail
}

function onDetailSelectionChange(rows: DetailRow[]) {
  selectedDetailRows.value = rows
}

function onDeleteRows() {
  if (!selectedDetailRows.value.length) {
    ElMessage.warning('请先勾选要删除的行')
    return
  }
  const keys = new Set(selectedDetailRows.value.map((row) => row._key))
  details.value = details.value.filter((row) => !keys.has(row._key))
  selectedDetailRows.value = []
}

function onOutboundQuantityInput(row: DetailRow, value: string) {
  row.outboundQuantity = (value ?? '').replace(/[^\d]/g, '').slice(0, 8)
  recomputeSettlementAmount(row)
}

function onActualPriceInput(row: DetailRow, value: string) {
  const normalized = (value ?? '')
    .replace(/[^\d.]/g, '')
    .replace(/^(\d*\.?\d*).*$/, '$1')
  row.actualPrice = normalized
  recomputeSettlementAmount(row)
}

function recomputeSettlementAmount(row: DetailRow) {
  const quantity = toNumber(row.outboundQuantity)
  const price = toNumber(row.actualPrice)
  row.settlementAmount = quantity > 0 && price > 0 ? (quantity * price).toFixed(2) : ''
}

async function loadViewData(code: string) {
  detailLoading.value = true
  try {
    const res = await getSalesOutboundDetailViewApi(code)
    const view = (res as { data: SalesOutboundDetailViewVO }).data
    headerRemark.value = view.remark ?? ''
    sourceMain.value = {
      outboundCode: view.salesOutboundCode,
      warehouseCode: props.initialHeader?.warehouseCode ?? '',
      warehouseName: view.warehouseName ?? '',
      customerCode: props.initialHeader?.customerCode ?? '',
      customerName: view.customerName ?? '',
      productKindAmount: view.lines?.length ?? 0,
      settlementTotalAmount: Number(view.lineAmountTotal ?? 0),
      auditStatus: view.auditStatus,
      auditStatusName: mapStatusLabel(view.auditStatus, view.auditStatusDesc ?? ''),
      initiator: view.initiatorName ?? '',
      operationTime: view.operationTime != null ? String(view.operationTime) : '',
      auditor: view.auditorName ?? '',
      auditTime: view.auditTime != null ? String(view.auditTime) : '',
    }
    form.warehouseCode = props.initialHeader?.warehouseCode ?? ''
    form.warehouseName = view.warehouseName ?? props.initialHeader?.warehouseName ?? ''
    form.customerCode = props.initialHeader?.customerCode ?? ''
    form.customerName = view.customerName ?? props.initialHeader?.customerName ?? ''
    details.value = (view.lines ?? []).map(lineViewToDetailRow)
    records.value = (view.operationLogs ?? []).map((log, idx) => ({
      recordId: idx,
      operationTime: log.operationTime != null ? String(log.operationTime) : '',
      operator: log.operatorName ?? '',
      operationType: log.operationTypeDesc ?? String(log.operationType ?? ''),
      rejectReason: log.remark,
    }))
  } catch {
    ElMessage.error('加载销售出库单失败')
    visible.value = false
  } finally {
    detailLoading.value = false
  }
}

watch(
  () => [visible.value, props.mode, props.outboundCode] as const,
  async ([open, mode, code]) => {
    if (!open) return
    resetForm()
    await nextTick()
    if (mode === 'add') return
    if (!code) {
      ElMessage.error('缺少销售出库单号')
      visible.value = false
      return
    }
    await loadViewData(code)
  }
)

function validate(): boolean {
  if (!form.warehouseCode || !form.warehouseName.trim()) {
    ElMessage.warning('仓库必填，请重新输入。')
    return false
  }
  if (!form.customerCode || !form.customerName.trim()) {
    ElMessage.warning('客户必填，请重新输入。')
    return false
  }
  if (!details.value.length) {
    ElMessage.warning('商品列表至少存在一行，请新增行。')
    return false
  }
  const seen = new Set<string>()
  for (const row of details.value) {
    const productCode = row.productCode ?? ''
    if (seen.has(productCode)) {
      ElMessage.warning('商品重复，请重新选择。')
      return false
    }
    seen.add(productCode)
    const quantityText = String(row.outboundQuantity ?? '').trim()
    if (!quantityText) {
      ElMessage.warning('销售出库数量必填，请重新输入。')
      return false
    }
    const quantity = Number(quantityText)
    if (!/^\d+$/.test(quantityText) || quantity <= 0 || quantity > toNumber(row.availableQuantity)) {
      ElMessage.warning('销售出库数量输入有误，请重新输入。')
      return false
    }
    const priceText = String(row.actualPrice ?? '').trim()
    if (!priceText) {
      ElMessage.warning('实际销售价（元）必填，请重新输入。')
      return false
    }
    const price = Number(priceText)
    if (!/^\d+(\.\d{1,2})?$/.test(priceText) || price <= 0 || price > 99999999) {
      ElMessage.warning('实际销售价（元）输入有误，请重新输入。')
      return false
    }
  }
  return true
}

function buildSubmitDto(): SalesOutboundDto {
  const detailsPayload: SalesOutboundDetailDto[] = details.value.map((row) => ({
    productCode: row.productCode,
    productName: row.productName,
    categoryName: row.categoryName,
    brandName: row.brandName,
    availableQuantity: Number(row.availableQuantity ?? 0),
    outboundQuantity: Number(row.outboundQuantity),
    uomName: row.uomName,
    suggestedPrice: toNumber(row.suggestedPrice),
    actualPrice: Number(row.actualPrice),
    settlementAmount: toNumber(row.settlementAmount),
  }))
  return {
    outboundCode: sourceMain.value?.outboundCode,
    warehouseCode: form.warehouseCode,
    warehouseName: form.warehouseName,
    customerCode: form.customerCode,
    customerName: form.customerName,
    details: detailsPayload,
  }
}

function onSave() {
  if (isView.value) return
  if (!validate()) return
  emit('submit', buildSubmitDto())
}

function onSaveAndNew() {
  if (isView.value) return
  if (!validate()) return
  emit('submit', buildSubmitDto(), { saveAndNew: true })
}

function onCommit() {
  const code = sourceMain.value?.outboundCode ?? props.outboundCode
  if (!code) {
    ElMessage.warning('请先保存单据后再提交')
    return
  }
  emit('commit', code)
}

function onFooterCancel() {
  visible.value = false
}

function handleClosed() {
  resetForm()
}

function formatMoney(value: number | string | undefined | null) {
  if (value === undefined || value === null || value === '') return '-'
  const n = Number(value)
  return Number.isNaN(n) ? '-' : n.toFixed(2)
}

function toNumber(value: number | string | undefined | null) {
  if (value === undefined || value === null || value === '') return 0
  const n = Number(value)
  return Number.isNaN(n) ? 0 : n
}

function formatDateTimeText(value: string | undefined) {
  if (!value) return '-'
  if (value.includes('T')) return value.replace('T', ' ').slice(0, 19)
  return value.length >= 19 ? value.slice(0, 19) : value
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
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
.info-label {
  flex: 0 0 140px;
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
}
.total-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  color: #303133;
}
.total-amount {
  font-weight: 600;
  color: #f56c6c;
}
.record-block {
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px 12px;
}
.record-item {
  padding: 6px 0;
  border-bottom: 1px dashed #ebeef5;
}
.record-item:last-child {
  border-bottom: none;
}
.record-line {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #303133;
}
.record-user,
.record-action {
  color: #303133;
}
.record-remark {
  color: #f56c6c;
}
.record-time {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
.record-empty {
  color: #909399;
  font-size: 13px;
}
.popup-query {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
