<template>
  <div class="min-h-screen bg-gray-50 pt-36 pb-20">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <n-button @click="goBack" circle>
            <template #icon>
              <n-icon><ArrowBack /></n-icon>
            </template>
          </n-button>
          <div>
            <h1 class="text-3xl font-bold text-primary mb-2">
              Chỉnh Sửa Câu Hỏi
            </h1>
            <p class="text-gray-600">
              Chỉnh sửa nội dung câu hỏi và câu trả lời
            </p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <n-spin :show="loading" class="mt-6">
        <!-- Form chỉnh sửa câu hỏi -->
        <div class="bg-white rounded-lg shadow-md p-6 mt-6" v-if="question">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Thông Tin Câu Hỏi
          </h2>

          <n-form
            :model="editQuestion"
            :rules="questionRules"
            ref="questionForm"
          >
            <!-- Nội dung câu hỏi -->
            <n-form-item label="Nội dung câu hỏi" path="content" class="mb-4">
              <n-input
                v-model:value="editQuestion.content"
                type="textarea"
                placeholder="Nhập nội dung câu hỏi..."
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
            </n-form-item>

            <!-- Loại câu hỏi -->
            <n-form-item label="Loại câu hỏi" path="type" class="mb-4">
              <n-select
                v-model:value="editQuestion.type"
                :options="questionTypeOptions"
                placeholder="Chọn loại câu hỏi"
              />
            </n-form-item>

            <!-- Câu trả lời -->
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-700 mb-3">
                Câu Trả Lời
              </h3>

              <div
                v-for="(answer, index) in editQuestion.answers"
                :key="index"
                class="flex items-center space-x-3 mb-3 p-3 bg-gray-50 rounded-lg"
              >
                <n-input
                  v-model:value="answer.content"
                  :placeholder="`Câu trả lời ${index + 1}`"
                  class="flex-1"
                />

                <n-checkbox v-model:checked="answer.isCorrect">
                  Đúng
                </n-checkbox>

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

            <!-- Nút cập nhật -->
            <n-button
              @click="updateQuestion"
              type="primary"
              :loading="updating"
              color="#7d4700"
              class="w-full"
            >
              Cập Nhật Câu Hỏi
            </n-button>
          </n-form>
        </div>

        <!-- Empty state -->
        <div v-else class="bg-white rounded-lg shadow-md p-6 mt-6 text-center">
          <n-empty description="Không tìm thấy câu hỏi">
            <template #extra>
              <n-button @click="goBack">Quay lại</n-button>
            </template>
          </n-empty>
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { Add, Trash, ArrowBack } from "@vicons/ionicons5";
import { useQuestion } from "@/composables/useQuestion";
import type {
  QuestionResponse,
  EditQuestionRequest,
} from "@/services/question.service";
import { useRouter, useRoute } from "vue-router";

const message = useMessage();
const { getAllActiveQuestions, editQuestion: editQuestionApi } = useQuestion();
const router = useRouter();
const route = useRoute();

// Data
const question = ref<QuestionResponse | null>(null);
const loading = ref(false);
const updating = ref(false);

// Form data
const editQuestion = reactive({
  content: "",
  type: "",
  answers: [] as Array<{ content: string; isCorrect: boolean }>,
});

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

const fetchQuestion = async () => {
  loading.value = true;
  const questionId = parseInt(route.params.id as string);

  try {
    const result = await getAllActiveQuestions();

    if (result.error) {
      message.error("Lỗi khi tải câu hỏi: " + result.error);
    } else if (result.data) {
      const foundQuestion = result.data.data.find((q) => q.id === questionId);
      if (foundQuestion) {
        question.value = foundQuestion;
        populateForm(foundQuestion);
      } else {
        message.error("Không tìm thấy câu hỏi");
      }
    }
  } catch (error) {
    message.error("Có lỗi xảy ra khi tải câu hỏi");
  } finally {
    loading.value = false;
  }
};

const populateForm = (q: QuestionResponse) => {
  editQuestion.content = q.content;
  editQuestion.type = q.type;
  editQuestion.answers = q.listAnswers.map((ans) => ({
    content: ans.content,
    isCorrect: ans.isCorrect === true,
  }));
};

const addAnswer = () => {
  editQuestion.answers.push({ content: "", isCorrect: false });
};

const removeAnswer = (index: number) => {
  if (editQuestion.answers.length > 1) {
    editQuestion.answers.splice(index, 1);
  } else {
    message.warning("Cần ít nhất 1 câu trả lời");
  }
};

const updateQuestion = async () => {
  if (!question.value) return;

  // Validate
  if (!editQuestion.content.trim()) {
    message.error("Vui lòng nhập nội dung câu hỏi");
    return;
  }

  if (!editQuestion.type) {
    message.error("Vui lòng chọn loại câu hỏi");
    return;
  }

  // Validate answers
  const validAnswers = editQuestion.answers.filter((ans) => ans.content.trim());
  if (validAnswers.length < 1) {
    message.error("Cần ít nhất 1 câu trả lời");
    return;
  }

  const hasCorrectAnswer = editQuestion.answers.some((ans) => ans.isCorrect);
  if (!hasCorrectAnswer) {
    message.error("Cần ít nhất 1 câu trả lời đúng");
    return;
  }

  updating.value = true;

  const updatedQuestion: EditQuestionRequest = {
    content: editQuestion.content.trim(),
    type: editQuestion.type,
    answers: editQuestion.answers
      .filter((ans) => ans.content.trim())
      .map((ans) => ({
        content: ans.content.trim(),
        isCorrect: ans.isCorrect,
      })),
  };

  try {
    const result = await editQuestionApi(question.value.id, updatedQuestion);

    if (result) {
      message.success("Cập nhật câu hỏi thành công");
      goBack();
    } else {
      message.error("Cập nhật câu hỏi thất bại");
    }
  } catch (error) {
    message.error("Có lỗi xảy ra khi cập nhật câu hỏi");
  } finally {
    updating.value = false;
  }
};

const goBack = () => {
  router.go(-1);
};

// Lifecycle
onMounted(() => {
  fetchQuestion();
});
</script>

<style scoped>
.n-form-item {
  margin-bottom: 1rem;
}
</style>
