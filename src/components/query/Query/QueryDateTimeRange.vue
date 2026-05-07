<template>
  <el-date-picker
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    type="datetimerange"
    range-separator="至"
     value-format="YYYY-MM-DD HH:mm:ss"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: [string, string] | null;
}>();
const emit = defineEmits<{
    (e:'update:modelValue',value:[string,string] | null): void
}>()
</script>
