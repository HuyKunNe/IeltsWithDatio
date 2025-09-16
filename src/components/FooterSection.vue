<template>
  <footer class="py-10 bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4">
      <div>
        <div class="text-xl font-bold text-white mb-2">IELTS With Datio</div>
        <p class="text-l">Học thông minh, đạt band cao</p>
      </div>
      <div>
        <h3 class="font-semibold mb-2 text-white text-xl">Menu</h3>
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item">
            <a href="#" class="hover:text-white text-l">{{ item }}</a>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold mb-2 text-white">Kết nối</h3>
        <div class="flex space-x-4">
          <ul class="space-y-2">
            <li>
              <a href="#" class="hover:text-white text-xl">🌐</a>
            </li>
            <li>
              <a href="#" class="hover:text-white text-xl">📘</a>
            </li>
            <li>
              <a href="#" class="hover:text-white text-xl">💬</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="text-center text-sm mt-6 border-t border-gray-700 pt-4">
      © 2025 IELTS With Datio. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
const menuItems = ["Trang chủ", "Bài test mẫu", "Giáo trình", "Liên hệ"];
</script>
