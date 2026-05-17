<template>
  <BaseDialog
    v-model="visible"
    title="查看收入结算单"
    width="620px"
    :confirmable="false"
  >
    <template #dialogContent>
      <div class="basic-info">
        <div class="info-item">
          <span class="info-label">收入结算单号：</span>
          <span class="info-value">{{ settlement?.incomeSettlementCode || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">单据类型：</span>
          <span class="info-value">{{ settlement?.bizTypeName || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">涉及金额：</span>
          <span class="info-value">{{ formatMoney(settlement?.amount) }} 元</span>
        </div>
        <div class="info-item related-item">
          <span class="info-label">关联单据号：</span>
          <span class="info-value">{{ settlement?.relatedBillCode || '-' }}</span>
          <el-button
            type="primary"
            link
            size="small"
            :disabled="!canViewRelatedDetail"
            @click="emit('view-detail')"
          >
            查看详情
          </el-button>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import type { IncomeSettlementVO } from '@/type/incomeSettlement'

const props = defineProps<{
  modelValue: boolean
  settlement?: IncomeSettlementVO | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'view-detail'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

/** 仅销售出库 / 采购退货可打开对应业务详情 */
const canViewRelatedDetail = computed(() => {
  const s = props.settlement
  if (!s?.relatedBillCode) return false
  return s.sourceType === 1 || s.sourceType === 2
})

function formatMoney(value: unknown) {
  if (value == null || value === '') return '-'
  const n = Number(value)
  return Number.isNaN(n) ? '-' : n.toFixed(2)
}
</script>

<style scoped>
.basic-info {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 8px 4px;
}

.info-item {
  display: flex;
  align-items: center;
  min-height: 28px;
}

.info-label {
  width: 120px;
  color: #606266;
  text-align: right;
}

.info-value {
  color: #303133;
}

.related-item {
  gap: 8px;
}
</style>
