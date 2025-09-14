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
          IELTS With DATIO
        </div>
      </div>
      <nav class="hidden md:flex space-x-8 text-gray-700">
        <a
          href="#"
          class="text-lg font-bold hover:text-primary transition-colors"
          >TRANG CHỦ</a
        >
        <a
          href="#"
          class="text-lg font-bold hover:text-primary transition-colors"
          >BÀI TEST MẪU</a
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
      <n-button
        type="primary"
        :color="primaryColor"
        class="px-6 py-3 text-lg font-bold rounded-lg shadow hover:opacity-90 transition-all"
      >
        LÀM TEST NGAY
      </n-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { useColors } from "@/composables/useColors";

const { primaryColor } = useColors();
</script>
