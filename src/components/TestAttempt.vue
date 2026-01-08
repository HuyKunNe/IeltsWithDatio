<template>
  <div
    :class="[
      'min-h-screen bg-gray-100',
      uiStore.showHeader ? 'pt-24' : 'pt-0',
    ]"
  >
    <!-- Pre-test Check -->
    <div v-if="!testAttempt && !loading" class="max-w-2xl mx-auto py-8 px-4">
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="space-y-4 mb-6">
          <div
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-gray-700">Thời gian làm bài:</span>
            <span class="font-semibold">{{ test.timeLimit }} phút</span>
          </div>
          <div
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-gray-700">Số lần làm còn lại:</span>
            <span
              class="font-semibold"
              :class="
                remainingAttempts === 0 ? 'text-red-600' : 'text-green-600'
              "
            >
              {{ remainingAttempts }} / {{ test.maxAttempts }}
            </span>
          </div>

          <div
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-gray-700">Số câu hỏi:</span>
            <span class="font-semibold"
              >{{ test.testQuestionResponses.length }} câu</span
            >
          </div>
        </div>

        <n-alert v-if="remainingAttempts === 0" type="error" class="mb-4">
          Bạn đã sử dụng hết số lần làm bài cho test này.
        </n-alert>

        <n-button
          @click="startTest"
          type="primary"
          size="large"
          :disabled="remainingAttempts === 0 || startingTest"
          :loading="startingTest"
        >
          Bắt Đầu Làm Bài
        </n-button>
      </div>
    </div>

    <div v-else-if="testAttempt" class="h-screen flex flex-col">
      <!-- Header với timer và pagination -->
      <div class="bg-white shadow-md py-4 px-6">
        <h1 class="text-xl font-bold text-primary text-center">
          {{ test.title }}
        </h1>
        <div
          class="text-4xl font-mono font-bold flex justify-center"
          :class="timeLeftClass"
        >
          {{ formatTime(timeLeft) }}
        </div>
        <div class="flex justify-end space-x-4 w-11/12">
          <n-button @click="confirmSubmit" size="medium"> Nộp Bài </n-button>
        </div>

        <!-- Pagination và Question Navigation -->
        <div class="flex items-center justify-between">
          <!-- Pagination Info -->
          <div class="text-sm text-gray-600">
            Trang {{ currentPage }} / {{ totalPages }} (Câu
            {{ startQuestion + 1 }} - {{ endQuestion }} của
            {{ test.testQuestionResponses.length }})
          </div>

          <!-- Pagination Controls -->
          <div class="flex items-center space-x-2">
            <n-button
              size="small"
              @click="prevPage"
              :disabled="currentPage === 1"
              :loading="submitting"
            >
              ← Trước
            </n-button>

            <div class="flex space-x-1">
              <div
                v-for="page in visiblePages"
                :key="page"
                class="w-8 h-8 rounded flex items-center justify-center text-sm border cursor-pointer"
                :class="getPageClass(page)"
                @click="goToPage(page)"
              >
                {{ page }}
              </div>
              <span v-if="showEllipsis" class="px-2">...</span>
            </div>

            <n-button
              size="small"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :loading="submitting"
            >
              Sau →
            </n-button>
          </div>

          <!-- Answered Counter -->
          <div class="text-sm text-gray-600">
            Đã trả lời: {{ answeredQuestions }}/{{
              test.testQuestionResponses.length
            }}
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left Sidebar - Resources -->
        <div
          class="w-1/2 bg-white border-r p-4 overflow-y-auto"
          v-if="hasResources"
        >
          <div class="space-y-4">
            <!-- Resource Items -->
            <div
              v-for="resource in test.testResourceResponses"
              :key="resource.id"
              class="border rounded-lg p-4"
            >
              <!-- IMAGE Resource -->
              <div
                v-if="resource.resourceType === 'IMAGE'"
                class="resource-content"
              >
                <div class="relative">
                  <img
                    :src="resource.url"
                    :alt="resource.description || 'Hình ảnh'"
                    class="w-full h-auto rounded-lg object-contain mx-auto border"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <div
                    v-if="!resource.url"
                    class="text-center py-8 text-gray-400"
                  >
                    <n-icon size="48" class="mb-2">
                      <ImageOutline />
                    </n-icon>
                    <p>Không có hình ảnh</p>
                  </div>
                </div>
              </div>

              <!-- AUDIO Resource -->
              <div
                v-else-if="resource.resourceType === 'AUDIO'"
                class="resource-content"
              >
                <div class="bg-gray-50 rounded-lg p-3">
                  <audio
                    controls
                    class="w-full"
                    :class="{ 'opacity-50': !resource.url }"
                  >
                    <source
                      v-if="resource.url"
                      :src="resource.url"
                      type="audio/mpeg"
                    />
                    Trình duyệt của bạn không hỗ trợ audio element.
                  </audio>
                  <div
                    v-if="!resource.url"
                    class="text-center py-4 text-gray-400"
                  >
                    <n-icon size="32" class="mb-2">
                      <MusicalNotesOutline />
                    </n-icon>
                    <p class="text-sm">Không có audio</p>
                  </div>
                </div>
              </div>

              <!-- TEXT Resource (không có type hoặc type khác) -->
              <div v-else class="resource-content">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div
                    v-if="resource.content"
                    class="prose prose-sm max-w-none"
                  >
                    <p class="text-gray-700 whitespace-pre-wrap">
                      {{ resource.content }}
                    </p>
                  </div>
                  <div v-else class="text-center py-4 text-gray-400">
                    <n-icon size="32" class="mb-2">
                      <DocumentTextOutline />
                    </n-icon>
                    <p class="text-sm">Không có nội dung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Questions -->
        <div class="flex-1 p-6 overflow-y-auto">
          <div class="max-w-4xl mx-auto">
            <!-- Questions for Current Page -->
            <div
              v-for="(question, index) in paginatedQuestions"
              :key="question.id"
              class="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-800">
                  Câu {{ getGlobalQuestionIndex(index) + 1 }}/{{
                    test.testQuestionResponses.length
                  }}
                  <span class="text-sm text-gray-500 ml-2"
                    >({{ question.points }} điểm)</span
                  >
                </h3>
                <n-tag
                  :type="getQuestionTypeColor(question.questionResponse.type)"
                  size="small"
                >
                  {{ getQuestionTypeLabel(question.questionResponse.type) }}
                </n-tag>
              </div>

              <p class="text-gray-700 mb-6 text-lg">
                {{ question.questionResponse.content }}
              </p>

              <!-- Answers -->
              <div class="space-y-3">
                <!-- Multiple Choice / Single Choice -->
                <div
                  v-if="
                    ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(
                      question.questionResponse.type
                    )
                  "
                  class="space-y-2"
                >
                  <div
                    v-for="answer in question.questionResponse.listAnswers"
                    :key="answer.id"
                    class="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    :class="getAnswerClass(question.id, answer.id)"
                    @click="toggleAnswer(question.id, answer.id)"
                  >
                    <div class="flex items-center h-6">
                      <input
                        :type="
                          question.questionResponse.type === 'SINGLE_CHOICE'
                            ? 'radio'
                            : 'checkbox'
                        "
                        :checked="isAnswerSelected(question.id, answer.id)"
                        class="w-4 h-4"
                        @click.stop
                      />
                    </div>
                    <span class="flex-1">{{ answer.content }}</span>
                  </div>
                </div>

                <!-- Fill in blank -->
                <div
                  v-else-if="question.questionResponse.type === 'FILL_IN_BLANK'"
                >
                  <n-input
                    v-model:value="studentAnswers[question.id]"
                    type="textarea"
                    placeholder="Nhập câu trả lời của bạn..."
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    @update:value="onAnswerChange(question.id)"
                  />
                </div>

                <!-- True/False -->
                <div
                  v-else-if="question.questionResponse.type === 'TRUE_FALSE'"
                  class="flex space-x-4"
                >
                  <n-button
                    @click="toggleAnswer(question.id, true)"
                    :type="
                      isTrueFalseSelected(question.id, true)
                        ? 'primary'
                        : 'default'
                    "
                    size="large"
                  >
                    Đúng
                  </n-button>
                  <n-button
                    @click="toggleAnswer(question.id, false)"
                    :type="
                      isTrueFalseSelected(question.id, false)
                        ? 'primary'
                        : 'default'
                    "
                    size="large"
                  >
                    Sai
                  </n-button>
                </div>
              </div>
            </div>

            <!-- Page Navigation -->
            <div class="flex justify-between items-center mt-8">
              <n-button
                @click="prevPage"
                :disabled="currentPage === 1"
                :loading="submitting"
                size="large"
              >
                ← Trang Trước
              </n-button>

              <div class="text-sm text-gray-600">
                Trang {{ currentPage }} / {{ totalPages }}
              </div>

              <n-button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :loading="submitting"
                size="large"
              >
                Trang Sau →
              </n-button>
            </div>

            <!-- Quick Page Jump -->
            <div class="flex justify-center items-center space-x-2 mt-4">
              <span class="text-sm text-gray-600">Đến trang:</span>
              <n-input-number
                v-model:value="pageInput"
                :min="1"
                :max="totalPages"
                :step="1"
                size="small"
                class="w-20"
                @update:value="goToPage(pageInput)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Loading -->
    <div v-else class="flex items-center justify-center h-64">
      <n-spin size="large" />
    </div>

    <!-- Submit Modal -->
    <n-modal
      v-model:show="showSubmitModal"
      preset="dialog"
      title="Xác nhận nộp bài"
    >
      <template #header>
        <div class="text-center">
          <h3 class="text-lg font-semibold">Xác nhận nộp bài</h3>
        </div>
      </template>

      <div class="text-center py-4">
        <p class="text-gray-600 mb-4">
          Bạn có chắc chắn muốn nộp bài ngay bây giờ?
        </p>
        <p class="text-sm text-gray-500">
          Số câu đã trả lời: {{ answeredQuestions }}/{{
            test.testQuestionResponses.length
          }}
        </p>
      </div>

      <template #action>
        <div class="flex space-x-3">
          <n-button @click="showSubmitModal = false" :disabled="submitting"
            >Hủy</n-button
          >
          <n-button @click="submitTest" type="primary" :loading="submitting"
            >Xác nhận nộp bài</n-button
          >
        </div>
      </template>
    </n-modal>

    <!-- Time's Up Modal -->
    <n-modal v-model:show="showTimeUpModal" preset="dialog" :closable="false">
      <template #header>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-red-600">Hết thời gian!</h3>
        </div>
      </template>

      <div class="text-center py-4">
        <p class="text-gray-600 mb-4">
          Thời gian làm bài đã kết thúc. Bài làm của bạn sẽ được tự động nộp.
        </p>
      </div>

      <template #action>
        <n-button @click="submitTest" type="primary" :loading="submitting">
          {{ submitting ? "Đang nộp bài..." : "OK" }}
        </n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { useTest } from "@/composables/useTest";
