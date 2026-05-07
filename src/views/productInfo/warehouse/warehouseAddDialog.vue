<template>
  <BaseDialog
    v-model="visible"
    title="新增仓库"
    width="600px"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form
        ref="formRef"
        :model="warehouseDto"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input
            v-model="warehouseDto.warehouseName"
            placeholder="请输入仓库名称"
            maxlength="16"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="仓库专员" prop="specialistUserId">
          <el-select
            v-model="warehouseDto.specialistUserId"
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
          <el-input v-model="warehouseDto.phone" placeholder="请输入联系电话" maxlength="11" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="warehouseDto.address" placeholder="请输入地址" maxlength="16" show-word-limit />
        </el-form-item>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import type { WarehouseDto } from "@/type/warehouse";
import type { SelectOption } from "@/type/select";

const props = defineProps<{
  modelValue: boolean;
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

// 新增仓库 dto
const warehouseDto = reactive<WarehouseDto>({
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

// 每次打开都重置
watch(
  () => visible.value,
  async (open) => {
    if (!open) return;
    Object.assign(warehouseDto, {
      warehouseName: "",
      specialistUserId: undefined,
      phone: "",
      address: "",
      status: 1,
    });
    await nextTick();
    formRef.value?.clearValidate();
  }
);

const handleConfirm = async () => {
  await formRef.value?.validate();
  emit("submit", { ...warehouseDto });
};

const handleCancel = () => {
  visible.value = false;
};

const handleClosed = () => {
  formRef.value?.resetFields();
};
</script>

