<template>
  <div class="min-h-screen bg-gray-50 pt-32">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-primary mb-2">Tạo Bài Test Mới</h1>
        <p class="text-gray-600">
          Tạo bài test IELTS với các câu hỏi từ ngân hàng câu hỏi
        </p>
      </div>

      <!-- Form tạo test -->
      <n-form
        :model="testForm"
        :rules="testRules"
        ref="testFormRef"
        class="space-y-4"
      >
        <!-- Thông tin cơ bản -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Thông tin cơ bản
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
            <!-- Title -->
            <n-form-item
              label="Tiêu đề bài test"
              path="title"
              class="md:col-span-2"
            >
              <n-input
                v-model:value="testForm.title"
                placeholder="Nhập tiêu đề bài test..."
                :maxlength="200"
              />
            </n-form-item>

            <!-- Description -->
            <n-form-item label="Mô tả" path="description" class="md:col-span-2">
              <n-input
                v-model:value="testForm.description"
                type="textarea"
                placeholder="Nhập mô tả bài test..."
                :autosize="{ minRows: 3, maxRows: 6 }"
                :maxlength="1000"
              />
            </n-form-item>

            <!-- Type -->
            <n-form-item label="Loại bài test" path="type">
              <n-select
                v-model:value="testForm.type"
                :options="testTypeOptions"
                placeholder="Chọn loại bài test"
              />
            </n-form-item>

            <!-- Time Limit -->
            <n-form-item label="Thời gian làm bài (phút)" path="timeLimit">
              <n-input-number
                v-model:value="testForm.timeLimit"
                :min="1"
                :max="300"
                :step="1"
                placeholder="Nhập thời gian"
                class="w-full"
              />
            </n-form-item>

            <!-- Max Attempts -->
            <n-form-item label="Số lần làm tối đa" path="maxAttempts">
              <n-input-number
                v-model:value="testForm.maxAttempts"
                :min="1"
                :max="10"
                :step="1"
                placeholder="Nhập số lần làm"
                class="w-full"
              />
            </n-form-item>
          </div>
        </div>

        <!-- Câu hỏi -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Câu hỏi</h2>
            <n-button
              @click="showQuestionSelector = true"
              type="primary"
              size="small"
            >
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              Thêm câu hỏi
            </n-button>
          </div>

          <!-- Selected Questions -->
          <div v-if="testForm.testQuestions.length > 0" class="space-y-3">
            <div
              v-for="(question, index) in testForm.testQuestions"
              :key="question.questionId"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-medium text-gray-800">Câu {{ index + 1 }}</h3>
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

              <p class="text-gray-700 mb-2">
                {{ getQuestionContent(question.questionId) }}
              </p>

              <n-form-item
                :label="`Điểm cho câu ${index + 1}`"
                :path="`testQuestions[${index}].points`"
              >
                <n-input-number
                  v-model:value="question.points"
                  :min="0.1"
                  :max="10"
                  :step="0.1"
                  placeholder="Nhập điểm"
                  class="w-32"
                />
              </n-form-item>
            </div>
          </div>

          <!-- Empty state -->
          <n-empty v-else description="Chưa có câu hỏi nào" class="py-8">
            <template #extra>
              <p class="text-gray-500">
                Nhấn "Thêm câu hỏi" để thêm câu hỏi vào bài test
              </p>
            </template>
          </n-empty>
        </div>

        <!-- Tài nguyên (Optional) -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">
              Tài nguyên (Tùy chọn)
            </h2>
            <n-button @click="addResource" type="primary" size="small">
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              Thêm tài nguyên
            </n-button>
          </div>

          <!-- Resources -->
          <div v-if="testForm.testResources.length > 0" class="space-y-4">
            <div
              v-for="(resource, index) in testForm.testResources"
              :key="index"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-medium text-gray-800">
                  Tài nguyên {{ index + 1 }}
                </h3>
                <n-button
                  @click="removeResource(index)"
                  type="error"
                  size="small"
                  circle
                >
                  <template #icon>
                    <n-icon><Close /></n-icon>
                  </template>
                </n-button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Resource Type -->
                <n-form-item
                  label="Loại tài nguyên"
                  :path="`testResources[${index}].resourceType`"
                >
                  <n-select
                    v-model:value="resource.resourceType"
                    :options="resourceTypeOptions"
                    placeholder="Chọn loại tài nguyên"
                  />
                </n-form-item>

                <!-- Display Order -->
                <n-form-item
                  label="Thứ tự hiển thị"
                  :path="`testResources[${index}].displayOrder`"
                >
                  <n-input-number
                    v-model:value="resource.displayOrder"
                    :min="0"
                    :max="100"
                    :step="1"
                    placeholder="Thứ tự"
                    class="w-full"
                  />
                </n-form-item>

                <!-- URL -->
                <n-form-item
                  label="URL"
                  :path="`testResources[${index}].url`"
                  class="md:col-span-2"
                >
                  <n-input
                    v-model:value="resource.url"
                    placeholder="Nhập URL tài nguyên..."
                    :maxlength="500"
                  />
                </n-form-item>

                <!-- Content -->
                <n-form-item
                  label="Nội dung"
                  :path="`testResources[${index}].content`"
                  class="md:col-span-2"
                >
                  <n-input
                    v-model:value="resource.content"
                    type="textarea"
                    placeholder="Nhập nội dung..."
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    :maxlength="1000"
                  />
                </n-form-item>

                <!-- Description -->
                <n-form-item
                  label="Mô tả"
                  :path="`testResources[${index}].description`"
                  class="md:col-span-2"
                >
                  <n-input
                    v-model:value="resource.description"
                    type="textarea"
                    placeholder="Nhập mô tả..."
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    :maxlength="500"
                  />
                </n-form-item>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <n-empty v-else description="Chưa có tài nguyên nào" class="py-8">
            <template #extra>
              <p class="text-gray-500">
                Tài nguyên là tùy chọn, có thể thêm hình ảnh hoặc audio
              </p>
            </template>
          </n-empty>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-end space-x-4">
            <n-button @click="goBack" size="large">Hủy</n-button>
            <n-button
              @click="submitTest"
              type="primary"
              size="large"
              :loading="submitting"
              :disabled="testForm.testQuestions.length === 0"
            >
              Tạo Bài Test
            </n-button>
          </div>
        </div>
      </n-form>
    </div>

    <!-- Question Selector Modal -->
    <n-modal
      v-model:show="showQuestionSelector"
      preset="card"
      title="Chọn câu hỏi"
      style="width: 90%; max-width: 800px"
    >
      <QuestionSelector
        :selected-questions="selectedQuestionIds"
        @select-question="addQuestionToTest"
        @create-new-question="openQuestionCreator"
        @refresh="refreshQuestions"
        @close="showQuestionSelector = false"
      />
    </n-modal>

    <!-- Question Creator Modal -->
    <n-modal
      v-model:show="showQuestionCreator"
      preset="card"
      title="Tạo câu hỏi mới"
      style="width: 90%; max-width: 800px"
    >
      <QuestionCreator
        @question-created="handleQuestionCreated"
        @close="showQuestionCreator = false"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage, type FormRules, type FormInst } from "naive-ui";
