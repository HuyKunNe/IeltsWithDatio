<template>
  <div class="question-creator-modal">
    <!-- Form tạo câu hỏi -->
    <n-form
      :model="questionForm"
      :rules="questionRules"
      ref="questionFormRef"
      class="space-y-4"
    >
      <!-- Nội dung câu hỏi -->
      <n-form-item label="Nội dung câu hỏi" path="content">
        <n-input
          v-model:value="questionForm.content"
          type="textarea"
          placeholder="Nhập nội dung câu hỏi..."
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </n-form-item>

      <!-- Loại câu hỏi -->
      <n-form-item label="Loại câu hỏi" path="type">
        <n-select
          v-model:value="questionForm.type"
          :options="questionTypeOptions"
          placeholder="Chọn loại câu hỏi"
        />
      </n-form-item>

      <!-- Câu trả lời -->
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-3">Câu trả lời</h4>

        <div
          v-for="(answer, index) in questionForm.answers"
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
            v-if="questionForm.answers.length > 2"
          >
            <template #icon>
              <n-icon><Close /></n-icon>
            </template>
          </n-button>
        </div>

        <n-button @click="addAnswer" type="primary" size="small">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
          Thêm câu trả lời
        </n-button>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <n-button @click="$emit('close')" :disabled="creating">Hủy</n-button>
        <n-button
          @click="createQuestion"
          type="primary"
          :loading="creating"
          :disabled="creating"
        >
          Tạo câu hỏi
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useMessage, type FormRules, type FormInst } from "naive-ui";
import { Add, Close } from "@vicons/ionicons5";
import { useQuestion } from "@/composables/useQuestion";

const emit = defineEmits(["question-created", "close"]);

const message = useMessage();
const { createQuestions } = useQuestion();

const questionFormRef = ref<FormInst | null>(null);
const creating = ref(false);

// Question form data
const questionForm = reactive({
  content: "",
  type: "SINGLE_CHOICE",
  answers: [
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ] as Array<{ content: string; isCorrect: boolean }>,
});

// Options
const questionTypeOptions = [
  { label: "SINGLE CHOICE", value: "SINGLE_CHOICE" },
  { label: "MULTIPLE CHOICE", value: "MULTIPLE_CHOICE" },
  { label: "FILL IN BLANK", value: "FILL_IN_BLANK" },
];

// Validation rules
const questionRules: FormRules = {
  content: [
    {
      required: true,
      message: "Vui lòng nhập nội dung câu hỏi",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "Vui lòng chọn loại câu hỏi",
      trigger: "change",
    },
  ],
};

// Methods
const addAnswer = () => {
  questionForm.answers.push({ content: "", isCorrect: false });
};

const removeAnswer = (index: number) => {
  if (questionForm.answers.length > 2) {
    questionForm.answers.splice(index, 1);
  } else {
    message.warning("Cần ít nhất 2 câu trả lời");
  }
};

const createQuestion = async () => {
  try {
    await questionFormRef.value?.validate();

    // Validate answers
    const validAnswers = questionForm.answers.filter((ans) =>
      ans.content.trim()
    );
    if (validAnswers.length < 2) {
      message.error("Cần ít nhất 2 câu trả lời");
      return;
    }

    const hasCorrectAnswer = questionForm.answers.some((ans) => ans.isCorrect);
    if (!hasCorrectAnswer) {
      message.error("Cần ít nhất 1 câu trả lời đúng");
      return;
    }

    creating.value = true;

    const questionData = [
      {
        content: questionForm.content.trim(),
        type: questionForm.type,
        answers: questionForm.answers
          .filter((ans) => ans.content.trim())
          .map((ans) => ({
            content: ans.content.trim(),
            isCorrect: ans.isCorrect,
          })),
      },
    ];

    const result = await createQuestions(questionData);

    if (result.error) {
      message.error("Tạo câu hỏi thất bại: " + result.error);
    } else if (result.data && result.data.data.length > 0) {
      const newQuestion = result.data.data[0];
      message.success("Câu hỏi đã được tạo thành công");
      emit("question-created", newQuestion);
    }
  } catch (error) {
    message.error("Có lỗi xảy ra khi tạo câu hỏi");
  } finally {
    creating.value = false;
  }
};

// Reset form khi mở modal
const resetForm = () => {
  questionForm.content = "";
  questionForm.type = "SINGLE_CHOICE";
  questionForm.answers = [
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ];
};

defineExpose({
  resetForm,
});
</script>

<style scoped>
.question-creator-modal {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
