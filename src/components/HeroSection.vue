<template>
  <section class="pt-40 pb-20 bg-gray-50">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center px-4">
      <div>
        <h1
          class="text-3xl md:text-3xl font-extrabold text-primary mb-6 leading-tight"
        >
          KIỂM TRA TRÌNH ĐỘ IELTS CỦA BẠN CHỈ TRONG 15 PHÚT
        </h1>
        <p class="text-xl text-gray-700 mb-8 font-medium">
          Bài test chuẩn quốc tế, kết quả chi tiết, định hướng học tập cá nhân
          hóa.
        </p>
        <n-button
          type="primary"
          :color="primaryColor"
          size="large"
          class="px-8 py-4 text-lg font-bold rounded-lg shadow hover:opacity-90 transition-all"
        >
          BẮT ĐẦU MIỄN PHÍ
        </n-button>
      </div>
      <div class="flex justify-center">
        <img
          src="../assets/logo.jpg"
          alt="IELTS Study"
          class="max-h-[16rem] object-cover"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { useColors } from "@/composables/useColors";

const { primaryColor } = useColors();
</script>
