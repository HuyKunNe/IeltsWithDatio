<template>
  <div class="min-h-screen bg-gray-50 pt-[6rem] pb-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-primary mb-2">
              Ngân Hàng Câu Hỏi
            </h1>
            <p class="text-gray-600">
              Quản lý và xem tất cả câu hỏi trong hệ thống
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Hiển thị {{ displayedQuestions.length }} của
              {{ allQuestions.length }} câu hỏi
            </p>
          </div>
          <n-button
            type="primary"
            @click="goToQuestionManager"
            v-if="isManager"
          >
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            Thêm Câu Hỏi
          </n-button>
        </div>
      </div>

      <!-- Filters và Search -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <n-input
            v-model:value="searchTerm"
            placeholder="Tìm kiếm câu hỏi..."
            clearable
            @clear="handleSearch"
            @keydown.enter="handleSearch"
          >
            <template #prefix>
              <n-icon><Search /></n-icon>
            </template>
          </n-input>

          <!-- Filter by type -->
          <n-select
            v-model:value="filterType"
            :options="questionTypeOptions"
            placeholder="Lọc theo loại"
            clearable
            @update:value="handleFilter"
          />

          <!-- Items per page -->
          <n-select
            v-model:value="pagination.pageSize"
            :options="pageSizeOptions"
            placeholder="Số lượng / trang"
            @update:value="handlePageSizeChange"
          />

          <!-- Refresh button -->
          <n-button @click="fetchQuestions" type="primary" ghost>
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            Làm mới
          </n-button>
        </div>
      </div>

      <!-- Loading -->
      <n-spin :show="loading" class="mb-6">
        <!-- Questions List -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Table Header -->
          <div
            class="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold text-gray-700"
          >
            <div class="col-span-1">ID</div>
            <div class="col-span-5">Nội dung câu hỏi</div>
            <div class="col-span-2">Loại</div>
            <div class="col-span-2">Ngày tạo</div>
            <div class="col-span-1">Số câu trả lời</div>
            <div class="col-span-1 text-center">Thao tác</div>
          </div>

          <!-- Questions -->
          <div v-if="displayedQuestions.length > 0">
            <div
              v-for="question in displayedQuestions"
              :key="question.id"
              class="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <!-- ID -->
              <div class="col-span-1">
                <span class="text-sm text-gray-500">#{{ question.id }}</span>
              </div>

              <!-- Content -->
              <div class="col-span-5">
                <div class="font-medium text-gray-800 line-clamp-2">
                  {{ question.content }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ question.status }}
                </div>
              </div>

              <!-- Type -->
              <div class="col-span-2">
                <n-tag :type="getQuestionTypeColor(question.type)" size="small">
                  {{ getQuestionTypeLabel(question.type) }}
                </n-tag>
              </div>

              <!-- Date -->
              <div class="col-span-2">
                <span class="text-sm text-gray-600">{{
                  formatDate(question.createAt)
                }}</span>
              </div>

              <!-- Answers count -->
              <div class="col-span-1">
                <span class="text-gray-600">{{
                  question.listAnswers.length
                }}</span>
              </div>

              <!-- Actions -->
              <div class="col-span-1 flex justify-center space-x-1">
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-button size="small" @click="viewQuestion(question)">
                      <template #icon>
                        <n-icon><Eye /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  Xem chi tiết
                </n-tooltip>

                <n-tooltip trigger="hover" v-if="isManager">
                  <template #trigger>
                    <n-button
                      size="small"
                      type="primary"
                      @click="editQuestion(question)"
                    >
                      <template #icon>
                        <n-icon><Create /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  Chỉnh sửa
                </n-tooltip>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="p-8 text-center">
            <n-empty description="Không tìm thấy câu hỏi nào">
              <template #extra>
                <n-button size="small" @click="resetFilters" v-if="hasFilters">
                  Xóa bộ lọc
                </n-button>
              </template>
            </n-empty>
          </div>
        </div>
      </n-spin>

      <!-- Pagination -->
      <div
        class="bg-white rounded-lg shadow-md p-4"
        v-if="pagination.totalPages > 1"
      >
        <n-pagination
          v-model:page="pagination.page"
          :page-count="pagination.totalPages"
          :page-size="pagination.pageSize"
          :item-count="pagination.total"
          show-size-changer
          :page-sizes="[10, 20, 50, 100]"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- Question Detail Modal -->
    <n-modal
      v-model:show="showDetailModal"
      preset="card"
      :title="selectedQuestion ? 'Chi tiết câu hỏi' : ''"
      style="width: 90%; max-width: 800px"
    >
      <QuestionDetail
        v-if="selectedQuestion"
        :question="selectedQuestion"
        @close="showDetailModal = false"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { useQuestion } from "@/composables/useQuestion";