import { Add, Close } from "@vicons/ionicons5";
import { useTest } from "@/composables/useTest";
import { useQuestion } from "@/composables/useQuestion";
import type {
  CreateTestRequest,
  TestQuestionRequest,
  TestResourceRequest,
} from "@/services/test.service";
import type { QuestionResponse } from "@/services/question.service";
import QuestionSelector from "./QuestionSelector.vue";
import QuestionCreator from "./QuestionCreator.vue";

const router = useRouter();
const message = useMessage();
const { createTest } = useTest();
const { getAllActiveQuestions } = useQuestion();

const showQuestionCreator = ref(false);

const openQuestionCreator = () => {
  showQuestionSelector.value = false;
  showQuestionCreator.value = true;
};

const testFormRef = ref<FormInst | null>(null);
const showQuestionSelector = ref(false);
const submitting = ref(false);
const messageText = ref("");
const messageType = ref<"success" | "error" | "info" | "warning">("info");
const allQuestions = ref<QuestionResponse[]>([]);

// Test form data
const testForm = reactive<CreateTestRequest>({
  title: "",
  description: "",
  timeLimit: 30,
  type: "READING",
  maxAttempts: 1,
  testQuestions: [],
  testResources: [],
});

// Options
const testTypeOptions = [
  { label: "Reading", value: "READING" },
  { label: "Listening", value: "LISTENING" },
];

