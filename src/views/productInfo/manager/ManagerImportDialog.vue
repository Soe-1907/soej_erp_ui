<template>
  <el-dialog
    v-model="visible"
    title="批量导入"
    width="520px"
    destroy-on-close
    @close="handleClose"
  >
    <div class="import-body">
      <el-button type="primary" link @click="handleDownloadTemplate">下载模板</el-button>
      <p class="hint">支持 xls/xlsx，文件大小不超过 500KB。</p>
      <el-upload
        ref="uploadRef"
        drag
        :auto-upload="false"
        :limit="1"
        accept=".xls,.xlsx"
        :on-change="onFileChange"
        :on-exceed="onExceed"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import {
  downloadProductImportTemplateApi,
  importProductsApi,
} from "@/api/product/manager";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "success"): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const uploadRef = ref<UploadInstance>();
const selectedFile = ref<UploadRawFile | null>(null);
const submitting = ref(false);

const MAX_BYTES = 500 * 1024;

const onFileChange: UploadProps["onChange"] = (uploadFile) => {
  const raw = uploadFile.raw;
  if (!raw) return;
  const name = raw.name.toLowerCase();
  if (!name.endsWith(".xls") && !name.endsWith(".xlsx")) {
    ElMessage.error("请上传 xls 或 xlsx 文件");
    uploadRef.value?.clearFiles();
    selectedFile.value = null;
    return;
  }
  if (raw.size > MAX_BYTES) {
    ElMessage.error("文件大小不能超过 500KB");
    uploadRef.value?.clearFiles();
    selectedFile.value = null;
    return;
  }
  selectedFile.value = raw;
};

const onExceed: UploadProps["onExceed"] = () => {
  ElMessage.warning("仅支持选择 1 个文件");
};

const handleDownloadTemplate = async () => {
  try {
    const blob = await downloadProductImportTemplateApi();
    const url = URL.createObjectURL(blob as unknown as Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "商品批量导入模板.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    ElMessage.error("模板下载失败");
  }
};

const handleConfirm = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请先选择要上传的文件");
    return;
  }
  submitting.value = true;
  try {
    await importProductsApi(selectedFile.value);
    ElMessage.success("导入成功");
    emit("success");
    visible.value = false;
  } catch (err: unknown) {
    const msg =
      err &&
      typeof err === "object" &&
      "message" in err &&
      typeof (err as { message?: string }).message === "string"
        ? (err as { message: string }).message
        : "导入失败";
    await ElMessageBox.alert(
      `<div style="white-space:pre-wrap;max-height:360px;overflow:auto;">${escapeHtml(msg)}</div>`,
      "导入失败",
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
      }
    );
  } finally {
    submitting.value = false;
  }
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const handleClose = () => {
  selectedFile.value = null;
  uploadRef.value?.clearFiles();
};
</script>

<style scoped>
.import-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hint {
  margin: 0;
  font-size: 13px;
  color: #909399;
}
</style>
