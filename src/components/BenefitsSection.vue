<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <h2 class="text-4xl font-extrabold text-primary mb-12">
        VÌ SAO CHỌN CHÚNG TÔI?
      </h2>
      <div class="grid md:grid-cols-4 gap-8">
        <div
          v-for="benefit in benefits"
          :key="benefit.title"
          class="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="text-5xl mb-4">{{ benefit.emoji }}</div>
          <h3 class="font-bold text-lg">{{ benefit.title }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  { emoji: "📘", title: "ĐỀ THI CHUẨN IELTS" },
  { emoji: "📊", title: "KẾT QUẢ CHI TIẾT" },
  { emoji: "🎯", title: "LỘ TRÌNH HỌC CÁ NHÂN" },
  { emoji: "💯", title: "MIỄN PHÍ HOÀN TOÀN" },
];
</script>
