<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center" @click="switchToHome">
          <img
            src="../assets/logo.png"
            alt="IELTS Test Logo"
            class="max-h-[10rem] object-cover"
          />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">
          ĐĂNG NHẬP
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <a
            href="#"
            class="font-medium text-primary hover:text-primary-light"
            @click.prevent="switchToRegister"
          >
            đăng ký tài khoản mới
          </a>
        </p>
      </div>

      <n-form
        class="mt-8 space-y-6"
        :model="formData"
        :rules="rules"
        ref="loginForm"
      >
        <n-form-item path="username" label="Username">
          <n-input
            v-model:value="formData.userName"
            placeholder="Nhập username của bạn"
            size="large"
            @keydown.enter="handleLogin"
          >
            <template #prefix>
              <n-icon><MailOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" label="Mật khẩu">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="Nhập mật khẩu"
            size="large"
            @keydown.enter="handleLogin"
          >
            <template #prefix>
              <n-icon><LockClosedOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <div class="flex items-center justify-between">
          <n-checkbox v-model:checked="rememberMe">
            Ghi nhớ đăng nhập
          </n-checkbox>
          <a href="#" class="text-sm text-primary hover:text-primary-light">
            Quên mật khẩu?
          </a>
        </div>

        <div>
          <n-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="w-full"
          >
            ĐĂNG NHẬP
          </n-button>
        </div>
      </n-form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500"
              >Hoặc đăng nhập với</span
            >
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <n-button class="w-full" @click="loginWithGoogle">
            <template #icon>
              <n-icon><LogoGoogle /></n-icon>
            </template>
            Google
          </n-button>

          <n-button class="w-full" @click="loginWithFacebook">
            <template #icon>
              <n-icon><LogoFacebook /></n-icon>
            </template>
            Facebook
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import {
  MailOutline,
  LockClosedOutline,
  LogoGoogle,
  LogoFacebook,
} from "@vicons/ionicons5";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();

const loginForm = ref();
const loading = ref(false);
const rememberMe = ref(false);

const formData = reactive({
  userName: "",
  password: "",
});

const rules = {
  userName: [
    { required: true, message: "Vui lòng nhập username", trigger: "blur" },
    { min: 4, max: 20, message: "username không hợp lệ", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: "blur" },
    {
      min: 8,
      max: 20,
      message: "Mật khẩu phải có ít nhất 8 ký tự",
      trigger: "blur",
    },
  ],
};

const handleLogin = async () => {
  await loginForm.value?.validate();
  loading.value = true;
  try {
    // Gọi API login
    await authStore.login({
      userName: formData.userName,
      password: formData.password,
    });
    message.success("Đăng nhập thành công!");
    router.push("/");
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    } else {
      message.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  } finally {
    loading.value = false;
  }
};

const switchToRegister = () => {
  router.push("/register");
};

const switchToHome = () => {
  router.push("/");
};

const loginWithGoogle = () => {
  message.info("Tính năng đăng nhập với Google sẽ được tích hợp sau");
};

const loginWithFacebook = () => {
  message.info("Tính năng đăng nhập với Facebook sẽ được tích hợp sau");
};
</script>

<style scoped>
.n-form-item {
  margin-bottom: 1.5rem;
}
</style>
