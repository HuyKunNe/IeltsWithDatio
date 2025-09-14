<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-[#7d4700] text-center mb-10">
        Học viên nói gì?
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="p-6 border rounded-lg shadow-sm"
        >
          <p class="mb-4">"{{ testimonial.comment }}"</p>
          <div class="flex items-center space-x-3">
            <img
              :src="testimonial.avatar"
              class="w-12 h-12 rounded-full"
              :alt="testimonial.name"
            />
            <span class="font-semibold"
              >{{ testimonial.name }} – {{ testimonial.band }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    comment: "Bài test rất giống thật, giúp mình biết rõ điểm yếu.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Lan",
    band: "Band 7.0",
  },
  {
    comment: "Mình có lộ trình học rõ ràng sau khi làm test.",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    name: "Minh",
    band: "Band 6.5",
  },
  {
    comment: "Hoàn toàn miễn phí, rất đáng thử!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Thảo",
    band: "Band 7.5",
  },
];
</script>