import { useTestAttempt } from "@/composables/useTestAttempt";
import type { TestDetail } from "@/services/test.service";
import type {
  StudentAnswerRequest,
  TestAttemptResponse,
} from "@/services/testAttempt.service";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import { useMessage } from "naive-ui";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ImageOutline,
  MusicalNotesOutline,
  DocumentTextOutline,
} from "@vicons/ionicons5";
const route = useRoute();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const uiStore = useUiStore();
const { getTestById } = useTest();
const { createTestAttempt, submitTestAttempt, getStudentAttempts } =
  useTestAttempt();

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

const testAttempt = ref<TestAttemptResponse | null>(null);
const loading = ref(false);
const startingTest = ref(false);
const submitting = ref(false);
const showSubmitModal = ref(false);
const showTimeUpModal = ref(false);
const noOfAttempt = ref(0);
const currentPage = ref(1);
const questionsPerPage = 10;
const pageInput = ref(1);
const studentAnswers = reactive<Record<number, any>>({});
const timeLeft = ref(0);
const timerInterval = ref<NodeJS.Timeout | null>(null);

// Computed properties cho pagination
const totalPages = computed(() => {
  return Math.ceil(test.value.testQuestionResponses.length / questionsPerPage);
});

const startQuestion = computed(() => {
  return (currentPage.value - 1) * questionsPerPage;
});

