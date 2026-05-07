<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧显示区 -->
      <el-aside width="250px">
        <Sidebar />
      </el-aside>
      <el-container>
        <!-- 顶部栏 -->
        <el-header>
          <Navbar />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
  overflow-x: hidden;
  overflow-y: auto;
}

.el-header {
  padding: 0;
  height: auto !important;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
