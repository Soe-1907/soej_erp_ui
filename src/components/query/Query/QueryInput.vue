<template>
  <el-input
    :placeholder="placeholder"
    :model-value="modelValue"
     style="width: 240px"
    clearable
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
}>(), {
  placeholder: '请输入'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const onUpdate = (v: string) => {
  emit('update:modelValue', v)
}
</script>
