<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header (with Summary Card) -->
      <div
        class="bg-white rounded-lg shadow-md py-6 mt-24 mb-6 sticky top-24 z-40 bg-opacity-95 backdrop-blur-sm"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
        >
          <div class="flex items-center space-x-12 mx-12">
            <n-button @click="goBack" circle>
              <template #icon>
                <n-icon><ArrowBack /></n-icon>
              </template>
            </n-button>
            <div>
              <h1 class="text-3xl font-bold text-primary mb-1">
                Kết Quả Bài Test
              </h1>
              <p class="text-gray-600">Chi tiết kết quả sau khi nộp bài</p>
            </div>
          </div>

          <!-- Summary Card moved into header -->
          <div class="bg-white mr-12">
            <div class="flex items-center space-x-6">
              <div class="text-center">
                <p class="text-sm text-gray-500">Điểm</p>
                <p class="text-4xl font-bold text-primary">
                  {{ result?.score ?? "N/A" }}
                </p>
              </div>
              <div class="text-left">
                <p class="text-sm text-gray-500">
                  Bắt đầu: {{ formatDate(result?.startAt) }}
                </p>
                <p class="text-sm text-gray-500">
                  Nộp: {{ formatDate(result?.submitAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <n-spin :show="!resultLoaded">
        <div
          v-if="!result"
          class="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <n-empty description="Không tìm thấy kết quả" />
        </div>

        <div v-else class="space-y-8">
          <!-- Summary Card moved into header; removed standalone card -->

          <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
            <!-- Meta -->
            <div class="bg-white rounded-lg shadow-md p-6 md:col-span-3">
              <h3 class="text-lg font-semibold mb-3">Chi tiết câu trả lời</h3>
              <div v-if="!hasAnswers" class="text-sm text-gray-600">
                Không có dữ liệu câu trả lời.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="qa in result.questionWithStudentAnswers"
                  :key="qa.question.id"
                  class="p-3 border rounded-lg"
                >
                  <p class="text-sm font-medium mb-2">
                    {{ qa.question.content }}
                  </p>

                  <!-- render options according to question type -->
                  <div class="space-y-2">
                    <!-- SINGLE_CHOICE -->
                    <template
                      v-if="qa.question && qa.question.type === 'SINGLE_CHOICE'"
                    >
                      <div
                        v-for="opt in qa.question.listAnswers"
                        :key="opt.id"
                        :class="[
                          'flex items-center justify-between p-2 bg-gray-50 rounded',
                          isOptionSelected(qa, opt)
                            ? isOptionCorrect(opt)
                              ? 'border-2 border-green-500'
                              : 'border-2 border-red-500'
                            : '',
                        ]"
                      >
                        <label class="flex items-center space-x-3 w-full">
                          <input
                            type="radio"
                            :checked="isOptionSelected(qa, opt)"
                            disabled
                            class="form-radio h-4 w-4 text-primary"
                          />
                          <span class="text-sm text-gray-700">{{
                            opt.content
                          }}</span>
                          <div class="ml-auto">
                            <span v-if="isOptionSelected(qa, opt)">
                              <n-icon
                                class="text-green-600"
                                v-if="isOptionCorrect(opt)"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              </n-icon>
                              <n-icon class="text-red-600" v-else>
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                              </n-icon>
                            </span>
                          </div>
                        </label>
                      </div>
                    </template>

                    <!-- MULTIPLE_CHOICE -->
                    <template
                      v-else-if="
                        qa.question && qa.question.type === 'MULTIPLE_CHOICE'
                      "
                    >
                      <div
                        v-for="opt in qa.question.listAnswers"
                        :key="opt.id"
                        :class="[
                          'flex items-center justify-between p-2 bg-gray-50 rounded',
                          isOptionSelected(qa, opt)
                            ? isOptionCorrect(opt)
                              ? 'border-2 border-green-500'
                              : 'border-2 border-red-500'
                            : '',
                        ]"
                      >
                        <label class="flex items-center space-x-3 w-full">
                          <input
                            type="checkbox"
                            :checked="isOptionSelected(qa, opt)"
                            disabled
                            class="form-checkbox h-4 w-4 text-primary"
                          />
                          <span class="text-sm text-gray-700">{{
                            opt.content
                          }}</span>
                          <div class="ml-auto">
                            <span v-if="isOptionSelected(qa, opt)">
                              <n-icon
                                class="text-green-600"
                                v-if="isOptionCorrect(opt)"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              </n-icon>
                              <n-icon class="text-red-600" v-else>
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                              </n-icon>
                            </span>
                          </div>
                        </label>
                      </div>
                    </template>

                    <!-- FILL_IN_BLANK -->
                    <template
                      v-else-if="
                        qa.question && qa.question.type === 'FILL_IN_BLANK'
                      "
                    >
                      <div
                        v-if="
                          qa.question.listAnswers &&
                          qa.question.listAnswers.length
                        "
                        class="space-y-2"
                      >
                        <div
                          v-for="opt in qa.question.listAnswers"
                          :key="opt.id"
                          class="p-2 bg-gray-50 rounded flex items-center justify-between"
                        >
                          <div class="mx-3">
                            <n-tag v-if="isOptionCorrect(opt)" type="success"
                              >Đáp án đúng</n-tag
                            >
                          </div>
                          <div class="w-full">
                            <input
                              type="text"
                              :value="opt.content"
                              disabled
                              class="w-full border rounded px-2 py-1 bg-white text-sm text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        class="mt-2"
                        v-if="qa.studentAnswers && qa.studentAnswers.length"
                      >
                        <div
                          v-for="sa in qa.studentAnswers"
                          :key="sa.id || sa.answerText"
                          :class="[
                            'flex items-center justify-between p-2 bg-white rounded',
                            sa.isCorrect !== undefined
                              ? sa.isCorrect
                                ? 'border-2 border-green-500'
                                : 'border-2 border-red-500'
                              : 'border',
                          ]"
                        >
                          <input
                            type="text"
                            :value="sa.answerText || sa.content"
                            disabled
                            class="w-full border rounded px-2 py-1 bg-white text-sm text-gray-700"
                          />
                          <div class="ml-3">
                            <span v-if="sa.isCorrect !== undefined">
                              <n-icon
                                class="text-green-600"
                                v-if="sa.isCorrect"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              </n-icon>
                              <n-icon class="text-red-600" v-else>
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                              </n-icon>
                            </span>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- fallback -->
                    <template v-else>
                      <div
                        v-if="
                          qa.question &&
                          qa.question.listAnswers &&
                          qa.question.listAnswers.length
                        "
                        class="space-y-2"
                      >
                        <div
                          v-for="opt in qa.question.listAnswers"
                          :key="opt.id"
                          :class="[
                            'flex items-center justify-between p-2 bg-gray-50 rounded',
                            isOptionSelected(qa, opt)
                              ? isOptionCorrect(opt)
                                ? 'border-2 border-green-500'
                                : 'border-2 border-red-500'
                              : '',
                          ]"
                        >
                          <p class="text-sm text-gray-700">{{ opt.content }}</p>
                          <div class="ml-4">
                            <span v-if="isOptionSelected(qa, opt)">
                              <n-icon
                                class="text-green-600"
                                v-if="isOptionCorrect(opt)"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              </n-icon>
                              <n-icon class="text-red-600" v-else>
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="w-5 h-5"
                                >
                                  <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                              </n-icon>
                            </span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="flex justify-center space-x-4">
              <n-button @click="goTests" size="large"
                >Quay về danh sách bài Test</n-button
              >
              <n-button @click="goBack" size="large" type="primary"
                >Quay lại</n-button
              >
            </div>
          </div>
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { ArrowBack } from "@vicons/ionicons5";
import { testAttemptService } from "@/services/testAttempt.service";

