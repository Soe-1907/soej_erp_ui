<template>
  <el-dialog
    v-model="visible"
    title="查看客户"
    width="700px"
    @close="handleClose"
  >
    <div v-if="data" class="detail-dialog-body">
      <DetailFieldGrid :rows="detailRows" />
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CustomerVO } from "@/type/customer";
import DetailFieldGrid from "@/components/detail/DetailFieldGrid.vue";

const props = defineProps<{
  modelValue: boolean;
  data: CustomerVO | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const detailRows = computed(() => {
  const d = props.data;
  if (!d) return [];
  const pay = d.checkoutMethod?.trim() || "—";
  return [
    ["客户名称", d.customerName, "联系人", d.contactName],
    ["联系电话", d.mobile, "地址", d.address],
    ["结账方式", pay, "", ""],
  ];
});

const handleClose = () => {
  visible.value = false;
};
</script>

<style scoped>
.detail-dialog-body {
  padding: 8px 4px 0;
}
</style>
