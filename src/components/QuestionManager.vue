<template>
  <div class="min-h-screen bg-gray-50 pt-[6rem] pb-20">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-primary mb-2">
          Quản Lý Ngân Hàng Câu Hỏi
        </h1>
        <p class="text-gray-600">Tạo và quản lý câu hỏi cho bài test IELTS</p>
      </div>

      <!-- Form tạo câu hỏi -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Thêm Câu Hỏi Mới
        </h2>

        <n-form :model="newQuestion" :rules="questionRules" ref="questionForm">
          <!-- Nội dung câu hỏi -->
          <n-form-item label="Nội dung câu hỏi" path="content" class="mb-4">
            <n-input
              v-model:value="newQuestion.content"
              type="textarea"
              placeholder="Nhập nội dung câu hỏi..."
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </n-form-item>

          <!-- Loại câu hỏi -->
          <n-form-item label="Loại câu hỏi" path="type" class="mb-4">
            <n-select
              v-model:value="newQuestion.type"
              :options="questionTypeOptions"
              placeholder="Chọn loại câu hỏi"
            />
          </n-form-item>

          <!-- Câu trả lời -->
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-700 mb-3">Câu Trả Lời</h3>

            <div
              v-for="(answer, index) in newQuestion.answers"
              :key="index"
              class="flex items-center space-x-3 mb-3 p-3 bg-gray-50 rounded-lg"
            >
              <n-input
                v-model:value="answer.content"
                :placeholder="`Câu trả lời ${index + 1}`"
                class="flex-1"
              />

              <n-checkbox v-model:checked="answer.isCorrect"> Đúng </n-checkbox>

              <n-button
                @click="removeAnswer(index)"
                type="error"
                size="small"
                circle
              >
                <template #icon>
                  <n-icon><Trash /></n-icon>
                </template>
              </n-button>
            </div>

            <n-button
              @click="addAnswer"
              type="primary"
              size="small"
              color="#7d4700"
              class="mt-2"
            >
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              Thêm Câu Trả Lời
            </n-button>
          </div>

          <!-- Nút thêm câu hỏi -->
          <n-button
            @click="addQuestionToList"
            type="primary"
            :loading="addingQuestion"
            color="#7d4700"
            class="w-full"
          >
            Thêm Vào Danh Sách
          </n-button>
        </n-form>
      </div>

      <!-- Danh sách câu hỏi đã thêm -->
      <div
        class="bg-white rounded-lg shadow-md p-6 mb-6"
        v-if="questionsList.length > 0"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Danh Sách Câu Hỏi Đã Thêm
        </h2>

        <div
          v-for="(question, index) in questionsList"
          :key="index"
          class="border rounded-lg p-4 mb-4"
        >
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-medium text-gray-800">
              Câu {{ index + 1 }}
            </h3>
            <n-button
              @click="removeQuestion(index)"
              type="error"
              size="small"
              circle
            >
              <template #icon>
                <n-icon><Close /></n-icon>
              </template>
            </n-button>
          </div>

          <p class="text-gray-700 mb-2">{{ question.content }}</p>
          <p class="text-sm text-gray-500 mb-3">Loại: {{ question.type }}</p>

          <div class="bg-gray-50 p-3 rounded-lg">
            <h4 class="font-medium text-gray-700 mb-2">Câu trả lời:</h4>
            <ul class="space-y-1">
              <li
                v-for="(answer, ansIndex) in question.answers"
                :key="ansIndex"
                :class="{ 'text-green-600 font-medium': answer.isCorrect }"
              >
                • {{ answer.content }} {{ answer.isCorrect ? " (Đúng)" : "" }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Nút gửi -->
        <n-button
          @click="submitQuestions"
          type="primary"
          :loading="submitting"
          :disabled="questionsList.length === 0"
          class="w-full"
        >
          Tạo Ngân Hàng Câu Hỏi ({{ questionsList.length }} câu)
        </n-button>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-lg shadow-md p-6 text-center">
        <n-empty description="Chưa có câu hỏi nào được thêm">
          <template #extra>
            <p class="text-gray-500">
              Thêm câu hỏi đầu tiên bằng form bên trên
            </p>
          </template>
        </n-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useMessage } from "naive-ui";