const endQuestion = computed(() => {
  return Math.min(
    startQuestion.value + questionsPerPage,
    test.value.testQuestionResponses.length
  );
});

const paginatedQuestions = computed(() => {
  return test.value.testQuestionResponses.slice(
    startQuestion.value,
    endQuestion.value
  );
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const isAnswerSelected = (questionId: number, answerId: number) => {
  return (
    studentAnswers[questionId]?.includes?.(answerId) ||
    studentAnswers[questionId] === answerId
  );
};

const toggleAnswer = (questionId: number, answerId: number | boolean) => {
  const question = test.value.testQuestionResponses.find(
    (q) => q.id === questionId
  );
  if (!question) return;

  if (
    ["SINGLE_CHOICE", "TRUE_FALSE"].includes(question.questionResponse.type)
  ) {
    studentAnswers[questionId] = answerId;
  } else if (question.questionResponse.type === "MULTIPLE_CHOICE") {
    if (!studentAnswers[questionId]) {
      studentAnswers[questionId] = [];
    }
    const index = studentAnswers[questionId].indexOf(answerId);
    if (index === -1) {
      studentAnswers[questionId].push(answerId);
    } else {
      studentAnswers[questionId].splice(index, 1);
    }
  }
};

const isTrueFalseSelected = (questionId: number, value: boolean) => {
  return studentAnswers[questionId] === value;
};

const getAnswerClass = (questionId: number, answerId: number) => {
  return isAnswerSelected(questionId, answerId)
    ? "border-blue-500 bg-blue-50"
    : "border-gray-200";
};

const onAnswerChange = (questionId: number) => {
  // Mark question as answered when input changes
  if (studentAnswers[questionId] && !studentAnswers[questionId].answered) {
    studentAnswers[questionId].answered = true;
  }
};

// Watch current page để reset scroll position
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Auto-save progress khi chuyển trang
watch(currentPage, (newPage, oldPage) => {
  if (oldPage !== newPage) {
    saveProgress();
  }
});

const saveProgress = () => {
  // Có thể implement auto-save progress ở đây
  console.log("Auto-saving progress...");
};

const showEllipsis = computed(() => {
  return (
    totalPages.value > visiblePages.value.length &&
    visiblePages.value[visiblePages.value.length - 1] < totalPages.value
  );
});

// Methods mới cho pagination
const getGlobalQuestionIndex = (localIndex: number) => {
  return startQuestion.value + localIndex;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    pageInput.value = page;
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const getPageClass = (page: number) => {
  return page === currentPage.value
    ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400";
};

const hasResources = computed(() => {
  return test.value.testResourceResponses.length > 0;
});

const fetchRemainingAttempts = async () => {
  if (!authStore.user) return 0;
  const fetchData = await getStudentAttempts(
    authStore.user.accountId,
    test.value.id
  );
  // normalize API response to a numeric count
  const resp = fetchData?.data?.data;
  let attempts = 0;
  if (typeof resp === "number") attempts = resp;
  else if (Array.isArray(resp)) attempts = resp.length;
  else if (resp && typeof resp === "object") {
    if (typeof (resp as any).count === "number") attempts = (resp as any).count;
    else if (typeof (resp as any).total === "number")
      attempts = (resp as any).total;
    else if (typeof (resp as any).length === "number")
      attempts = (resp as any).length;
  }
  noOfAttempt.value = attempts;
};

const remainingAttempts = computed(() => {
  const max = Number(test.value.maxAttempts) || 0;
  const used = Number(noOfAttempt.value) || 0;
  const rem = max - used;
  return rem >= 0 ? rem : 0;
});

const answeredQuestions = computed(() => {
  return Object.keys(studentAnswers).length;
});

const timeLeftClass = computed(() => {
  if (timeLeft.value > 300) return "text-green-600";
  if (timeLeft.value > 60) return "text-yellow-600";
  return "text-red-600";
});

// Methods
const fetchTest = async () => {
  loading.value = true;
  const testId = Number(route.params.id);

  try {
    const result = await getTestById(testId);
    if (result.data) {
      test.value = result.data.data;
      fetchRemainingAttempts();
    }
  } catch (error) {
    message.error("Lỗi khi tải bài test");
    router.push("/tests");
  } finally {
    loading.value = false;
  }
};

const startTest = async () => {
  startingTest.value = true;

  try {
    const result = await createTestAttempt({
      studentId: authStore.user?.accountId || 0,
      testId: test.value.id,
    });

    if (result.data) {
      testAttempt.value = result.data.data;
      uiStore.setShowHeader(false);
      startTimer();
      message.success("Bắt đầu làm bài!");
    }
  } catch (error) {
    message.error("Lỗi khi bắt đầu làm bài");
  } finally {
    startingTest.value = false;
  }
};

const startTimer = () => {
  timeLeft.value = test.value.timeLimit * 60; // Convert to seconds
  timerInterval.value = setInterval(() => {
    timeLeft.value--;

    if (timeLeft.value <= 0) {
      clearInterval(timerInterval.value!);
      showTimeUpModal.value = true;
      submitTest();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const getQuestionTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    SINGLE_CHOICE: "Trắc nghiệm đơn",
    MULTIPLE_CHOICE: "Trắc nghiệm nhiều",
    FILL_IN_BLANK: "Điền vào chỗ trống",
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

const confirmSubmit = () => {
  showSubmitModal.value = true;
};

const submitTest = async () => {
  submitting.value = true;

  try {
    const answers: StudentAnswerRequest[] = [];

    // Prepare answers
    Object.entries(studentAnswers).forEach(([questionId, answer]) => {
      const testQuestionId = parseInt(questionId);

      if (Array.isArray(answer)) {
        // Multiple choice
        answer.forEach((answerId) => {
          answers.push({
            testQuestionId,
            answerId,
            answerText: "",
          });
        });
      } else if (typeof answer === "boolean") {
        // True/False - convert to answerId
        answers.push({
          testQuestionId,
          answerId: answer ? 1 : 2, // Assuming 1=true, 2=false
          answerText: "",
        });
      } else if (typeof answer === "string") {
        // Fill in blank
        answers.push({
          testQuestionId,
          answerId: 0,
          answerText: answer,
        });
      } else {
        // Single choice
        answers.push({
          testQuestionId,
          answerId: answer,
          answerText: "",
        });
      }
    });

    const result = await submitTestAttempt({
      testAttemptId: testAttempt.value!.id,
      listStudentAnswers: answers,
    });

    if (result.data) {
      message.success("Nộp bài thành công!");
      router.push(`/test-result/${testAttempt.value!.id}`);
    }
  } catch (error) {
    message.error("Lỗi khi nộp bài");
  } finally {
    submitting.value = false;
    stopTimer();
    uiStore.setShowHeader(true);
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
  // Hiển thị fallback content nếu có
  const resourceItem = img.closest(".resource-content");
  if (resourceItem) {
    const fallback = resourceItem.querySelector(".image-fallback");
    if (fallback) {
      fallback.classList.remove("hidden");
    }
  }
};

// Lifecycle
onMounted(() => {
  fetchTest();
});

onUnmounted(() => {
  stopTimer();
  uiStore.setShowHeader(true);
});

// Watch for navigation away
window.addEventListener("beforeunload", (e) => {
  if (testAttempt.value && !submitting.value) {
    e.preventDefault();
    e.returnValue = "Bài test đang được thực hiện. Bạn có chắc muốn rời đi?";
  }
});
</script>

<style scoped>
.audio-player {
  width: 100%;
  margin: 10px 0;
}

.question-navigation {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0;
}

.question-bubble {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.question-bubble:hover {
  transform: scale(1.1);
}

.question-bubble.current {
  border: 2px solid #3b82f6;
  background-color: #dbeafe;
}

.question-bubble.answered {
  background-color: #dcfce7;
  border-color: #22c55e;
}

.question-bubble.unanswered {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}
.question-navigation {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0;
}

.question-bubble {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.question-bubble:hover {
  transform: scale(1.1);
}

.question-bubble.current {
  border: 2px solid #3b82f6;
  background-color: #dbeafe;
}

.question-bubble.answered {
  background-color: #dcfce7;
  border-color: #22c55e;
}

.question-bubble.unanswered {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.page-number {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-number:hover {
  transform: scale(1.05);
}

.page-number.active {
  border: 2px solid #3b82f6;
  background-color: #dbeafe;
  color: #3b82f6;
}
</style>