const resourceTypeOptions = [
  { label: "Audio", value: "AUDIO" },
  { label: "Image", value: "IMAGE" },
];

// Validation rules
const testRules: FormRules = {
  title: [
    { required: true, message: "Vui lòng nhập tiêu đề", trigger: "blur" },
    { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự", trigger: "blur" },
  ],
  description: [
    { required: false, message: "Vui lòng nhập mô tả", trigger: "blur" },
  ],
  timeLimit: [
    { required: true, message: "Vui lòng nhập thời gian", trigger: "blur" },
    {
      type: "number",
      min: 1,
      message: "Thời gian phải lớn hơn 0",
      trigger: "blur",
    },
  ],
  maxAttempts: [
    { required: true, message: "Vui lòng nhập số lần làm", trigger: "blur" },
    {
      type: "number",
      min: 1,
      message: "Số lần làm phải lớn hơn 0",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "Vui lòng chọn loại bài test",
      trigger: "change",
    },
  ],
};

// Computed
const selectedQuestionIds = computed(() =>
  testForm.testQuestions.map((q) => q.questionId)
);

// const totalPoints = computed(() =>
//   testForm.testQuestions.reduce((sum, q) => sum + q.points, 0)
// );

// Methods
const fetchQuestions = async () => {
  try {
    const result = await getAllActiveQuestions();
    if (result.data) {
      allQuestions.value = result.data.data;
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

const getQuestionContent = (questionId: number) => {
  const question = allQuestions.value.find((q) => q.id === questionId);
  return question?.content || "Câu hỏi không tồn tại";
};

const addQuestionToTest = (questionId: number) => {
  // Check if question already added
  if (testForm.testQuestions.some((q) => q.questionId === questionId)) {
    message.warning("Câu hỏi đã được thêm vào bài test");
    return;
  }

  const question: TestQuestionRequest = {
    questionId: questionId,
    points: 1.0, // Default points
  };

  testForm.testQuestions.push(question);
  message.success("Đã thêm câu hỏi vào bài test");
};

const removeQuestion = (index: number) => {
  testForm.testQuestions.splice(index, 1);
  message.info("Đã xóa câu hỏi khỏi bài test");
};

const addResource = () => {
  const resource: TestResourceRequest = {
    resourceType: "IMAGE",
    url: "",
    content: "",
    description: "",
    displayOrder: testForm.testResources.length,
  };
  testForm.testResources.push(resource);
};

const removeResource = (index: number) => {
  testForm.testResources.splice(index, 1);
};

const goBack = () => {
  router.go(-1);
};

const submitTest = async () => {
  try {
    await testFormRef.value?.validate();

    submitting.value = true;
    messageText.value = "";

    const result = await createTest(testForm);

    if (result.error) {
      messageText.value = result.error;
      messageType.value = "error";
      message.error("Tạo bài test thất bại: " + result.error);
    } else if (result.data) {
      messageText.value = "Tạo bài test thành công!";
      messageType.value = "success";
      message.success("Bài test đã được tạo thành công");

      // Redirect to test list or detail page
      setTimeout(() => {
        router.push("/tests");
      }, 1500);
    }
  } catch (error) {
    messageText.value = "Vui lòng kiểm tra lại thông tin";
    messageType.value = "error";
  } finally {
    submitting.value = false;
  }
};

const handleQuestionCreated = (newQuestion: any) => {
  // Thêm câu hỏi mới vào bài test
  addQuestionToTest(newQuestion.id);
  showQuestionCreator.value = false;
  showQuestionSelector.value = true;
  message.success("Câu hỏi mới đã được tạo và thêm vào bài test");
};

const refreshQuestions = () => {
  fetchQuestions();
};

// Lifecycle
onMounted(() => {
  fetchQuestions();
});
</script>

<style scoped>
.n-form-item {
  margin-bottom: 1rem;
}
</style>
