<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mt-24 mb-6">
        <div class="flex items-center space-x-4">
          <n-button @click="goBack" circle>
            <template #icon>
              <n-icon><ArrowBack /></n-icon>
            </template>
          </n-button>
          <div>
            <h1 class="text-3xl font-bold text-primary mb-2">
              Chi Tiết Bài Test
            </h1>
            <p class="text-gray-600">Thông tin chi tiết về bài test</p>
          </div>
        </div>
      </div>

      <n-spin :show="loading">
        <!-- Test Avatar -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <div class="h-32">
            <img
              src="../assets/logo.png"
              :alt="test.title"
              class="w-full h-full object-contain"
            />
          </div>

          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            {{ test.title }}
          </h2>
          <n-tag :type="getStatusColor(test.status)" size="medium" class="mb-3">
            {{ test.status }}
          </n-tag>
          <n-tag
            :type="getTestTypeColor(test.type)"
            size="medium"
            class="ml-2"
            :bordered="true"
          >
            {{ getTestTypeLabel(test.type) }}
          </n-tag>
        </div>

        <!-- Test Information -->
        <div class="bg-white rounded-lg shadow-md py-6 px-12 mb-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            Thông tin bài test
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Mô tả:</label
                >
                <p class="text-gray-800">
                  {{ test.description || "Không có mô tả" }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Thời gian làm bài:</label
                >
                <p class="text-gray-800">{{ test.timeLimit }} phút</p>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Số câu hỏi:</label
                >
                <p class="text-gray-800">
                  {{ test.testQuestionResponses?.length || 0 }} câu
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Số lần làm tối đa:</label
                >
                <p class="text-gray-800">{{ test.maxAttempts }}</p>
              </div>

              <!-- <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Ngày tạo:</label
                >
                <p class="text-gray-800">{{ formatDate(test.createdAt) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1"
                  >Tài nguyên:</label
                >
                <p class="text-gray-800">
                  {{ test.testResourceResponses?.length || 0 }} tài nguyên
                </p>
              </div> -->
            </div>
          </div>
        </div>

        <!-- Questions Section -->
        <div
          class="bg-white rounded-lg shadow-md p-6 mb-6"
          v-if="test.testQuestionResponses?.length > 0 && isManager"
        >
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            Danh sách câu hỏi
          </h3>

          <div class="space-y-4">
            <div
              v-for="(testQuestion, index) in test.testQuestionResponses"
              :key="testQuestion.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-medium text-gray-800">
                  Câu {{ index + 1 }} ({{ testQuestion.points }} điểm)
                </h4>
                <n-tag
                  :type="
                    getQuestionTypeColor(testQuestion.questionResponse.type)
                  "
                  size="small"
                >
                  {{ getQuestionTypeLabel(testQuestion.questionResponse.type) }}
                </n-tag>
              </div>

              <p class="text-gray-700 mb-3">
                {{ testQuestion.questionResponse.content }}
              </p>

              <!-- Answers -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <h5 class="font-medium text-gray-700 mb-2">Câu trả lời:</h5>
                <ul class="space-y-1">
                  <li
                    v-for="(answer, ansIndex) in testQuestion.questionResponse
                      .listAnswers"
                    :key="answer.id"
                    :class="{
                      'text-green-600 font-medium': answer.isCorrect === 'true',
                    }"
                  >
                    {{ ansIndex + 1 }}. {{ answer.content }}
                    <span v-if="answer.isCorrect === 'true'" class="ml-2"
                      >✓</span
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources Section -->
        <div
          class="bg-white rounded-lg shadow-md p-6 mb-6"
          v-if="test.testResourceResponses?.length > 0 && isManager"
        >
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Tài nguyên</h3>

          <div class="space-y-3">
            <div
              v-for="resource in test.testResourceResponses"
              :key="resource.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-800">
                  {{ resource.resourceType }}
                </h4>
                <n-tag size="small">Thứ tự: {{ resource.displayOrder }}</n-tag>
              </div>

              <p class="text-gray-600 mb-2" v-if="resource.description">
                {{ resource.description }}
              </p>

              <div v-if="resource.url" class="mt-2">
                <n-button
                  size="small"
                  @click="openResource(resource.url)"
                  v-if="resource.resourceType === 'IMAGE'"
                >
                  Xem hình ảnh
                </n-button>
                <n-button
                  size="small"
                  @click="openResource(resource.url)"
                  v-else-if="resource.resourceType === 'AUDIO'"
                >
                  Nghe audio
                </n-button>
                <n-button
                  size="small"
                  @click="openResource(resource.url)"
                  v-else
                >
                  Mở tài nguyên
                </n-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-center space-x-4">
            <n-button
              @click="startTest"
              type="primary"
              size="large"
              v-if="test.status === 'ACTIVATED'"
            >
              Bắt Đầu Làm Bài
            </n-button>

            <n-button @click="goBack" size="large"> Quay Lại </n-button>

            <n-button
              v-if="isManager"
              @click="editTest"
              type="primary"
              size="large"
            >
              Chỉnh Sửa
            </n-button>
          </div>
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { ArrowBack } from "@vicons/ionicons5";
import { useTest } from "@/composables/useTest";
import { useAuthStore } from "@/stores/auth";
import type { TestDetail } from "@/services/test.service";

const route = useRoute();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const { getTestById } = useTest();

const test = ref<TestDetail>({
  id: 0,
  title: "",
  description: "",
  timeLimit: 0,
  type: "READING",
  maxAttempts: 0,
  status: "",
  createdAt: "",
  testQuestionResponses: [],
  testResourceResponses: [],
});

const loading = ref(false);

// Computed
const isManager = computed(() => {
  return (
    authStore.user?.roleName === "MANAGER" ||
    authStore.user?.roleName === "ADMIN"
  );
});

// Methods
const fetchTest = async () => {
  loading.value = true;
  const testId = Number(route.params.id);

  if (isNaN(testId)) {
    message.error("ID bài test không hợp lệ");
    router.push("/tests");
    return;
  }

  try {
    const result = await getTestById(testId);

    if (result.error) {
      message.error("Lỗi khi tải bài test: " + result.error);
      router.push("/tests");
    } else if (result.data) {
      test.value = result.data.data;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      message.error("Không tìm thấy bài test");
    } else {
      message.error("Lỗi hệ thống: " + error.message);
    }
    router.push("/tests");
  } finally {
    loading.value = false;
  }
};

const getTestTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    READING: "READING",
    LISTENING: "LISTENING",
  };
  return types[type] || type;
};

const getTestTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    READING: "info",
    LISTENING: "success",
  };
  return colors[type] || "default";
};

const getQuestionTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    SINGLE_CHOICE: "SINGLE CHOICE",
    MULTIPLE_CHOICE: "MULTIPLE CHOICE",
    FILL_IN_BLANK: "FILL IN BLANK",
  };
  return types[type] || type;
};

const getQuestionTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    SINGLE_CHOICE: "primary",
    MULTIPLE_CHOICE: "info",
    FILL_IN_BLANK: "success",
    TRUE_FALSE: "warning",
  };
  return colors[type] || "default";
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVATED: "success",
    DEACTIVATED: "error",
    PENDING: "warning",
    DRAFT: "default",
  };
  return colors[status] || "default";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const openResource = (url: string) => {
  window.open(url, "_blank");
};

const startTest = () => {
  router.push(`/test/${test.value.id}/attempt`);
};

const editTest = () => {
  router.push(`/test/edit/${test.value.id}`);
};

const goBack = () => {
  router.push("/tests");
};

// Lifecycle
onMounted(() => {
  fetchTest();
});
</script>

<style scoped>
.n-spin-container {
  min-height: 400px;
}
</style>
