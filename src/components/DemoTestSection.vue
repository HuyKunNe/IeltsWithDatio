<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <h2 class="text-4xl font-extrabold text-primary mb-8">
        THỬ NGAY MỘT BÀI TEST LISTENING
      </h2>
      <img
        src="https://image.anninhthudo.vn/w660/Uploaded/2025/erwqqdxwp/2024_10_14/chung-chi-ielts-9424.jpg.avif"
        alt="Test Demo"
        class="mx-auto max-h-[400px] mb-8"
      />
      <div>
        <n-button
          type="primary"
          :color="primaryColor"
          size="large"
          class="px-8 py-4 text-lg font-bold rounded-lg shadow hover:opacity-90 transition-all"
        >
          THỬ NGAY
        </n-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { useColors } from "@/composables/useColors";

const { primaryColor } = useColors();
</script>