import { Add, Trash, Close } from "@vicons/ionicons5";
import { useQuestion } from "@/composables/useQuestion";
import type { QuestionRequest } from "@/services/question.service";

const message = useMessage();
const { createQuestions } = useQuestion();

// Form data
const newQuestion = reactive({
  content: "",
  type: "",
  answers: [
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ] as Array<{ content: string; isCorrect: boolean }>,
});

const questionsList = ref<QuestionRequest[]>([]);
const addingQuestion = ref(false);
const submitting = ref(false);
const messageText = ref("");
const messageType = ref<"success" | "error" | "info" | "warning">("info");

// Options
const questionTypeOptions = [
  { label: "SINGLE CHOICE", value: "SINGLE_CHOICE" },
  { label: "MULTIPLE CHOICE", value: "MULTIPLE_CHOICE" },
  { label: "FILL IN BLANK", value: "FILL_IN_BLANK" },
];

// Validation rules
const questionRules = {
  content: {
    required: true,
    message: "Vui lòng nhập nội dung câu hỏi",
    trigger: "blur",
  },
  type: {
    required: true,
    message: "Vui lòng chọn loại câu hỏi",
    trigger: "change",
  },
};

const addAnswer = () => {
  newQuestion.answers.push({ content: "", isCorrect: false });
};

const removeAnswer = (index: number) => {
  if (newQuestion.answers.length > 1) {
    newQuestion.answers.splice(index, 1);
  } else {
    message.warning("Cần ít nhất 1 câu trả lời");
  }
};

const addQuestionToList = () => {
  // Validate
  if (!newQuestion.content.trim()) {
    message.error("Vui lòng nhập nội dung câu hỏi");
    return;
  }

  if (!newQuestion.type) {
    message.error("Vui lòng chọn loại câu hỏi");
    return;
  }

  // Validate answers
  const validAnswers = newQuestion.answers.filter((ans) => ans.content.trim());
  if (validAnswers.length < 1) {
    message.error("Cần ít nhất 1 câu trả lời");
    return;
  }

  const hasCorrectAnswer = newQuestion.answers.some((ans) => ans.isCorrect);
  if (!hasCorrectAnswer) {
    message.error("Cần ít nhất 1 câu trả lời đúng");
    return;
  }

  addingQuestion.value = true;

  // Add to list
  questionsList.value.push({
    content: newQuestion.content.trim(),
    type: newQuestion.type,
    answers: newQuestion.answers
      .filter((ans) => ans.content.trim())
      .map((ans) => ({
        content: ans.content.trim(),
        isCorrect: ans.isCorrect,
      })),
  });

  // Reset form
  newQuestion.content = "";
  newQuestion.type = "";
  newQuestion.answers = [
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ];

  addingQuestion.value = false;
  message.success("Đã thêm câu hỏi vào danh sách");
};

const removeQuestion = (index: number) => {
  questionsList.value.splice(index, 1);
  message.info("Đã xóa câu hỏi");
};

const submitQuestions = async () => {
  if (questionsList.value.length === 0) {
    message.error("Vui lòng thêm ít nhất 1 câu hỏi");
    return;
  }

  submitting.value = true;
  messageText.value = "";

  try {
    const result = await createQuestions(questionsList.value);

    if (result.error) {
      messageText.value = result.error;
      messageType.value = "error";
      message.error("Tạo câu hỏi thất bại: " + result.error);
    } else if (result.data) {
      messageText.value = "Tạo ngân hàng câu hỏi thành công!";
      messageType.value = "success";
      message.success(
        "Đã tạo thành công " + result.data.data.length + " câu hỏi"
      );

      // Reset form
      questionsList.value = [];
    }
  } catch (error) {
    messageText.value = "Có lỗi xảy ra khi tạo câu hỏi";
    messageType.value = "error";
    message.error("Lỗi hệ thống: " + error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.n-form-item {
  margin-bottom: 1rem;
}
</style>
