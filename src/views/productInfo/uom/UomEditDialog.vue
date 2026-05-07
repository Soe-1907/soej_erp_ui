<template>
  <BaseDialog
    v-model="visible"
    title="修改商品单位"
    width="500"
    formLabelWidth="100px"
    @confirm="handleConfirm"
  >
    <template #dialogContent>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="商品单位名称" prop="uomName">
          <el-input v-model="form.uomName" placeholder="请输入商品单位名称" />
        </el-form-item>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import type { FormInstance, FormRules } from "element-plus";
import type { UomDto, UomVO } from "@/type/uom";

const props = defineProps<{
  modelValue: boolean;      // v-model 默认就是 modelValue
  data: UomVO | null;       // 父组件传入当前行
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: UomDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const rules: FormRules = {
  uomName: [
    { required: true, message: "商品单位名称必填，请重新输入。", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        const v = typeof value === "string" ? value.trim() : "";
        if (!v) {
          callback(new Error("商品单位名称必填，请重新输入。"));
          return;
        }
        if (v.length > 16) {
          callback(new Error("商品单位名称输入有误，请重新输入。"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
};

const formRef = ref<FormInstance>();

// 重要：用 form 复制一份，不要直接用 props.data（避免表格行被你编辑时实时变化）
const form = reactive<UomDto>({
  uomId: undefined,
  uomName: "",
  status: 1,
});

// ✅ 打开弹窗时回显数据
watch(
  () => [visible.value, props.data] as const,
  async ([open, row]) => {
    if (!open || !row) return;

    form.uomId = row.uomId;
    form.uomName = row.uomName;
    form.status = row.status;

    await nextTick();
    formRef.value?.clearValidate();
  }
);

const handleConfirm = async () => {
  await formRef.value?.validate();
  emit("submit", { ...form });   // ✅ 抛出 dto 给父组件
  // ✅ 不在这里关，让父组件成功后关闭（和新增一致）
};
</script>

