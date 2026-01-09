<template>
  <div class="question-detail">
    <!-- Question Content -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">
        Nội dung câu hỏi:
      </h3>
      <p class="text-gray-700 bg-gray-50 p-4 rounded-lg">
        {{ question.content }}
      </p>
    </div>

    <!-- Question Info -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-1">Loại câu hỏi:</h4>
        <n-tag :type="getQuestionTypeColor(question.type)" size="small">
          {{ getQuestionTypeLabel(question.type) }}
        </n-tag>
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-1">Trạng thái:</h4>
        <n-tag :type="getStatusColor(question.status)" size="small">
          {{ question.status }}
        </n-tag>
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-1">Ngày tạo:</h4>
        <p class="text-gray-700">{{ formatDate(question.createAt) }}</p>
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-600 mb-1">ID:</h4>
        <p class="text-gray-700">{{ question.id }}</p>
      </div>
    </div>

    <!-- Answers -->
    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Câu trả lời:</h3>
      <div class="space-y-2">
        <div
          v-for="(answer, index) in question.listAnswers"
          :key="answer.id"
          class="p-3 border rounded-lg"
          :class="{
            'border-green-200 bg-green-50': answer.isCorrect === true,
          }"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">Câu {{ index + 1 }}:</span>
            <n-tag v-if="answer.isCorrect === true" type="success" size="small">
              Đúng
            </n-tag>
            <n-tag v-else type="default" size="small"> Sai </n-tag>
          </div>
          <p class="text-gray-700 mt-1">{{ answer.content }}</p>
          <div class="text-xs text-gray-500 mt-2">
            ID: {{ answer.id }} • {{ formatDate(answer.createAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
      <n-button @click="$emit('close')">Đóng</n-button>
      <n-button type="primary" v-if="isManager" @click="editQuestion">
        Chỉnh sửa
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { QuestionResponse } from "@/services/question.service";

const props = defineProps<{
  question: QuestionResponse;
}>();

const emit = defineEmits(["close"]);

const router = useRouter();
const authStore = useAuthStore();

const isManager = computed(() => {
  return (
    authStore.user?.roleName === "MANAGER" ||
    authStore.user?.roleName === "ADMIN"
  );
});

const getQuestionTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    SINGLE_CHOICE: "SINGLE_CHOICE",
    MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
    FILL_IN_BLANK: "FILL_IN_BLANK",
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: "success",
    INACTIVE: "error",
    PENDING: "warning",
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

const editQuestion = () => {
  router.push(`/question-manager/edit/${props.question.id}`);
  emit("close");
};
</script>

<style scoped>
.question-detail {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
