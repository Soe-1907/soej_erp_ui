import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'  // 需要导入样式文件
import './styles/layout-reset.css'
import './styles/query-label.css'
import './styles/dialog-form-label.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)   // 注册 Pinia（状态管理）
app.use(router)  // 注册路由
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')