<template>
  <el-select
    :model-value="modelValue"
    placeholder="请选择"
    class="query-status-select-inner"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
const options = [
  { value: 1, label: "启用" },
  { value: 0, label: "禁用" },
];
defineProps<{
  modelValue: number | undefined;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | undefined): void;
}>();
</script>

<style scoped>
.query-status-select-inner {
  width: 100%;
}
</style>
