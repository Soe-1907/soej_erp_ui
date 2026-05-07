/// <reference types="vite/client" />

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    breadcrumb?: { title: string; path?: string }[]
    /** 允许访问该页的角色码；不配置则登录即可访问 */
    roleCodes?: number[]
  }
}
