import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface BreadcrumbItem {
  title: string
  path?: string
}

export interface TabItem {
  title: string
  name: string
  path: string
  closable: boolean
}

// 本地存储的 key
const TAB_STORAGE_KEY = 'erp_system_tabs'
const ACTIVE_TAB_KEY = 'erp_system_active_tab'

const breadcrumbList = ref<BreadcrumbItem[]>([])
const tabList = ref<TabItem[]>([])
const activeTab = ref('')

const clearTabsStorage = () => {
  localStorage.removeItem(TAB_STORAGE_KEY)
  localStorage.removeItem(ACTIVE_TAB_KEY)
}

export const resetBreadcrumbState = () => {
  breadcrumbList.value = []
  tabList.value = []
  activeTab.value = ''
  clearTabsStorage()
}

export const useBreadcrumb = () => {
  const route = useRoute()
  const router = useRouter()

  // 从本地存储恢复标签页
  const restoreTabsFromStorage = () => {
    try {
      const savedTabs = localStorage.getItem(TAB_STORAGE_KEY)
      const savedActiveTab = localStorage.getItem(ACTIVE_TAB_KEY)
      
      if (savedTabs) {
        const tabs = JSON.parse(savedTabs) as TabItem[]
        if (tabs.length > 0) {
          tabList.value = tabs
        }
      }
      
      if (savedActiveTab) {
        activeTab.value = savedActiveTab
      }
    } catch (error) {
      console.error('恢复标签页失败:', error)
    }
  }

  // 保存标签页到本地存储
  const saveTabsToStorage = () => {
    try {
      if (tabList.value.length === 0 && !activeTab.value) {
        clearTabsStorage()
        return
      }

      localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(tabList.value))
      localStorage.setItem(ACTIVE_TAB_KEY, activeTab.value)
    } catch (error) {
      console.error('保存标签页失败:', error)
    }
  }

  // 生成面包屑
  const generateBreadcrumb = (currentRoute: RouteLocationNormalizedLoaded) => {
    const breadcrumbs: BreadcrumbItem[] = []

    // 根据路由 meta 信息生成面包屑
    if (currentRoute.meta?.breadcrumb) {
      const breadcrumbItems = currentRoute.meta.breadcrumb as BreadcrumbItem[]
      breadcrumbs.push(...breadcrumbItems)
    } else if (currentRoute.meta?.title) {
      // 如果没有自定义面包屑，使用标题
      breadcrumbs.push({
        title: '基础信息管理',
      })
      breadcrumbs.push({
        title: currentRoute.meta.title as string,
        path: currentRoute.path,
      })
    }

    breadcrumbList.value = breadcrumbs
  }

  // 添加标签页
  const addTab = (currentRoute: RouteLocationNormalizedLoaded) => {
    // 跳过登录页
    if (currentRoute.path === '/login') {
      return
    }

    const title = (currentRoute.meta?.title as string) || '未命名'
    const path = currentRoute.path
    const name = currentRoute.name as string

    // 检查是否已存在
    const existingTab = tabList.value.find((tab) => tab.path === path)
    if (!existingTab) {
      // 第一个标签页不可关闭
      const closable = tabList.value.length > 0
      tabList.value.push({
        title,
        name: name || path,
        path,
        closable,
      })
    }

    // 设置当前激活的标签
    activeTab.value = name || path
    
    // 保存到本地存储
    saveTabsToStorage()
  }

  // 关闭标签页
  const closeTab = (targetName: string) => {
    const tabs = tabList.value
    const targetIndex = tabs.findIndex((tab) => tab.name === targetName)

    if (targetIndex === -1) return

    // 如果关闭的是当前激活的标签
    if (activeTab.value === targetName) {
      // 跳转到下一个或上一个标签
      const nextTab = tabs[targetIndex + 1] || tabs[targetIndex - 1]
      if (nextTab) {
        router.push(nextTab.path)
      } else {
        activeTab.value = ''
        router.push('/')
      }
    }

    // 移除标签
    tabList.value = tabs.filter((tab) => tab.name !== targetName)

    // 如果第一个标签变了，确保它不可关闭
    const firstTab = tabList.value[0]
    if (firstTab) {
      firstTab.closable = false
    }
    
    // 保存到本地存储
    saveTabsToStorage()
  }

  // 切换标签页
  const switchTab = (tabName: string) => {
    const tab = tabList.value.find((t) => t.name === tabName)
    if (tab) {
      router.push(tab.path)
    }
  }

  // 关闭当前标签页
  const closeCurrentTab = () => {
    if (activeTab.value) {
      closeTab(activeTab.value)
    }
  }

  // 关闭其他标签页
  const closeOtherTabs = (targetName: string) => {
    const targetTab = tabList.value.find((tab) => tab.name === targetName)
    if (!targetTab) return

    targetTab.closable = false
    tabList.value = [targetTab]
    activeTab.value = targetName
    
    // 跳转到目标标签
    router.push(targetTab.path)
    
    // 保存到本地存储
    saveTabsToStorage()
  }

  // 关闭左侧标签页
  const closeLeftTabs = (targetName: string) => {
    const targetIndex = tabList.value.findIndex((tab) => tab.name === targetName)
    if (targetIndex === -1) return

    tabList.value = tabList.value.slice(targetIndex)
    const firstTab = tabList.value[0]
    if (firstTab) {
      firstTab.closable = false
    }
    
    // 保存到本地存储
    saveTabsToStorage()
  }

  // 关闭右侧标签页
  const closeRightTabs = (targetName: string) => {
    const targetIndex = tabList.value.findIndex((tab) => tab.name === targetName)
    if (targetIndex === -1) return

    tabList.value = tabList.value.slice(0, targetIndex + 1)
    
    // 保存到本地存储
    saveTabsToStorage()
  }

  // 关闭所有标签页
  const closeAllTabs = () => {
    if (tabList.value.length === 0) return

    const firstTab = tabList.value[0]
    if (!firstTab) return

    tabList.value = [firstTab]
    firstTab.closable = false
    activeTab.value = firstTab.name
    
    // 跳转到第一个标签
    router.push(firstTab.path)
    
    // 保存到本地存储
    saveTabsToStorage()
  }

  // 刷新当前标签页
  const refreshTab = () => {
    // 强制刷新当前路由
    router.go(0)
  }

  // 初始化
  onMounted(() => {
    restoreTabsFromStorage()
  })

  // 监听路由变化
  watch(
    () => route.path,
    () => {
      generateBreadcrumb(route)
      addTab(route)
    },
    { immediate: true }
  )

  // 监听标签页变化，保存到本地存储
  watch(
    () => tabList.value,
    () => {
      saveTabsToStorage()
    },
    { deep: true }
  )

  return {
    breadcrumbList,
    tabList,
    activeTab,
    closeTab,
    closeCurrentTab,
    switchTab,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTabs,
    refreshTab,
    resetBreadcrumbState,
  }
}

