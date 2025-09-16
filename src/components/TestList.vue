<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mt-28 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-primary mb-2">
              Danh Sách Bài Test
            </h1>
            <p class="text-gray-600">Tất cả bài test IELTS có trong hệ thống</p>
          </div>
          <n-button type="primary" @click="goToTestCreator" v-if="isManager">
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            Tạo Bài Test Mới
          </n-button>
        </div>
      </div>

      <!-- Loading -->
      <n-spin :show="loading" class="mb-6">
        <!-- Test Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Test Card -->
          <div
            v-for="test in tests"
            :key="test.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            @click="viewTest(test)"
          >
            <!-- Test Avatar -->
            <div class="h-48 relative">
              <img
                src="../assets/logo.png"
                :alt="test.title"
                class="w-full h-full object-contain"
              />
              <div class="absolute bottom-4 left-4">
                <n-tag :type="getTestTypeColor(test.type)" size="medium">
                  {{ getTestTypeLabel(test.type) }}
                </n-tag>
              </div>
            </div>

            <!-- Test Content -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                {{ test.title }}
              </h3>

              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ test.description || "Không có mô tả" }}
              </p>

              <!-- Test Info -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">Thời gian:</span>
                  <span class="font-medium text-gray-800"
                    >{{ test.timeLimit }} phút</span
                  >
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">Số lần làm:</span>
                  <span class="font-medium text-gray-800">{{
                    test.maxAttempts
                  }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">Ngày tạo:</span>
                  <span class="text-sm text-gray-600">{{
                    formatDate(test.createdAt)
                  }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-between items-center mt-4 pt-4 border-t">
                <n-button size="small" @click.stop="viewTest(test)">
                  <template #icon>
                    <n-icon><Eye /></n-icon>
                  </template>
                  Xem chi tiết
                </n-button>

                <n-button
                  v-if="isManager"
                  size="small"
                  type="primary"
                  @click.stop="editTest(test)"
                >
                  <template #icon>
                    <n-icon><Create /></n-icon>
                  </template>
                  Chỉnh sửa
                </n-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && tests.length === 0" class="text-center py-12">
          <n-empty description="Chưa có bài test nào">
            <template #extra>
              <n-button v-if="isManager" @click="goToTestCreator" size="small">
                Tạo bài test đầu tiên
              </n-button>
            </template>
          </n-empty>
        </div>
      </n-spin>

      <!-- Pagination (nếu cần) -->
      <div class="bg-white rounded-lg shadow-md p-4" v-if="false">
        <!-- Có thể thêm pagination sau nếu API hỗ trợ -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { Add, Eye, Create } from "@vicons/ionicons5";
import { useTest } from "@/composables/useTest";
import { useAuthStore } from "@/stores/auth";
import type { TestListItem } from "@/services/test.service";

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const { getAllTests } = useTest();

// Data
const tests = ref<TestListItem[]>([]);
const loading = ref(false);
const messageText = ref("");
const messageType = ref<"success" | "error" | "info" | "warning">("info");

// Computed
const isManager = computed(() => {
  return (
    authStore.user?.roleName === "MANAGER" ||
    authStore.user?.roleName === "ADMIN"
  );
});

// Methods
const fetchTests = async () => {
  loading.value = true;
  messageText.value = "";

  try {
    const result = await getAllTests();

    if (result.error) {
      messageText.value = result.error;
      messageType.value = "error";
      message.error("Lỗi khi tải bài test: " + result.error);
    } else if (result.data) {
      tests.value = result.data.data;
    }
  } catch (error) {
    messageText.value = "Có lỗi xảy ra khi tải bài test";
    messageType.value = "error";
    message.error("Lỗi hệ thống: " + error);
  } finally {
    loading.value = false;
  }
};

const getTestTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    READING: "Reading",
    LISTENING: "Listening",
  };
  return types[type] || type;
};

const getTestTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    READING: "warning",
    LISTENING: "success",
  };
  return colors[type] || "default";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const viewTest = (test: TestListItem) => {
  router.push(`/tests/${test.id}`);
};

const editTest = (test: TestListItem) => {
  router.push(`/test/edit/${test.id}`);
};

const goToTestCreator = () => {
  router.push("/test/create");
};

// Lifecycle
onMounted(() => {
  fetchTests();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
