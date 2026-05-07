<template>
  <BaseDialog
    v-model="visible"
    title="新增商品分类"
    width="500"
    formLabelWidth="100px"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form
        ref="formRef"
        :model="categoryDto"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="商品分类名称" prop="categoryName">
          <el-input v-model="categoryDto.categoryName" placeholder="请输入商品分类名称" />
        </el-form-item>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import type { CategoryDto } from "@/type/category";

// 由父组件控制开关
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: CategoryDto): void; // 抛出新增数据给父组件
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref<FormInstance>();

// 新增 dto（不带 categoryId）
const categoryDto = reactive<CategoryDto>({
  categoryName: "",
  status: 1,
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

// 每次打开都重置，避免残留
watch(
  () => visible.value,
  async (open) => {
    if (!open) return;
    categoryDto.categoryName = "";
    categoryDto.status = 1;
    await nextTick();
    formRef.value?.clearValidate();
  }
);

const handleConfirm = async () => {
  await formRef.value?.validate(); // 校验
  emit("submit", { ...categoryDto }); // 只提交数据，不做接口
  // 不关，让父组件成功后再关
};

const handleCancel = () => {
  // cancel 的关闭已经在 BaseDialog 里做了，这里可空着
};

const handleClosed = () => {
  // 关闭动画结束后的钩子（可选）
};
</script>

