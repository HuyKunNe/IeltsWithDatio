<template>
  <header class="w-full bg-white shadow-md fixed top-0 z-50">
    <div class="max-w-7xl mx-auto flex justify-between items-center p-4">
      <div class="flex items-center">
        <img
          src="../assets/logo.png"
          alt="IELTS Test Logo"
          class="h-12 w-12 mr-3 rounded-lg"
        />
        <div class="text-3xl font-extrabold text-primary tracking-wide">
          IELTS with DATIO
        </div>
      </div>

      <nav class="hidden md:flex space-x-8 text-gray-700">
        <router-link
          to="/"
          class="text-lg font-bold hover:text-primary transition-colors"
          >TRANG CHỦ</router-link
        >
        <router-link
          v-if="authStore.user?.roleName === 'MANAGER'"
          to="/questions"
          class="text-lg font-bold hover:text-primary transition-colors"
          >QUẢN LÍ CÂU HỎI</router-link
        >
        <router-link
          v-if="authStore.user?.roleName === 'MANAGER'"
          to="/test/create"
          class="text-lg font-bold hover:text-primary transition-colors"
          >QUẢN LÍ TEST</router-link
        >
        <router-link
          to="/tests"
          class="text-lg font-bold hover:text-primary transition-colors"
          >BÀI TEST</router-link
        >
        <a
          href="#"
          class="text-lg font-bold hover:text-primary transition-colors"
          >GIÁO TRÌNH</a
        >
        <a
          href="#"
          class="text-lg font-bold hover:text-primary transition-colors"
          >LIÊN HỆ</a
        >
      </nav>

      <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
        <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
          <div class="flex items-center space-x-2 cursor-pointer">
            <!-- <n-avatar round size="small" :src="authStore.user?.avatar" /> -->
            <span class="font-medium text-3xl text-primary">{{
              authStore.user?.name
            }}</span>
          </div>
        </n-dropdown>
      </div>
      <div v-else class="flex space-x-4">
        <router-link to="/login">
          <n-button
            type="primary"
            color="#7d4700"
            class="px-4 py-2 font-bold rounded-lg"
          >
            Đăng Nhập
          </n-button>
        </router-link>
        <router-link to="/register">
          <n-button class="px-4 py-2 font-bold rounded-lg"> Đăng Kí </n-button>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { NButton, NDropdown } from "naive-ui";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const userMenuOptions = computed(() => [
  ...(authStore.user?.roleName === "MANAGER"
    ? [
        {
          label: "Quản lý câu hỏi",
          key: "questions",
        },
      ]
    : []),
  {
    label: "Hồ sơ",
    key: "profile",
  },
  {
    label: "Bài test của tôi",
    key: "tests",
  },
  {
    type: "divider",
  },
  {
    label: "Đăng xuất",
    key: "logout",
  },
]);

const handleUserMenuSelect = (key: string) => {
  if (key === "logout") {
    authStore.logout();
    router.push("/");
  } else if (key === "profile") {
    router.push("/profile");
  } else if (key === "tests") {
    router.push("/my-tests");
  } else if (key === "questions") {
    router.push("/questions");
  }
};
</script>
