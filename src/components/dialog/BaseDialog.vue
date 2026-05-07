<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    :z-index="zIndex"
    @closed="emit('close')"
  >
    <slot name="dialogContent"></slot>

    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <template v-if="confirmable">
            <el-button type="primary" @click="handleConfirm">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </template>
          <el-button v-else type="primary" @click="handleCancel">关闭</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    width: string | number
    formLabelWidth?: string
    /** 为 false 时只显示「关闭」按钮（如查看态） */
    confirmable?: boolean
    /** 嵌套弹窗时提高层级，避免被父级 el-dialog 遮挡 */
    zIndex?: number
    /** 是否挂载到 body（默认 true，与 Element Plus 一致） */
    appendToBody?: boolean
  }>(),
  { confirmable: true, appendToBody: true }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "close"): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const handleConfirm = () => {
  emit("confirm"); // ✅ 不自动关闭
};

const handleCancel = () => {
  emit("cancel");
  visible.value = false; // ✅ cancel 直接关闭
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
