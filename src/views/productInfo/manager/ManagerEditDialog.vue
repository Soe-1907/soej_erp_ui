<template>
  <el-dialog
    v-model="visible"
    title="修改商品"
    width="600px"
    @close="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="130px"
    >
      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="form.productName"
          placeholder="请输入商品名称"
          maxlength="16"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="商品分类" prop="categoryId">
        <el-select
          v-model="form.categoryId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品品牌" prop="brandId">
        <el-select
          v-model="form.brandId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品单位" prop="uomId">
        <el-select
          v-model="form.uomId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in uomOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="建议采购价（元）" prop="suggestPurchasePrice">
        <el-input-number
          v-model="form.suggestPurchasePrice"
          :min="0.01"
          :max="99999999"
          :precision="2"
          :step="1"
          controls-position="right"
          placeholder="请输入建议采购价（元）"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="建议销售价（元）" prop="suggestSalePrice">
        <el-input-number
          v-model="form.suggestSalePrice"
          :min="0.01"
          :max="99999999"
          :precision="2"
          :step="1"
          controls-position="right"
          placeholder="请输入建议销售价（元）"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="商品图片">
        <ProductImageUpload v-model="form.imageUrl" :clear-remote="clearImageRemote" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="handleConfirm">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { ProductDto, ProductVO } from "@/type/product";
import type { SelectOption } from "@/type/select";
import { clearProductImageApi } from "@/api/product/manager";
import ProductImageUpload from "@/components/product/ProductImageUpload.vue";

const props = defineProps<{
  modelValue: boolean;
  data: ProductVO | null;
  categoryOptions: SelectOption[];
  brandOptions: SelectOption[];
  uomOptions: SelectOption[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", dto: ProductDto): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref<FormInstance>();

const form = reactive<ProductDto>({
  productId: undefined,
  productName: "",
  categoryId: undefined,
  brandId: undefined,
  uomId: undefined,
  suggestPurchasePrice: undefined,
  suggestSalePrice: undefined,
  imageUrl: "",
  status: 1,
});

const priceValidator = (fieldLabel: string) => {
  return (_rule: unknown, value: unknown, callback: (e?: Error) => void) => {
    if (value === undefined || value === null) {
      callback(new Error(`${fieldLabel}必填，请重新输入。`));
      return;
    }
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0 || n > 99999999) {
      callback(new Error(`${fieldLabel}输入有误，请重新输入。`));
      return;
    }
    callback();
  };
};

const rules: FormRules = {
  productName: [
    { required: true, message: "商品名称必填，请重新输入。", trigger: "blur" },
    { max: 16, message: "商品名称输入有误，请重新输入。", trigger: "blur" },
  ],
  categoryId: [{ required: true, message: "商品分类必填，请重新输入。", trigger: "change" }],
  brandId: [{ required: true, message: "商品品牌必填，请重新输入。", trigger: "change" }],
  uomId: [{ required: true, message: "商品单位必填，请重新输入。", trigger: "change" }],
  suggestPurchasePrice: [
    { required: true, message: "建议采购价（元）必填，请重新输入。", trigger: "blur" },
    { validator: priceValidator("建议采购价（元）"), trigger: "blur" },
  ],
  suggestSalePrice: [
    { required: true, message: "建议销售价（元）必填，请重新输入。", trigger: "blur" },
    { validator: priceValidator("建议销售价（元）"), trigger: "blur" },
  ],
};

watch(
  () => [visible.value, props.data] as const,
  async ([open, row]) => {
    if (!open || !row) return;

    Object.assign(form, {
      productId: row.productId,
      productName: row.productName,
      categoryId: row.categoryId,
      brandId: row.brandId,
      uomId: row.uomId,
      suggestPurchasePrice: row.suggestPurchasePrice,
      suggestSalePrice: row.suggestSalePrice,
      imageUrl: row.imageUrl,
      status: row.status,
    });

    await nextTick();
    formRef.value?.clearValidate();
  }
);

const clearImageRemote = async () => {
  if (form.productId != null) {
    await clearProductImageApi(form.productId);
  }
};

const handleConfirm = async () => {
  await formRef.value?.validate();
  emit("submit", { ...form });
};

const handleCancel = () => {
  visible.value = false;
};

const handleClosed = () => {
  formRef.value?.resetFields();
};
</script>