const router = useRouter();
const route = useRoute();
const message = useMessage();

const result = ref<any | null>(null);
const resultLoaded = ref(false);

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const hasAnswers = computed(() => {
  return !!(
    result.value &&
    result.value.questionWithStudentAnswers &&
    result.value.questionWithStudentAnswers.length
  );
});

const normalizeToBool = (v: any) => {
  if (typeof v === "boolean") return v;
  if (v === undefined || v === null) return false;
  const s = String(v).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
};

const isOptionCorrect = (option: any) => {
  if (!option) return false;
  return normalizeToBool(option.isCorrect) || false;
};

const isOptionSelected = (qa: any, option: any) => {
  if (!qa || !qa.studentAnswers || !qa.studentAnswers.length) return false;
  const optId =
    option && option.id !== undefined ? String(option.id).trim() : undefined;
  const optContent =
    option && option.content
      ? String(option.content).trim().toLowerCase()
      : undefined;

  return qa.studentAnswers.some((sa: any) => {
    if (!sa) return false;
    // match by answerId (preferred)
    if (sa.answerId !== undefined && optId !== undefined) {
      if (String(sa.answerId).trim() === optId) return true;
    }
    // match by id
    if (sa.id !== undefined && optId !== undefined) {
      if (String(sa.id).trim() === optId) return true;
    }
    // match by text: answerText or content
    const saText = sa.answerText || sa.content || sa.content;
    if (saText && optContent) {
      if (String(saText).trim().toLowerCase() === optContent) return true;
    }
    return false;
  });
};

const goBack = () => router.back();
const goTests = () => router.push("/tests");

onMounted(async () => {
  const id = Number(route.params.id);
  if (isNaN(id)) {
    message.error("ID bài test không hợp lệ");
    resultLoaded.value = true;
    return;
  }

  try {
    const res = await testAttemptService.getTestResult(id);
    if (res && res.data) {
      result.value = res.data;
    } else {
      message.error("Không tải được kết quả từ server");
    }
  } catch (err: any) {
    console.error(err);
    message.error("Lỗi khi tải kết quả");
  } finally {
    resultLoaded.value = true;
  }
});
</script>
