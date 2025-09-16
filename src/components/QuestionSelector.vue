<template>
  <div class="question-selector">
    <!-- Header với button tạo mới và refresh -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        Chọn câu hỏi từ ngân hàng
      </h3>
      <div class="flex space-x-2">
        <n-button @click="refreshQuestions" type="default" size="small">
          <template #icon>
            <n-icon><Refresh /></n-icon>
          </template>
          Làm mới
        </n-button>
        <n-button
          @click="$emit('create-new-question')"
          type="primary"
          size="small"
        >
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
          Tạo câu hỏi mới
        </n-button>
      </div>
    </div>
    <!-- Search and Filters -->
    <div class="mb-4">
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
    </div>

    <!-- Questions List -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="filteredQuestions.length > 0" class="space-y-2">
        <div
          v-for="question in filteredQuestions"
          :key="question.id"
          class="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{ 'bg-blue-50 border-blue-200': isSelected(question.id) }"
          @click="toggleQuestion(question.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="font-medium text-gray-800 line-clamp-2">
                {{ question.content }}
              </p>
              <div class="flex items-center space-x-3 mt-2">
                <n-tag :type="getQuestionTypeColor(question.type)" size="small">
                  {{ getQuestionTypeLabel(question.type) }}
                </n-tag>
                <span class="text-sm text-gray-500"
                  >{{ question.listAnswers.length }} câu trả lời</span
                >
              </div>
            </div>

            <n-button
              v-if="isSelected(question.id)"
              type="primary"
              size="tiny"
              circle
            >
              <template #icon>
                <n-icon><Checkmark /></n-icon>
              </template>
            </n-button>
            <n-button v-else type="default" size="tiny" circle>
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </div>

      <n-empty v-else description="Không tìm thấy câu hỏi" class="py-8" />
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 mt-4 border-t">
      <n-button @click="$emit('close')">Hủy</n-button>
      <n-button type="primary" @click="confirmSelection">Xác nhận</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { Search, Add, Checkmark, Refresh } from "@vicons/ionicons5";
import { useQuestion } from "@/composables/useQuestion";
import type { QuestionResponse } from "@/services/question.service";

const props = defineProps<{
  selectedQuestions: number[];
}>();

const emit = defineEmits([
  "select-question",
  "create-new-question",
  "close",
  "refresh",
]);

const message = useMessage();
const { getAllActiveQuestions } = useQuestion();

const searchTerm = ref("");
const questions = ref<QuestionResponse[]>([]);
const loading = ref(false);

// Computed
const filteredQuestions = computed(() => {
  if (!searchTerm.value) return questions.value;

  return questions.value.filter((question) =>
    question.content.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Methods
const fetchQuestions = async () => {
  loading.value = true;
  try {
    const result = await getAllActiveQuestions();
    if (result.data) {
      questions.value = result.data.data;
    }
  } catch (error) {
    message.error("Lỗi khi tải câu hỏi: " + error);
  } finally {
    loading.value = false;
  }
};

const isSelected = (questionId: number) => {
  return props.selectedQuestions.includes(questionId);
};

const toggleQuestion = (questionId: number) => {
  emit("select-question", questionId);
};

const confirmSelection = () => {
  emit("close");
};

const handleSearch = () => {
  // Search is handled by computed property
};

const getQuestionTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    SINGLE_CHOICE: "Trắc nghiệm đơn",
    MULTIPLE_CHOICE: "Trắc nghiệm nhiều",
    FILL_IN_BLANK: "Điền vào chỗ trống",
    TRUE_FALSE: "Đúng/Sai",
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
const refreshQuestions = () => {
  fetchQuestions();
  emit("refresh");
};

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
</style>
