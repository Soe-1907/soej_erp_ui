<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">ERP管理平台</h2>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="请输入账号"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon style="font-size: 18px; margin-right: 10px;">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon style="font-size: 18px; margin-right: 10px;">
                <Unlock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="remember">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? "登录中..." : "登 录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { type FormInstance, type FormRules } from "element-plus";
import { useLogin } from "@/hooks/useLogin";
import type { LoginDto } from "@/type/user";
import { User } from "@element-plus/icons-vue";
import { Unlock } from "@element-plus/icons-vue";

const { loading, handleLogin: login } = useLogin();

const loginFormRef = ref<FormInstance>();
const remember = ref(false);

const loginForm = reactive<LoginDto>({
  userName: "",
  passWord: "",
});

const loginRules: FormRules = {
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度为 2-20 个字符", trigger: "blur" },
  ],
  passWord: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { max: 16, message: "密码长度不能超过 16 个字符", trigger: "blur" },
    {
      pattern: /^[A-Za-z0-9]+$/,
      message: "密码仅允许英文、数字",
      trigger: "blur",
    },
  ],
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return;
    if (remember.value) {
      localStorage.setItem("savedUsername", loginForm.userName);
    } else {
      localStorage.removeItem("savedUsername");
    }
    await login(loginForm);
  });
};

onMounted(() => {
  const saved = localStorage.getItem("savedUsername");
  if (saved) {
    loginForm.userName = saved;
    remember.value = true;
  }
});
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: clamp(300px, 10%, 160px);
  overflow: hidden;
  background-image: url('../../../assets/images/login-bg.png');
  background-size: cover;
  background-position: center;
}

.login-card {
  width: min(390px, calc(100% - 32px));
  min-height: 450px; 
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .login-container {
    justify-content: center;
    padding-right: 16px;
    padding-left: 16px;
  }
}

.login-title {
  text-align: center;
  margin: 0 0 40px 0;
  font-size: 20px;
  font-weight: 700;
  color: #000;
  letter-spacing: 1px;
}

.login-form {
  margin-top: 20px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.login-form :deep(.el-input__wrapper) {
  padding: 12px 15px;
  box-shadow: none !important;
  border-radius: 0;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #dcdfe6;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: none !important;
  background-color: transparent;
  border-bottom: 1px solid #c0c4cc;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
  background-color: transparent;
  border-bottom: 1px solid #409eff;
}

.login-button {
  width: 100%;
  height: 35px;
  font-size: 14px;
  border-radius: 20px;
  letter-spacing: 2px;
}
</style>