import type { QuestionResponse } from "@/services/question.service";
import { useAuthStore } from "@/stores/auth";
import { Add, Create, Eye, Refresh, Search } from "@vicons/ionicons5";
import { useMessage } from "naive-ui";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import QuestionDetail from "./QuestionDetail.vue";

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const { getAllActiveQuestions } = useQuestion();

// Data
const allQuestions = ref<QuestionResponse[]>([]);
const loading = ref(false);
const messageText = ref("");
const messageType = ref<"success" | "error" | "info" | "warning">("info");
const showDetailModal = ref(false);
const selectedQuestion = ref<QuestionResponse | null>(null);

// Pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
});

// Filters
const searchTerm = ref("");
const filterType = ref("");

// Options
const questionTypeOptions = [
  { label: "SINGLE CHOICE", value: "SINGLE_CHOICE" },
  { label: "MULTIPLE CHOICE", value: "MULTIPLE_CHOICE" },
  { label: "FILL IN BLANK", value: "FILL_IN_BLANK" },
];

const pageSizeOptions = [
  { label: "5 câu / trang", value: 5 },
  { label: "10 câu / trang", value: 10 },
  { label: "20 câu / trang", value: 20 },
  { label: "50 câu / trang", value: 50 },
  { label: "100 câu / trang", value: 100 },
];

// Computed
const isManager = computed(() => {
  return (
    authStore.user?.roleName === "MANAGER" ||
    authStore.user?.roleName === "ADMIN"
  );
});

const hasFilters = computed(() => {
  return searchTerm.value || filterType.value;
});

const filteredQuestions = computed(() => {
  let questions = allQuestions.value;

  // Filter by search term
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    questions = questions.filter((q) =>
      q.content.toLowerCase().includes(searchLower)
    );
  }

  // Filter by type
  if (filterType.value) {
    questions = questions.filter((q) => q.type === filterType.value);
  }

  return questions;
});

const displayedQuestions = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredQuestions.value.slice(start, end);
});

// Methods
const fetchQuestions = async () => {
  loading.value = true;
  messageText.value = "";

  try {
    const result = await getAllActiveQuestions();

    if (result.error) {
      messageText.value = result.error;
      messageType.value = "error";
      message.error("Lỗi khi tải câu hỏi: " + result.error);
    } else if (result.data) {
      allQuestions.value = result.data.data;
      updatePagination();
    }
  } catch (error) {
    messageText.value = "Có lỗi xảy ra khi tải câu hỏi";
    messageType.value = "error";
    message.error("Lỗi hệ thống: " + error);
  } finally {
    loading.value = false;
  }
};

const updatePagination = () => {
  pagination.total = filteredQuestions.value.length;
  pagination.totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // Reset to page 1 if current page is beyond total pages
  if (pagination.page > pagination.totalPages) {
    pagination.page = 1;
  }
};

const handleSearch = () => {
  pagination.page = 1;
  updatePagination();
};

const handleFilter = () => {
  pagination.page = 1;
  updatePagination();
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  // Scroll to top when changing page
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.page = 1;
  updatePagination();
};

const resetFilters = () => {
  searchTerm.value = "";
  filterType.value = "";
  pagination.page = 1;
  updatePagination();
};

const viewQuestion = (question: QuestionResponse) => {
  selectedQuestion.value = question;
  showDetailModal.value = true;
};

const editQuestion = (question: QuestionResponse) => {
  router.push(`/question-manager?edit=${question.id}`);
};

const goToQuestionManager = () => {
  router.push("/question-manager");
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
    SINGLE_CHOICE: "warning",
    MULTIPLE_CHOICE: "info",
    FILL_IN_BLANK: "success",
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

// Watchers
watch([searchTerm, filterType], () => {
  updatePagination();
});

watch(filteredQuestions, () => {
  updatePagination();
});

// Lifecycle
onMounted(() => {
  fetchQuestions();
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

.grid {
  display: grid;
}
</style>
