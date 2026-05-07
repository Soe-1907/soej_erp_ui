<template>
  <el-select
    :model-value="modelValue"
    placeholder="请输入"
    style="width: 240px"
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
import type { SelectOption } from "@/type/select";

defineProps<{
  modelValue: number | null;
  options: SelectOption[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();
</script>
