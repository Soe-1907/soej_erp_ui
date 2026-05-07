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
      <el-form v-loading="detailLoading" label-width="140px" @submit.prevent>
        <div v-if="isView" class="basic-info">
          <div class="info-item">
            <span class="info-label">采购退货单号：</span>
            <span class="info-value">{{ sourceMain?.returnCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关联采购入库单号：</span>
            <span class="info-value">{{ form.purchaseReceiveCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">仓库名称：</span>
            <span class="info-value">{{ form.warehouseName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">供应商名称：</span>
            <span class="info-value">{{ form.supplierName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核状态：</span>
            <span class="info-value">{{ sourceMain?.auditStatusName || '-' }}</span>
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
          <el-form-item label="关联采购入库单号" required>
            <el-input
              v-model="form.purchaseReceiveCode"
              placeholder="请输入关联采购入库单号"
              clearable
              style="width: 280px"
              @change="loadReceiveForReturn"
              @clear="clearReceive"
            />
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="form.warehouseName" readonly placeholder="自动带入" style="width: 220px" />
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-input v-model="form.supplierName" readonly placeholder="自动带入" style="width: 220px" />
          </el-form-item>
        </div>

        <el-form-item label="商品列表" :required="!isView">
          <div class="detail-block">
            <div v-if="!isView" class="detail-actions">
              <el-button type="danger" plain :icon="Delete" @click="onDeleteRows">删除行</el-button>
            </div>

            <el-table v-if="isView" :data="displayDetails" style="width: 100%">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="productCode" label="商品编号" width="130" />
              <el-table-column prop="productName" label="商品名称" width="160" />
              <el-table-column prop="categoryName" label="商品分类" width="120" />
              <el-table-column prop="brandName" label="商品品牌" width="120" />
              <el-table-column prop="purchaseQuantity" label="采购入库数量" width="130" />
              <el-table-column prop="uomName" label="商品单位" width="100" />
              <el-table-column prop="actualPrice" label="实际采购价（元）" width="140" :formatter="moneyFormatter" />
              <el-table-column prop="settlementAmount" label="采购结算金额（元）" width="160" :formatter="moneyFormatter" />
              <el-table-column
                v-if="showStockColumns"
                prop="availableStock"
                label="可用库存数量"
                width="130"
              />
              <el-table-column
                v-if="showStockColumns"
                prop="returnableQuantity"
                label="可退数量"
                width="110"
              />
              <el-table-column prop="returnQuantity" label="采退数量" width="130" />
              <el-table-column prop="returnItemAmount" label="采退金额（元）" width="140" :formatter="moneyFormatter" />
            </el-table>

            <el-table
              v-else
              ref="tableRef"
              :data="displayDetails"
              border
              style="width: 100%"
              @selection-change="onSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="productCode" label="商品编号" width="130" />
              <el-table-column prop="productName" label="商品名称" width="160" />
              <el-table-column prop="categoryName" label="商品分类" width="120" />
              <el-table-column prop="brandName" label="商品品牌" width="120" />
              <el-table-column prop="purchaseQuantity" label="采购入库数量" width="130" />
              <el-table-column prop="uomName" label="商品单位" width="100" />
              <el-table-column label="实际采购价（元）" width="140">
                <template #default="{ row }">{{ formatMoney(row.actualPrice) }}</template>
              </el-table-column>
              <el-table-column label="采购结算金额（元）" width="160">
                <template #default="{ row }">{{ formatMoney(row.settlementAmount) }}</template>
              </el-table-column>
              <el-table-column
                v-if="showStockColumns"
                prop="availableStock"
                label="可用库存数量"
                width="130"
              />
              <el-table-column
                v-if="showStockColumns"
                prop="returnableQuantity"
                label="可退数量"
                width="110"
              />
              <el-table-column label="采退数量" width="130">
                <template #default="{ row }">
                  <el-input
                    v-model="row.returnQuantity"
                    placeholder="请输入"
                    clearable
                    @input="(v: string) => onReturnQuantityInput(row, v)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="采退金额（元）" width="140">
                <template #default="{ row }">{{ formatMoney(row.returnItemAmount) }}</template>
              </el-table-column>
            </el-table>

            <div class="total-row">
              <span>合计：</span>
              <span>采购结算金额 {{ formatMoney(totalSettlementAmount) }}</span>
              <span class="total-amount">采退金额 {{ formatMoney(totalReturnAmount) }}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="showRecords" label="操作记录">
          <div class="record-block">
            <div v-if="detailLoading" class="record-empty">加载中...</div>
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
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { useUserStore } from '@/stores/user'
import type { PurchaseReceiveDetailViewVO } from '@/type/purchaseReceive'
import type {
  PurchaseReturnDetailDto,
  PurchaseReturnDetailLineVO,
  PurchaseReturnDetailViewVO,
  PurchaseReturnDetailVO,
  PurchaseReturnDto,
  PurchaseReturnRecordVO,
  PurchaseReturnVO,
} from '@/type/purchaseReturn'
import { getPurchaseReceiveDetailViewApi } from '@/api/product/purchaseReceive'
import {
  getPurchaseReturnDetailViewApi,
  listReturnableLinesApi,
} from '@/api/product/purchaseReturn'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    mode?: 'add' | 'edit' | 'view'
    returnCode?: string
  }>(),
  { mode: 'add' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', dto: PurchaseReturnDto): void
}>()

interface DetailRow extends PurchaseReturnDetailVO {
  _key: number
}

const userStore = useUserStore()
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const isView = computed(() => props.mode === 'view')
const isEdit = computed(() => props.mode === 'edit')
const showRecords = computed(() => isView.value || isEdit.value)
const showStockColumns = computed(() => !isView.value || sourceMain.value?.auditStatus !== 2)
const dialogTitle = computed(() => {
  if (isView.value) return '查看采购退货单'
  return isEdit.value ? '修改采购退货单' : '新增采购退货单'
})

const detailLoading = ref(false)
const records = ref<PurchaseReturnRecordVO[]>([])
const sourceMain = ref<PurchaseReturnVO | null>(null)
const selectedRows = ref<DetailRow[]>([])
const details = ref<DetailRow[]>([])
let rowKeySeed = 0

const form = reactive({
  purchaseReceiveCode: '',
  warehouseCode: '',
  warehouseName: '',
  supplierCode: '',
  supplierName: '',
})

const displayDetails = computed(() => details.value)
const totalSettlementAmount = computed(() =>
  details.value.reduce((sum, row) => sum + toNumber(row.settlementAmount), 0)
)
const totalReturnAmount = computed(() =>
  details.value.reduce((sum, row) => sum + toNumber(row.returnItemAmount), 0)
)

function resetForm() {
  form.purchaseReceiveCode = ''
  form.warehouseCode = ''
  form.warehouseName = ''
  form.supplierCode = ''
  form.supplierName = ''
  details.value = []
  selectedRows.value = []
  records.value = []
  sourceMain.value = null
  rowKeySeed = 0
}

async function loadReceiveForReturn() {
  const code = form.purchaseReceiveCode.trim()
  if (!code) {
    clearReceive()
    return
  }
  if (!userStore.userInfo?.userName) {
    ElMessage.warning('当前登录用户异常，请重新登录。')
    return
  }
  detailLoading.value = true
  try {
    const [linesRes, headerRes] = await Promise.all([
      listReturnableLinesApi(code),
      getPurchaseReceiveDetailViewApi(code),
    ])
    const header = (headerRes as { data?: PurchaseReceiveDetailViewVO }).data
    const lines = (linesRes as { data?: PurchaseReturnDetailLineVO[] }).data ?? []
    form.purchaseReceiveCode = header?.purchaseReceiveCode ?? code
    form.warehouseCode = ''
    form.warehouseName = header?.warehouseName ?? ''
    form.supplierCode = ''
    form.supplierName = header?.supplierName ?? ''
    details.value = lines.map(toDetailRowFromPreviewLine)
  } catch {
    clearReceive(false)
  } finally {
    detailLoading.value = false
  }
}

function clearReceive(clearCode = true) {
  if (clearCode) form.purchaseReceiveCode = ''
  form.warehouseCode = ''
  form.warehouseName = ''
  form.supplierCode = ''
  form.supplierName = ''
  details.value = []
  selectedRows.value = []
}

function settlementFromLine(line: PurchaseReturnDetailLineVO): string {
  const v = line.purchaseLineSettlementAmount ?? line.purchaseAmount
  if (v == null) return ''
  return String(v)
}

function toDetailRowFromPreviewLine(line: PurchaseReturnDetailLineVO): DetailRow {
  const detail: DetailRow = {
    ...line,
    _key: ++rowKeySeed,
    actualPrice:
      line.actualPurchasePrice != null ? String(line.actualPurchasePrice) : '',
    settlementAmount: settlementFromLine(line),
    availableStock: line.availableQuantity,
    returnQuantity: '',
    returnItemAmount: '',
  }
  recomputeReturnAmount(detail)
  return detail
}

function toDetailRowFromSavedLine(line: PurchaseReturnDetailLineVO): DetailRow {
  const detail: DetailRow = {
    ...line,
    _key: ++rowKeySeed,
    actualPrice:
      line.actualPurchasePrice != null ? String(line.actualPurchasePrice) : '',
    settlementAmount: settlementFromLine(line),
    availableStock: line.availableQuantity,
    returnQuantity: line.returnQuantity != null ? String(line.returnQuantity) : '',
    returnItemAmount: line.returnAmount != null ? String(line.returnAmount) : '',
  }
  recomputeReturnAmount(detail)
  return detail
}

function onSelectionChange(rows: DetailRow[]) {
  selectedRows.value = rows
}

function onDeleteRows() {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先勾选要删除的行')
    return
  }
  const keys = new Set(selectedRows.value.map((r) => r._key))
  details.value = details.value.filter((r) => !keys.has(r._key))
  selectedRows.value = []
}

function onReturnQuantityInput(row: DetailRow, value: string) {
  row.returnQuantity = (value ?? '').replace(/[^\d]/g, '').slice(0, 8)
  recomputeReturnAmount(row)
}

function recomputeReturnAmount(row: DetailRow) {
  const quantity = toNumber(row.returnQuantity)
  const price = toNumber(row.actualPrice)
  row.returnItemAmount = quantity > 0 && price > 0 ? (quantity * price).toFixed(2) : ''
}

async function loadViewData(code: string) {
  detailLoading.value = true
  try {
    const res = (await getPurchaseReturnDetailViewApi(code)) as { data: PurchaseReturnDetailViewVO }
    const view = res.data
    if (!view?.purchaseReturnCode) {
      ElMessage.error('加载采购退货单失败')
      visible.value = false
      return
    }
    sourceMain.value = {
      returnCode: view.purchaseReturnCode ?? '',
      purchaseReceiveCode: view.refPurchaseReceiveCode ?? '',
      warehouseCode: '',
      warehouseName: view.warehouseName ?? '',
      supplierCode: '',
      supplierName: view.supplierName ?? '',
      returnKindAmount: view.lines?.length ?? 0,
      returnAmount: Number(view.lineAmountTotal ?? 0),
      auditStatus: view.auditStatus ?? 0,
      auditStatusName: view.auditStatusDesc ?? '',
      initiator: view.initiatorName ?? '',
      operationTime: view.operationTime != null ? String(view.operationTime) : '',
      auditor: view.auditorName,
      auditTime: view.auditTime != null ? String(view.auditTime) : '',
    }
    form.purchaseReceiveCode = view.refPurchaseReceiveCode ?? ''
    form.warehouseCode = ''
    form.warehouseName = view.warehouseName ?? ''
    form.supplierCode = ''
    form.supplierName = view.supplierName ?? ''
    details.value = (view.lines ?? []).map(toDetailRowFromSavedLine)
    records.value = (view.operationLogs ?? []).map((log, idx) => ({
      recordId: idx,
      operationTime: log.operationTime != null ? String(log.operationTime) : '',
      operator: log.operatorName,
      operationType: log.operationTypeDesc ?? String(log.operationType ?? ''),
      rejectReason: log.remark,
    }))
  } catch {
    ElMessage.error('加载采购退货单失败')
    visible.value = false
  } finally {
    detailLoading.value = false
  }
}

watch(
  () => [visible.value, props.mode, props.returnCode] as const,
  async ([open, mode, code]) => {
    if (!open) return
    resetForm()
    await nextTick()
    if (mode === 'add') return
    if (!code) {
      ElMessage.error('缺少采购退货单号')
      visible.value = false
      return
    }
    await loadViewData(code)
  }
)

function validate(): boolean {
  if (!form.purchaseReceiveCode.trim()) {
    ElMessage.warning('关联采购入库单必填，请重新输入。')
    return false
  }
  if (!details.value.length) {
    ElMessage.warning('商品列表至少存在一行，请重新关联。')
    return false
  }
  const seen = new Set<string>()
  for (const row of details.value) {
    const productCode = row.productCode ?? ''
    if (seen.has(productCode)) {
      ElMessage.warning('商品重复，请重新关联。')
      return false
    }
    seen.add(productCode)
    const quantityText = String(row.returnQuantity ?? '').trim()
    if (!quantityText) {
      ElMessage.warning('采退数量必填，请重新输入。')
      return false
    }
    const quantity = Number(quantityText)
    const limit = Math.min(toNumber(row.availableStock), toNumber(row.returnableQuantity))
    if (!/^\d+$/.test(quantityText) || quantity <= 0 || quantity > limit) {
      ElMessage.warning('采退数量输入有误，请重新输入。')
      return false
    }
  }
  return true
}

function handleConfirm() {
  if (isView.value) return
  if (!validate()) return
  const detailsPayload: PurchaseReturnDetailDto[] = details.value.map((row) => ({
    productCode: row.productCode,
    productName: row.productName,
    categoryName: row.categoryName,
    brandName: row.brandName,
    uomName: row.uomName,
    purchaseQuantity: Number(row.purchaseQuantity),
    actualPrice: Number(row.actualPrice),
    settlementAmount: Number(row.settlementAmount),
    returnQuantity: Number(row.returnQuantity),
  }))
  emit('submit', {
    returnCode: sourceMain.value?.returnCode,
    purchaseReceiveCode: form.purchaseReceiveCode,
    warehouseCode: form.warehouseCode,
    warehouseName: form.warehouseName,
    supplierCode: form.supplierCode,
    supplierName: form.supplierName,
    details: detailsPayload,
  })
}

function handleCancel() {
  visible.value = false
}

function handleClosed() {
  resetForm()
}

function formatMoney(value: number | string | undefined | null) {
  const n = toNumber(value)
  return n > 0 ? n.toFixed(2) : '-'
}

function moneyFormatter(_row: unknown, _col: unknown, cell: unknown): string {
  return formatMoney(cell as number | string | undefined | null)
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
.header-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}
.basic-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: 14px;
  column-gap: 48px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  color: #303133;
}
.info-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.info-label {
  color: #303133;
  font-weight: 600;
  white-space: nowrap;
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
}
.record-item {
  padding: 4px 0;
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
  margin-top: 0;
  font-size: 12px;
  color: #909399;
}
.record-empty {
  color: #909399;
  font-size: 13px;
}
</style>
