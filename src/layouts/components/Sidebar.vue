<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-brand">
      <div class="logo-mark" aria-hidden="true">
        <el-icon :size="28"><OfficeBuilding /></el-icon>
      </div>
      <div class="sidebar-title">ERP(资源协同系统)</div>
    </div>

    <el-menu
      router
      :default-active="activeMenu"
      class="el-menu-vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <template v-if="hasServerMenus">
        <SidebarMenuBranch :nodes="filteredServerMenus" />
      </template>
      <template v-else>
        <!-- 无登录菜单快照时的回退（与后端 LoginMenuFactory 保持一致） -->
        <el-sub-menu v-if="isSuperAdmin" index="system-maintenance">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统维护</span>
          </template>
          <el-menu-item index="/data-cleanup">
            <el-icon><Delete /></el-icon>
            <template #title>数据清理</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="isAdmin" index="base-info">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>基础信息管理</span>
          </template>

          <el-sub-menu index="product-info">
            <template #title>
              <el-icon><Goods /></el-icon>
              <span>商品信息</span>
            </template>
            <el-menu-item index="/manager">
              <el-icon><Grid /></el-icon>
              <template #title>商品管理</template>
            </el-menu-item>
            <el-menu-item index="/brand">
              <el-icon><Grid /></el-icon>
              <template #title>商品品牌</template>
            </el-menu-item>
            <el-menu-item index="/category">
              <el-icon><Grid /></el-icon>
              <template #title>商品分类</template>
            </el-menu-item>
            <el-menu-item index="/uom">
              <el-icon><Grid /></el-icon>
              <template #title>商品单位</template>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/warehouse">
            <el-icon><Menu /></el-icon>
            <template #title>仓库信息</template>
          </el-menu-item>

          <el-menu-item index="/customer">
            <el-icon><Menu /></el-icon>
            <template #title>客户信息</template>
          </el-menu-item>

          <el-menu-item index="/supplier">
            <el-icon><Menu /></el-icon>
            <template #title>供应商信息</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="isPurchaseRole" index="purchase">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>采购管理</span>
          </template>
          <el-menu-item index="/purchase-receive">
            <el-icon><Grid /></el-icon>
            <template #title>采购入库</template>
          </el-menu-item>
          <el-menu-item index="/purchase-return">
            <el-icon><Grid /></el-icon>
            <template #title>采购退货</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="isSalesRole" index="sales">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>销售管理</span>
          </template>
          <el-menu-item index="/sales-outbound">
            <el-icon><Grid /></el-icon>
            <template #title>销售出库</template>
          </el-menu-item>
          <el-menu-item index="/sales-return">
            <el-icon><Grid /></el-icon>
            <template #title>销售退货</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="isInventoryRole" index="inventory">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>库存管理</span>
          </template>
          <el-menu-item v-if="isWarehouseManager" index="/inventory-distribution">
            <el-icon><Grid /></el-icon>
            <template #title>库存分布</template>
          </el-menu-item>
          <el-menu-item v-if="isWarehouseManager" index="/inventory-transfer">
            <el-icon><Grid /></el-icon>
            <template #title>库存调拨</template>
          </el-menu-item>
          <el-menu-item v-if="isWarehouseSpecialist || isWarehouseManager" index="/inventory-verification">
            <el-icon><Grid /></el-icon>
            <template #title>出库审核</template>
          </el-menu-item>
          <el-menu-item v-if="isWarehouseSpecialist || isWarehouseManager" index="/inventory-audit">
            <el-icon><Grid /></el-icon>
            <template #title>入库审核</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="isSettlementRole" index="settlement">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>结算管理</span>
          </template>
          <el-menu-item index="/income-settlement">
            <el-icon><Grid /></el-icon>
            <template #title>收入结算</template>
          </el-menu-item>
          <el-menu-item index="/expenditure-settlement">
            <el-icon><Grid /></el-icon>
            <template #title>支出结算</template>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Delete, Goods, Grid, Menu, OfficeBuilding, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import SidebarMenuBranch from './SidebarMenuBranch.vue'
import {
  ROLE_ADMIN,
  ROLE_SUPER_ADMIN,
  ROLE_PURCHASE_MANAGER,
  ROLE_PURCHASE_SPECIALIST,
  ROLE_SALES_MANAGER,
  ROLE_SALES_SPECIALIST,
  ROLE_SETTLEMENT_MANAGER,
  ROLE_SETTLEMENT_SPECIALIST,
  ROLE_WAREHOUSE_MANAGER,
  ROLE_WAREHOUSE_SPECIALIST,
} from '@/constants/role'

const userStore = useUserStore()
const route = useRoute()

const roleCode = computed(() => userStore.userInfo?.roleCode)
const serverMenus = computed(() => userStore.userInfo?.menus ?? [])
const hasServerMenus = computed(() => serverMenus.value.length > 0)

const isSuperAdmin = computed(() => roleCode.value === ROLE_SUPER_ADMIN)
const isAdmin = computed(() => roleCode.value === ROLE_ADMIN)

/** 系统管理员仅展示「基础信息管理」；超级管理员仅展示「系统维护」 */
const filteredServerMenus = computed(() => {
  if (isSuperAdmin.value) {
    return serverMenus.value.filter((node) => node.title === '系统维护')
  }
  if (isAdmin.value) {
    return serverMenus.value.filter((node) => node.title === '基础信息管理')
  }
  return serverMenus.value
})
const isWarehouseManager = computed(() => roleCode.value === ROLE_WAREHOUSE_MANAGER)
const isWarehouseSpecialist = computed(() => roleCode.value === ROLE_WAREHOUSE_SPECIALIST)
const isInventoryRole = computed(
  () => roleCode.value === ROLE_WAREHOUSE_MANAGER || roleCode.value === ROLE_WAREHOUSE_SPECIALIST
)
const isPurchaseRole = computed(
  () => roleCode.value === ROLE_PURCHASE_MANAGER || roleCode.value === ROLE_PURCHASE_SPECIALIST
)
const isSalesRole = computed(
  () => roleCode.value === ROLE_SALES_MANAGER || roleCode.value === ROLE_SALES_SPECIALIST
)
const isSettlementRole = computed(
  () =>
    roleCode.value === ROLE_SETTLEMENT_MANAGER ||
    roleCode.value === ROLE_SETTLEMENT_SPECIALIST
)

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar-wrapper {
  height: 100%;
  background-color: #304156;
}

.sidebar-brand {
  padding: 16px 12px 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(145deg, #409eff 0%, #1a2980 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.sidebar-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  line-height: 1.35;
}

.el-menu-vertical {
  border-right: none;
}

:deep(.el-sub-menu__title) {
  color: #bfcbd9;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item:hover) {
  background-color: #263445 !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #409eff !important;
  color: white !important;
}
</style>
