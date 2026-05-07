<template>
  <BaseDialog
    v-model="visible"
    title="新增商品单位"
    width="500"
    formLabelWidth="100px"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form
        ref="formRef"
        :model="uomDto"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="商品单位名称" prop="uomName">
          <el-input v-model="uomDto.uomName" placeholder="请输入商品单位名称" />
        </el-form-item>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import type { UomDto } from "@/type/uom";

// 由父组件控制开关
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: UomDto): void; // 抛出新增数据给父组件
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref<FormInstance>();

// 新增 dto（不带 uomId）
const uomDto = reactive<UomDto>({
  uomName: "",
  status: 1,
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

// 每次打开都重置，避免残留
watch(
  () => visible.value,
  async (open) => {
    if (!open) return;
    uomDto.uomName = "";
    uomDto.status = 1;
    await nextTick();
    formRef.value?.clearValidate();
  }
);

const handleConfirm = async () => {
  await formRef.value?.validate(); // 校验
  emit("submit", { ...uomDto }); // 只提交数据，不做接口
  // 不关，让父组件成功后再关
};

const handleCancel = () => {
  // cancel 的关闭已经在 BaseDialog 里做了，这里可空着
};

const handleClosed = () => {
  // 关闭动画结束后的钩子（可选）
};
</script>

