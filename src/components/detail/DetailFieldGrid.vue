<template>
  <table class="detail-field-grid">
    <tbody>
      <tr v-for="(row, ri) in rows" :key="ri">
        <td
          v-for="(cell, ci) in row"
          :key="ci"
          :class="ci % 2 === 0 ? 'detail-label-cell' : 'detail-value-cell'"
        >
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
/**
 * 每行 4 格：[标签, 值, 标签, 值]；空位传空字符串以保留边框占位。
 */
defineProps<{
  rows: string[][];
}>();
</script>

<style src="@/styles/detail-field-grid.css"></style>
