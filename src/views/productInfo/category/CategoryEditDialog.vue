<template>
  <BaseDialog
    v-model="visible"
    title="修改商品分类"
    width="500"
    formLabelWidth="100px"
    @confirm="handleConfirm"
  >
    <template #dialogContent>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="商品分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入商品分类名称" />
        </el-form-item>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import type { FormInstance, FormRules } from "element-plus";
import type { CategoryDto, CategoryVO } from "@/type/category";

const props = defineProps<{
  modelValue: boolean;      // v-model 默认就是 modelValue
  data: CategoryVO | null;  // 父组件传入当前行
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: CategoryDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const rules: FormRules = {
  categoryName: [
    { required: true, message: "商品分类名称必填，请重新输入。", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        const v = typeof value === "string" ? value.trim() : "";
        if (!v) {
          callback(new Error("商品分类名称必填，请重新输入。"));
          return;
        }
        if (!/^[\u4e00-\u9fa5a-zA-Z]{2,16}$/.test(v)) {
          callback(new Error("商品分类名称输入有误，请重新输入。"));
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
const form = reactive<CategoryDto>({
  categoryId: undefined,
  categoryName: "",
  status: 1,
});

// ✅ 打开弹窗时回显数据
watch(
  () => [visible.value, props.data] as const,
  async ([open, row]) => {
    if (!open || !row) return;

    form.categoryId = row.categoryId;
    form.categoryName = row.categoryName;
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

