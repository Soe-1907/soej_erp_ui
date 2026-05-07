import type { RouteRecordRaw } from 'vue-router'
import { ROLE_ADMIN } from '@/constants/role'

/**
 * 基础信息：商品、品牌、分类、单位、客户、供应商、仓库
 */
export const baseInfoRoutes: RouteRecordRaw[] = [
  {
    path: 'manager',
    name: 'Manager',
    component: () => import('@/views/productInfo/manager/ManagerView.vue'),
    meta: {
      title: '商品管理',
      roleCodes: [ROLE_ADMIN],
      breadcrumb: [
        { title: '基础信息管理', path: '/manager' },
        { title: '商品信息', path: '/manager' },
        { title: '商品管理' },
      ],
    },
  },
  {
    path: 'brand',
    name: 'Brand',
    component: () => import('@/views/productInfo/brand/BrandView.vue'),
    meta: {
      title: '商品品牌',
      roleCodes: [ROLE_ADMIN],
      breadcrumb: [
        { title: '基础信息管理', path: '/manager' },
        { title: '商品信息', path: '/manager' },
        { title: '商品品牌' },
      ],
    },
  },
  {
    path: 'category',
    name: 'Category',
    component: () => import('@/views/productInfo/category/CategoryView.vue'),
    meta: {
      title: '商品分类',
      roleCodes: [ROLE_ADMIN],
      breadcrumb: [
        { title: '基础信息管理', path: '/manager' },
        { title: '商品信息', path: '/manager' },
        { title: '商品分类' },
      ],
    },
  },
  {
    path: 'uom',
    name: 'Uom',
    component: () => import('@/views/productInfo/uom/UomView.vue'),
    meta: {
      title: '商品单位',
      roleCodes: [ROLE_ADMIN],
      breadcrumb: [
        { title: '基础信息管理', path: '/manager' },
        { title: '商品信息', path: '/manager' },
        { title: '商品单位' },
      ],
    },
  },
  {
    path: 'customer',
    name: 'Customer',
    component: () => import('@/views/productInfo/customer/customerView.vue'),
    meta: {
      title: '客户信息',
      roleCodes: [ROLE_ADMIN],
      breadcrumb: [
        { title: '基础信息管理', path: '/customer' },
        { title: '客户信息' },
      ],
    },
  },
  {
    path: 'supplier',
    name: 'Supplier',
    component: () => import('@/views/productInfo/supplier/supplierView.vue'),
    meta: {
      title: '供应商信息',
      roleCodes: [ROLE_ADMIN],
      breadcrumb: [
        { title: '基础信息管理', path: '/supplier' },
        { title: '供应商信息' },
      ],
    },
  },
  {
    path: 'warehouse',
    name: 'Warehouse',
    component: () => import('@/views/productInfo/warehouse/warehouseView.vue'),
    meta: {
      title: '仓库信息',
      roleCodes: [ROLE_ADMIN],
      breadcrumb: [
        { title: '基础信息管理', path: '/warehouse' },
        { title: '仓库信息' },
      ],
    },
  },
]
