<template>
  <el-button type="primary" link size="small" @click="openDialog">
    {{ createText }}
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500"
    :z-index="3000"
    append-to-body
  >
    <div class="ban-body">
      <EnableDisableWarnIcon />
      <span class="ban-message">{{ confirmMessage }}</span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import EnableDisableWarnIcon from "@/components/icons/EnableDisableWarnIcon.vue";

const emit = defineEmits<{
  (e: "confirm", value: number): void;
}>();

const dialogVisible = ref(false);

const props = withDefaults(
  defineProps<{
    status: number | string;
    /** 模块短名，如「商品品牌」「商品分类」 */
    title: string;
  }>(),
  {
    status: 0,
  }
);

const createText = computed(() => (Number(props.status) === 1 ? "禁用" : "启用"));

const nextStatus = computed(() => (Number(props.status) === 1 ? 0 : 1));

const dialogTitle = computed(() => `${createText.value}${props.title}`);

const confirmMessage = computed(() =>
  Number(props.status) === 1
    ? `请确认是否禁用该${props.title}？`
    : `请确认是否启用该${props.title}？`
);

const openDialog = () => {
  dialogVisible.value = true;
};

const handleConfirm = () => {
  emit("confirm", nextStatus.value);
  dialogVisible.value = false;
};
</script>

<style scoped>
.ban-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ban-message {
  flex: 1;
  line-height: 1.5;
}
</style>
