<template>
  <BaseDialog
    v-model="visible"
    title="修改仓库"
    width="600px"
    @confirm="handleConfirm"
  >
    <template #dialogContent>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input
            v-model="form.warehouseName"
            placeholder="请输入仓库名称"
            maxlength="16"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="仓库专员" prop="specialistUserId">
          <el-select
            v-model="form.specialistUserId"
            placeholder="请选择仓库专员"
            style="width: 100%"
          >
            <el-option
              v-for="item in managerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" maxlength="16" show-word-limit />
        </el-form-item>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import type { FormInstance, FormRules } from "element-plus";
import type { WarehouseDto, WarehouseVO } from "@/type/warehouse";
import type { SelectOption } from "@/type/select";

const props = defineProps<{
  modelValue: boolean;
  data: WarehouseVO | null;
  managerOptions: SelectOption[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: WarehouseDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref<FormInstance>();

// 表单数据
const form = reactive<WarehouseDto>({
  warehouseId: undefined,
  warehouseCode: "",
  warehouseName: "",
  specialistUserId: undefined,
  phone: "",
  address: "",
  status: 1,
});

const rules: FormRules = {
  warehouseName: [
    { required: true, message: "仓库名称必填，请重新输入。", trigger: "blur" },
    { max: 16, message: "仓库名称输入有误，请重新输入。", trigger: "blur" },
  ],
  specialistUserId: [
    { required: true, message: "仓库专员必填，请重新输入。", trigger: "change" },
  ],
  phone: [
    { required: true, message: "联系电话必填，请重新输入。", trigger: "blur" },
    { pattern: /^1\d{10}$/, message: "联系电话输入有误，请重新输入。", trigger: "blur" },
  ],
  address: [
    { required: true, message: "地址必填，请重新输入。", trigger: "blur" },
    { max: 16, message: "地址输入有误，请重新输入。", trigger: "blur" },
  ],
};

// 打开弹窗时回显数据
watch(
  () => [visible.value, props.data] as const,
  async ([open, row]) => {
    if (!open || !row) return;

    Object.assign(form, {
      warehouseId: row.warehouseId,
      warehouseCode: row.warehouseCode,
      warehouseName: row.warehouseName,
      specialistUserId: row.specialistUserId,
      phone: row.phone,
      address: row.address,
      status: row.status,
    });

    await nextTick();
    formRef.value?.clearValidate();
  }
);

const handleConfirm = async () => {
  await formRef.value?.validate();
  emit("submit", { ...form });
};
</script>

