<template>
  <div class="query-container">
    <QueryInput
      v-model="query.keyword"
      placeholder="请输入商品编号/名称查询"
      style="width: 240px"
    />

    <div class="query-item">
      <span class="query-label">商品分类</span>
      <el-select v-model="query.categoryName" clearable placeholder="请选择" style="width: 180px">
        <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <div class="query-item">
      <span class="query-label">商品品牌</span>
      <el-select v-model="query.brandName" clearable placeholder="请选择" style="width: 180px">
        <el-option v-for="item in brandOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
  </div>

  <div class="button-container">
    <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
    <el-button plain :icon="RefreshRight" @click="handleReset">重置</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column type="index" label="序号" width="70" :index="indexMethod" />
    <el-table-column prop="productCode" label="商品编号" min-width="150" />
    <el-table-column label="商品图片" width="110">
      <template #default="{ row }">
        <el-image
          v-if="row.imageUrl"
          :src="row.imageUrl"
          fit="cover"
          class="product-image"
          :preview-src-list="[row.imageUrl]"
          preview-teleported
        />
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="productName" label="商品名称" min-width="150" />
    <el-table-column prop="categoryName" label="商品分类" min-width="120" />
    <el-table-column prop="brandName" label="商品品牌" min-width="120" />
    <el-table-column prop="uomName" label="商品单位" width="100" />
    <el-table-column label="仓库" width="100" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" link size="small" @click="handleViewWarehouses(row.productCode)">
          查看
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <BasePagination
    v-model:pageNum="query.pageNum!"
    v-model:pageSize="query.pageSize!"
    :total="total"
    :page-sizes="[10, 20, 30, 50]"
    @change="fetchList"
  />

  <el-dialog v-model="warehouseDialogVisible" title="查看仓库" width="720px">
    <el-table :data="warehouseList" :row-class-name="warehouseRowClassName" style="width: 100%">
      <el-table-column type="index" label="序号" width="70" :index="warehouseIndexMethod" />
      <el-table-column prop="warehouseCode" label="仓库编号" min-width="150" />
      <el-table-column prop="warehouseName" label="仓库名称" min-width="150" />
      <el-table-column prop="actualQuantity" label="实际库存数量" min-width="140" />
      <el-table-column prop="availableQuantity" label="可用库存数量" min-width="140" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RefreshRight, Search } from '@element-plus/icons-vue'
import BasePagination from '@/components/page/BasePagination.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import { useInventoryDistribution } from '@/hooks/InventoryDistribution/useInventoryDistribution'

const {
  list,
  total,
  query,
  categoryOptions,
  brandOptions,
  warehouseList,
  fetchList,
  fetchOptions,
  fetchWarehouses,
  resetQuery,
} = useInventoryDistribution()

const warehouseDialogVisible = ref(false)

onMounted(async () => {
  await fetchOptions()
  await fetchList()
})

function indexMethod(index: number) {
  return ((query.value.pageNum ?? 1) - 1) * (query.value.pageSize ?? 10) + index + 1
}

function warehouseIndexMethod(index: number) {
  return index + 1
}

async function handleQuery() {
  query.value.pageNum = 1
  await fetchOptions()
  await fetchList()
}

async function handleReset() {
  resetQuery()
  await fetchOptions()
  await fetchList()
}

async function handleViewWarehouses(productCode: string) {
  await fetchWarehouses(productCode)
  warehouseDialogVisible.value = true
}

function warehouseRowClassName({ row }: { row: { warehouseCode?: string } }) {
  return row.warehouseCode === '合计' ? 'total-row' : ''
}
</script>

<style scoped>
.query-container {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.query-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.query-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.button-container {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
}

:deep(.total-row) {
  font-weight: 600;
  background-color: #f5f7fa;
}
</style>
