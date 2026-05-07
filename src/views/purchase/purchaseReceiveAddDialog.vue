<template>
  <BaseDialog
    v-model="visible"
    :title="dialogTitle"
    width="1100px"
    :confirmable="!isView"
    :z-index="3020"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form v-loading="detailLoading" label-width="100px" @submit.prevent>
        <div v-if="isView" class="basic-info">
          <div class="info-item">
            <span class="info-label">采购入库单号：</span>
            <span class="info-value">{{ sourceMain?.purchaseReceiveCode || "-" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">仓库名称：</span>
            <span class="info-value">{{ form.warehouseName || "-" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">供应商名称：</span>
            <span class="info-value">{{ form.supplierName || "-" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核状态：</span>
            <span class="info-value">{{ sourceMain?.auditStatusName || "-" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发起人：</span>
            <span class="info-value">{{ sourceMain?.initiator || "-" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">操作时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.operationTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核人：</span>
            <span class="info-value">{{ sourceMain?.auditor || "-" }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.auditTime) }}</span>
          </div>
        </div>

        <div v-else class="header-row">
          <el-form-item label="仓库名称" :required="!isView">
            <div
              class="picker-input-wrap"
              role="button"
              tabindex="0"
              @click="onWarehouseFieldActivate"
              @keydown.enter.prevent="openWarehouseDialog"
              @keydown.space.prevent="openWarehouseDialog"
            >
              <el-input
                v-model="form.warehouseName"
                placeholder="请选择仓库"
                readonly
                :clearable="!isView"
                class="picker-readonly-input"
                style="width: 260px"
                @clear.stop="clearWarehouse"
              />
            </div>
          </el-form-item>
          <el-form-item label="供应商名称" :required="!isView">
            <div
              class="picker-input-wrap"
              role="button"
              tabindex="0"
              @click="onSupplierFieldActivate"
              @keydown.enter.prevent="openSupplierDialog"
              @keydown.space.prevent="openSupplierDialog"
            >
              <el-input
                v-model="form.supplierName"
                placeholder="请选择供应商"
                readonly
                :clearable="!isView"
                class="picker-readonly-input"
                style="width: 260px"
                @clear.stop="clearSupplier"
              />
            </div>
          </el-form-item>
        </div>

        <el-form-item label="商品列表" :required="!isView">
          <div class="detail-block">
            <div v-if="!isView" class="detail-actions">
              <el-button type="primary" plain :icon="Plus" @click="onAddRow">新增行</el-button>
              <el-button type="danger" plain :icon="Delete" @click="onDeleteRows">删除行</el-button>
            </div>

            <el-table v-if="isView" :data="details" style="width: 100%">
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="productCode" label="商品编号" width="140" />
              <el-table-column prop="productName" label="商品名称" min-width="200" />
              <el-table-column prop="categoryName" label="商品分类" width="120" />
              <el-table-column prop="brandName" label="商品品牌" width="120" />
              <el-table-column prop="purchaseQuantity" label="采购入库数量" width="150" />
              <el-table-column prop="uomName" label="商品单位" width="100" />
              <el-table-column prop="suggestPrice" label="建议采购价（元）" width="140" :formatter="moneyFormatter" />
              <el-table-column prop="actualPrice" label="实际采购价（元）" width="160" :formatter="moneyFormatter" />
              <el-table-column prop="settlementAmount" label="采购结算金额（元）" width="160" :formatter="moneyFormatter" />
            </el-table>

            <el-table
              v-else
              ref="tableRef"
              :data="details"
              border
              empty-text="暂无数据"
              style="width: 100%"
              @selection-change="onSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="productCode" label="商品编号" width="140" />
              <el-table-column label="商品名称" min-width="200">
                <template #default="{ row }">
                  <el-autocomplete
                    v-model="row.productName"
                    :fetch-suggestions="queryProducts"
                    :popper-style="{ zIndex: 4000 }"
                    placeholder="请输入商品编号/名称"
                    clearable
                    value-key="label"
                    style="width: 100%"
                    @select="(item: any) => onSelectProduct(row, item)"
                    @clear="() => clearProduct(row)"
                  >
                    <template #default="{ item }">
                      <span>{{ item.label }}</span>
                    </template>
                  </el-autocomplete>
                </template>
              </el-table-column>
              <el-table-column prop="categoryName" label="商品分类" width="120" />
              <el-table-column prop="brandName" label="商品品牌" width="120" />
              <el-table-column label="采购入库数量" width="150">
                <template #default="{ row }">
                  <el-input
                    v-model="row.purchaseQuantity"
                    placeholder="请输入数量"
                    clearable
                    @input="(v: string) => onQuantityInput(row, v)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="uomName" label="商品单位" width="100" />
              <el-table-column label="建议采购价（元）" width="140">
                <template #default="{ row }">
                  <span>{{ formatMoney(row.suggestPrice) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="实际采购价（元）" width="160">
                <template #default="{ row }">
                  <el-input
                    v-model="row.actualPrice"
                    placeholder="请输入价格"
                    clearable
                    @input="(v: string) => onPriceInput(row, v)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="采购结算金额（元）" width="160">
                <template #default="{ row }">
                  <span>{{ formatMoney(row.settlementAmount) }}</span>
                </template>
              </el-table-column>
            </el-table>

            <div class="total-row">
              <span>合计：</span>
              <span class="total-amount">{{ formatMoney(totalAmount) }}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="showRecords" label="操作记录">
          <div class="record-block">
            <div v-if="detailLoading" class="record-empty">加载中...</div>
            <template v-else-if="records.length">
              <div v-for="(r, idx) in records" :key="`${r.recordId ?? idx}-${idx}`" class="record-item">
                <div class="record-line">
                  <span class="record-user">{{ r.operator || "-" }}</span>
                  <span class="record-action">{{ r.operationType || "-" }}</span>
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

  <SelectWarehouseDialog
    v-model="warehouseDialogVisible"
    :initial-code="form.warehouseCode"
    @select="onWarehouseSelected"
  />
  <SelectSupplierDialog
    v-model="supplierDialogVisible"
    :initial-code="form.supplierCode"
    @select="onSupplierSelected"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import SelectWarehouseDialog from "./selectWarehouseDialog.vue";
import SelectSupplierDialog from "./selectSupplierDialog.vue";
import type {
  PurchaseReceiveDetailDto,
  PurchaseReceiveDto,
  PurchaseReceiveDetailViewVO,
  PurchaseReceiveRecordVO,
  PurchaseReceiveVO,
} from "@/type/purchaseReceive";
import type { ProductVO } from "@/type/product";
import { queryAllProductsApi } from "@/api/product/manager";
import { getPurchaseReceiveDetailViewApi } from "@/api/product/purchaseReceive";
import { getExpenditureSettlementRelatedBillApi } from "@/api/product/expenditureSettlement";
import { useUserStore } from "@/stores/user";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    /** 新增 / 修改 / 只读查看 */
    mode?: "add" | "edit" | "view";
    /** 查看时：采购入库单号 */
    purchaseReceiveCode?: string;
    /**
     * 支出结算场景：传入后查看模式走 GET /expenditure-settlement/{code}/related-bill，
     * 避免结算角色被采购 assertViewScope 拒绝
     */
    expenditureSettlementCode?: string;
  }>(),
  { mode: "add" }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: PurchaseReceiveDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const isView = computed(() => props.mode === "view");
const isEdit = computed(() => props.mode === "edit");
const showRecords = computed(() => isView.value || isEdit.value);
const dialogTitle = computed(() => {
  if (isView.value) return "查看采购入库单";
  if (isEdit.value && props.purchaseReceiveCode) {
    return `修改采购入库单（${props.purchaseReceiveCode}）`;
  }
  return isEdit.value ? "修改采购入库单" : "新增采购入库单";
});

const userStore = useUserStore();
const detailLoading = ref(false);
const records = ref<PurchaseReceiveRecordVO[]>([]);
const sourceMain = ref<PurchaseReceiveVO | null>(null);

interface DetailRow extends PurchaseReceiveDetailDto {
  _key: number;
}

const form = reactive<{
  warehouseCode: string;
  warehouseName: string;
  supplierCode: string;
  supplierName: string;
}>({
  warehouseCode: "",
  warehouseName: "",
  supplierCode: "",
  supplierName: "",
});

const details = ref<DetailRow[]>([]);
const selectedRows = ref<DetailRow[]>([]);
let rowKeySeed = 0;

const warehouseDialogVisible = ref(false);
const supplierDialogVisible = ref(false);

const openWarehouseDialog = () => {
  if (isView.value) return;
  warehouseDialogVisible.value = true;
};
const openSupplierDialog = () => {
  if (isView.value) return;
  supplierDialogVisible.value = true;
};

function isClearIconTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el?.closest?.(".el-input__clear");
}

function onWarehouseFieldActivate(e: MouseEvent) {
  if (isClearIconTarget(e.target)) return;
  openWarehouseDialog();
}

function onSupplierFieldActivate(e: MouseEvent) {
  if (isClearIconTarget(e.target)) return;
  openSupplierDialog();
}

const onWarehouseSelected = (row: { warehouseCode: string; warehouseName: string }) => {
  form.warehouseCode = row.warehouseCode;
  form.warehouseName = row.warehouseName;
};
const clearWarehouse = () => {
  if (isView.value) return;
  form.warehouseCode = "";
  form.warehouseName = "";
};
const onSupplierSelected = (row: { supplierCode: string; supplierName: string }) => {
  form.supplierCode = row.supplierCode;
  form.supplierName = row.supplierName;
};
const clearSupplier = () => {
  if (isView.value) return;
  form.supplierCode = "";
  form.supplierName = "";
};

const onAddRow = () => {
  details.value.push({
    _key: ++rowKeySeed,
    productCode: "",
    productName: "",
    categoryName: "",
    brandName: "",
    uomName: "",
    suggestPrice: "",
    actualPrice: "",
    purchaseQuantity: "",
    settlementAmount: "",
  });
};

const onSelectionChange = (rows: DetailRow[]) => {
  selectedRows.value = rows;
};

const onDeleteRows = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning("请先勾选要删除的行");
    return;
  }
  const keys = new Set(selectedRows.value.map((r) => r._key));
  details.value = details.value.filter((r) => !keys.has(r._key));
  selectedRows.value = [];
};

let lastProductPrereqWarnAt = 0;
const PRODUCT_PREREQ_WARN_THROTTLE_MS = 2000;

const queryProducts = async (queryString: string, cb: (items: any[]) => void) => {
  if (!form.warehouseCode || !form.supplierCode) {
    cb([]);
    const now = Date.now();
    if (now - lastProductPrereqWarnAt > PRODUCT_PREREQ_WARN_THROTTLE_MS) {
      lastProductPrereqWarnAt = now;
      ElMessage.warning("请先选择仓库和供应商");
    }
    return;
  }
  try {
    const res = await queryAllProductsApi({
      pageNum: 1,
      pageSize: 20,
      keyword: queryString || "",
      status: 1,
    });
    const list: ProductVO[] = res.data?.list ?? [];
    cb(
      list.map((p) => ({
        label: `${p.productName}（${p.productCode}）`,
        product: p,
      }))
    );
  } catch (e) {
    cb([]);
  }
};

const onSelectProduct = (row: DetailRow, item: { product: ProductVO }) => {
  const p = item.product;
  row.productName = p.productName;
  row.productCode = p.productCode;
  row.categoryName = p.categoryName;
  row.brandName = p.brandName;
  row.uomName = p.uomName;
  row.suggestPrice = p.suggestPurchasePrice;
  recomputeSettlement(row);
};

const clearProduct = (row: DetailRow) => {
  row.productName = "";
  row.productCode = "";
  row.categoryName = "";
  row.brandName = "";
  row.uomName = "";
  row.suggestPrice = "";
  recomputeSettlement(row);
};

const INT_RE = /^\d+$/;
const DECIMAL_RE = /^\d+(\.\d{1,2})?$/;

function onQuantityInput(row: DetailRow, v: string) {
  const cleaned = (v ?? "").replace(/[^\d]/g, "").slice(0, 8);
  row.purchaseQuantity = cleaned;
  recomputeSettlement(row);
}

function onPriceInput(row: DetailRow, v: string) {
  let cleaned = (v ?? "").replace(/[^\d.]/g, "");
  const dotIdx = cleaned.indexOf(".");
  if (dotIdx >= 0) {
    cleaned = cleaned.slice(0, dotIdx + 1) + cleaned.slice(dotIdx + 1).replace(/\./g, "");
    const [rawIntPart = "", rawDecPart = ""] = cleaned.split(".");
    cleaned = `${rawIntPart.slice(0, 8)}.${rawDecPart.slice(0, 2)}`;
  } else {
    cleaned = cleaned.slice(0, 8);
  }
  row.actualPrice = cleaned;
  recomputeSettlement(row);
}

function recomputeSettlement(row: DetailRow) {
  const q = Number(row.purchaseQuantity);
  const p = Number(row.actualPrice);
  if (!isNaN(q) && q > 0 && !isNaN(p) && p > 0) {
    row.settlementAmount = (q * p).toFixed(2);
  } else {
    row.settlementAmount = "";
  }
}

const totalAmount = computed(() => {
  return details.value.reduce((acc, r) => {
    const v = Number(r.settlementAmount);
    return acc + (isNaN(v) ? 0 : v);
  }, 0);
});

function formatMoney(v: number | string | undefined): string {
  if (v === undefined || v === "" || v === null) return "-";
  const n = Number(v);
  if (isNaN(n)) return "-";
  return n.toFixed(2);
}

function moneyFormatter(_row: unknown, _col: unknown, cell: unknown): string {
  return formatMoney(cell as number | string | undefined);
}

function resetForm() {
  form.warehouseCode = "";
  form.warehouseName = "";
  form.supplierCode = "";
  form.supplierName = "";
  details.value = [];
  selectedRows.value = [];
  rowKeySeed = 0;
  records.value = [];
  sourceMain.value = null;
}

async function loadViewData(purchaseCode: string) {
  detailLoading.value = true;
  try {
    const settlementCode =
      props.mode === "view" ? props.expenditureSettlementCode?.trim() : undefined;
    const res = settlementCode
      ? ((await getExpenditureSettlementRelatedBillApi(settlementCode)) as {
          data: PurchaseReceiveDetailViewVO;
        })
      : ((await getPurchaseReceiveDetailViewApi(purchaseCode)) as {
          data: PurchaseReceiveDetailViewVO;
        });
    const view = res.data;
    if (!view?.purchaseReceiveCode) {
      ElMessage.error("加载采购入库单失败");
      visible.value = false;
      return;
    }
    sourceMain.value = {
      purchaseReceiveCode: view.purchaseReceiveCode ?? "",
      warehouseCode: "",
      warehouseName: view.warehouseName ?? "",
      supplierCode: "",
      supplierName: view.supplierName ?? "",
      purchaseKindAmount: view.lines?.length ?? 0,
      purchaseAmount: Number(view.lineAmountTotal ?? 0),
      auditStatus: view.auditStatus ?? 0,
      auditStatusName: view.auditStatusDesc ?? "",
      initiator: view.initiatorName ?? "",
      operationTime: view.operationTime != null ? String(view.operationTime) : "",
      auditor: view.auditorName ?? "",
      auditTime: view.auditTime != null ? String(view.auditTime) : "",
    };
    form.warehouseCode = "";
    form.warehouseName = view.warehouseName ?? "";
    form.supplierCode = "";
    form.supplierName = view.supplierName ?? "";
    details.value = (view.lines ?? []).map((line) => ({
      _key: ++rowKeySeed,
      productCode: line.productCode ?? "",
      productName: line.productName ?? "",
      categoryName: line.categoryName ?? "",
      brandName: line.brandName ?? "",
      uomName: line.uomName ?? "",
      suggestPrice:
        line.suggestPurchasePrice != null ? String(line.suggestPurchasePrice) : "",
      actualPrice:
        line.actualPurchasePrice != null ? String(line.actualPurchasePrice) : "",
      purchaseQuantity:
        line.purchaseQuantity != null ? String(line.purchaseQuantity) : "",
      settlementAmount:
        line.purchaseAmount != null ? String(line.purchaseAmount) : "",
    }));
    records.value = (view.operationLogs ?? []).map((log, idx) => ({
      recordId: idx,
      operationTime: log.operationTime != null ? String(log.operationTime) : "",
      operator: log.operatorName,
      operationType: log.operationTypeDesc ?? String(log.operationType ?? ""),
      rejectReason: log.remark,
    }));
  } catch {
    ElMessage.error("加载采购入库单失败");
    visible.value = false;
  } finally {
    detailLoading.value = false;
  }
}

watch(
  () =>
    [visible.value, props.mode, props.purchaseReceiveCode, props.expenditureSettlementCode] as const,
  async ([open, mode, code]) => {
    if (!open) return;
    if (mode === "add") {
      resetForm();
      await nextTick();
      return;
    }
    if (mode === "view" || mode === "edit") {
      const useSettlementBill =
        props.mode === "view" && Boolean(props.expenditureSettlementCode?.trim());
      if (!code && !useSettlementBill) {
        ElMessage.error("缺少采购入库单号");
        visible.value = false;
        return;
      }
      resetForm();
      await nextTick();
      await loadViewData(code ?? "");
    }
  }
);

function validate(): boolean {
  if (!form.warehouseCode) {
    ElMessage.warning("仓库必填，请重新输入。");
    return false;
  }
  if (!form.supplierCode) {
    ElMessage.warning("供应商必填，请重新输入。");
    return false;
  }
  if (details.value.length === 0) {
    ElMessage.warning("商品列表至少存在一行，请新增行。");
    return false;
  }

  const seen = new Set<string>();
  for (const row of details.value) {
    if (!row.productName || !row.productCode) {
      ElMessage.warning("商品名称必填，请重新输入。");
      return false;
    }
    if (seen.has(row.productCode)) {
      ElMessage.warning("商品重复，请重新选择。");
      return false;
    }
    seen.add(row.productCode);

    const q = String(row.purchaseQuantity ?? "").trim();
    if (!q) {
      ElMessage.warning("采购入库数量必填，请重新输入。");
      return false;
    }
    if (!INT_RE.test(q) || Number(q) <= 0 || q.length > 8) {
      ElMessage.warning("采购入库数量入库输入有误，请重新输入。");
      return false;
    }

    const price = String(row.actualPrice ?? "").trim();
    if (!price) {
      ElMessage.warning("实际采购价（元）必填，请重新输入。");
      return false;
    }
    if (!DECIMAL_RE.test(price) || Number(price) <= 0 || price.replace(".", "").length > 10) {
      ElMessage.warning("实际采购价（元）输入有误，请重新输入。");
      return false;
    }
  }
  return true;
}

const handleConfirm = () => {
  if (isView.value) return;
  if (!validate()) return;

  const detailsPayload: PurchaseReceiveDetailDto[] = details.value.map((r) => ({
    productCode: r.productCode,
    productName: r.productName,
    categoryName: r.categoryName,
    brandName: r.brandName,
    uomName: r.uomName,
    suggestPrice: r.suggestPrice === "" ? undefined : Number(r.suggestPrice),
    actualPrice: Number(r.actualPrice),
    purchaseQuantity: Number(r.purchaseQuantity),
    settlementAmount: Number(r.settlementAmount),
  }));

  const dto: PurchaseReceiveDto = {
    purchaseReceiveCode: sourceMain.value?.purchaseReceiveCode,
    warehouseCode: form.warehouseCode,
    warehouseName: form.warehouseName,
    supplierCode: form.supplierCode,
    supplierName: form.supplierName,
    purchaseKindAmount: detailsPayload.length,
    purchaseAmount: Number(totalAmount.value.toFixed(2)),
    auditStatus: isEdit.value ? sourceMain.value?.auditStatus : 0,
    initiator: isEdit.value ? sourceMain.value?.initiator : userStore.userInfo?.userName,
    auditor: isEdit.value ? sourceMain.value?.auditor : undefined,
    auditTime: isEdit.value ? sourceMain.value?.auditTime : undefined,
    details: detailsPayload,
  };

  emit("submit", dto);
};

const handleCancel = () => {
  visible.value = false;
};

const handleClosed = () => {
  resetForm();
};

function formatDateTimeText(v: string | undefined) {
  if (!v) return "-";
  if (v.includes("T")) return v.replace("T", " ").slice(0, 19);
  return v.length >= 19 ? v.slice(0, 19) : v;
}
</script>

<style scoped>
.header-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.picker-input-wrap {
  display: inline-block;
  cursor: pointer;
  outline: none;
}
.picker-readonly-input :deep(.el-input__wrapper) {
  cursor: pointer;
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
  display: flex;
  gap: 12px;
}
.total-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  font-size: 14px;
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
