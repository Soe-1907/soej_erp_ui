<template>
  <BaseDialog
    v-model="visible"
    title="新增客户"
    width="700px"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form ref="formRef" :model="customerDto" :rules="rules" label-width="0">
        <table class="detail-field-grid detail-field-grid--form">
          <tbody>
            <tr>
              <td class="detail-label-cell">客户名称</td>
              <td class="detail-value-cell">
                <el-form-item prop="customerName" class="cell-form-item">
                  <el-input
                    v-model="customerDto.customerName"
                    placeholder="请输入客户名称"
                    maxlength="16"
                    show-word-limit
                  />
                </el-form-item>
              </td>
              <td class="detail-label-cell">联系人</td>
              <td class="detail-value-cell">
                <el-form-item prop="contactName" class="cell-form-item">
                  <el-input
                    v-model="customerDto.contactName"
                    placeholder="请输入联系人"
                    maxlength="16"
                    show-word-limit
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="detail-label-cell">联系电话</td>
              <td class="detail-value-cell">
                <el-form-item prop="mobile" class="cell-form-item">
                  <el-input
                    v-model="customerDto.mobile"
                    placeholder="请输入联系电话"
                    maxlength="11"
                  />
                </el-form-item>
              </td>
              <td class="detail-label-cell">地址</td>
              <td class="detail-value-cell">
                <el-form-item prop="address" class="cell-form-item">
                  <el-input
                    v-model="customerDto.address"
                    placeholder="请输入地址"
                    maxlength="16"
                    show-word-limit
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="detail-label-cell">结账方式</td>
              <td class="detail-value-cell">
                <el-form-item prop="checkoutMethod" class="cell-form-item">
                  <el-select
                    v-model="customerDto.checkoutMethod"
                    placeholder="请选择结账方式"
                    style="width: 100%"
                  >
                    <el-option label="付款发货" value="付款发货" />
                  </el-select>
                </el-form-item>
              </td>
              <td class="detail-label-cell"></td>
              <td class="detail-value-cell"></td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import BaseDialog from "@/components/dialog/BaseDialog.vue";
import type { CustomerDto } from "@/type/customer";
import "@/styles/detail-field-grid.css";

const DEFAULT_CHECKOUT = "付款发货";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: CustomerDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref<FormInstance>();

const customerDto = reactive<CustomerDto>({
  customerName: "",
  contactName: "",
  mobile: "",
  address: "",
  checkoutMethod: DEFAULT_CHECKOUT,
  status: 1,
});

const rules: FormRules = {
  customerName: [
    { required: true, message: "客户名称必填，请重新输入。", trigger: "blur" },
    { max: 16, message: "客户名称输入有误，请重新输入。", trigger: "blur" },
  ],
  contactName: [
    { required: true, message: "联系人必填，请重新输入。", trigger: "blur" },
    { max: 16, message: "联系人输入有误，请重新输入。", trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "联系电话必填，请重新输入。", trigger: "blur" },
    { pattern: /^1\d{10}$/, message: "联系电话输入有误，请重新输入。", trigger: "blur" },
  ],
  address: [
    { required: true, message: "地址必填，请重新输入。", trigger: "blur" },
    { max: 16, message: "地址输入有误，请重新输入。", trigger: "blur" },
  ],
  checkoutMethod: [{ required: true, message: "请选择结账方式", trigger: "change" }],
};

watch(
  () => visible.value,
  async (open) => {
    if (!open) return;
    Object.assign(customerDto, {
      customerName: "",
      contactName: "",
      mobile: "",
      address: "",
      checkoutMethod: DEFAULT_CHECKOUT,
      status: 1,
    });
    await nextTick();
    formRef.value?.clearValidate();
  }
);

const handleConfirm = async () => {
  await formRef.value?.validate();
  emit("submit", { ...customerDto });
};

const handleCancel = () => {
  visible.value = false;
};

const handleClosed = () => {
  formRef.value?.resetFields();
};
</script>
