<template>
  <el-upload
    class="product-image-upload"
    :class="{ 'product-image-upload--has-file': hasFile }"
    v-model:file-list="fileList"
    list-type="picture-card"
    :limit="1"
    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
    :before-upload="beforeUpload"
    :http-request="httpRequest"
    :on-exceed="handleExceed"
  >
    <el-icon v-if="!hasFile"><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible" title="预览" width="520px" append-to-body>
    <img class="preview-full" :src="dialogImageUrl" alt="" />
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { UploadFile, UploadProps, UploadRequestOptions, UploadUserFile } from "element-plus";
import { uploadImageApi } from "@/api/product/upload";

const props = defineProps<{
  /** 与表单字段对齐，允许 undefined */
  modelValue?: string | null;
  /** 编辑态：删除时先清服务端图片 */
  clearRemote?: () => Promise<void>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const fileList = ref<UploadUserFile[]>([]);
const dialogVisible = ref(false);
const dialogImageUrl = ref("");

/** 已有图时隐藏「+」卡片，仅展示单张缩略图（自定义 #file 时 EP 不会自动隐藏触发器） */
const hasFile = computed(() => fileList.value.length > 0);

watch(
  () => props.modelValue ?? "",
  (url) => {
    if (!url) {
      fileList.value = [];
      return;
    }
    const cur = fileList.value[0]?.url;
    if (cur === url) return;
    fileList.value = [{ name: "image", url, uid: -1, status: "success" }];
  },
  { immediate: true }
);

const MAX_IMAGE_BYTES = 200 * 1024;

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const okType =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    !!file.name.match(/\.(jpg|jpeg|png)$/i);
  if (!okType) {
    ElMessageBox.alert("请上传JPG/PNG类型格式文件", "提示", { confirmButtonText: "确定" });
    return false;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    ElMessageBox.alert("上传文件大小不能超过200KB", "提示", { confirmButtonText: "确定" });
    return false;
  }
  return true;
};

const httpRequest = async (options: UploadRequestOptions) => {
  const file = options.file as File;
  try {
    const res = await uploadImageApi(file);
    const url = res.data as string;
    fileList.value = [{ name: file.name, url, uid: Date.now(), status: "success" }];
    emit("update:modelValue", url);
    options.onSuccess?.(res as never);
  } catch {
    options.onError?.(new Error("upload failed") as never);
  }
};

const handlePictureCardPreview = (file: UploadFile) => {
  const u = file.url;
  if (!u) return;
  dialogImageUrl.value = u;
  dialogVisible.value = true;
};

const handleRemove = async () => {
  try {
    await ElMessageBox.confirm("请确认是否删除图片？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch {
    return;
  }
  if (props.clearRemote) {
    try {
      await props.clearRemote();
    } catch {
      return;
    }
  }
  emit("update:modelValue", "");
  fileList.value = [];
};

const handleExceed: UploadProps["onExceed"] = () => {
  ElMessage.warning("仅支持上传 1 张图片");
};
</script>

<style scoped>
.preview-full {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}

.product-image-upload--has-file :deep(.el-upload--picture-card) {
  display: none;
}
</style>
