import apiClient from "./api";
import type { ApiResponse } from "./types";

export interface AnswerRequest {
  content: string;
  isCorrect: boolean;
}

export interface QuestionRequest {
  content: string;
  type: string;
  answers: AnswerRequest[];
}

export interface EditQuestionRequest {
  content: string;
  type: string;
  answers: AnswerRequest[];
}

export interface AnswerResponse {
  id: number;
  content: string;
  isCorrect: boolean;
  status: string;
  createAt: string;
}

export interface QuestionResponse {
  id: number;
  content: string;
  type: string;
  status: string;
  createAt: string;
  listAnswers: AnswerResponse[];
}

export interface QuestionsListResponse extends ApiResponse {
  data: QuestionResponse[];
}

export interface CreateQuestionsResponse extends ApiResponse {
  data: QuestionResponse[];
}

export const questionService = {
  createQuestions: async (
    questions: QuestionRequest[]
  ): Promise<CreateQuestionsResponse> => {
    const response = await apiClient.post<CreateQuestionsResponse>(
      "/question/create",
      questions
    );
    return response.data;
  },

  editQuestion: async (
    id: number,
    questions: EditQuestionRequest
  ): Promise<QuestionResponse> => {
    const response = await apiClient.put<QuestionResponse>(
      `/question/edit/${id}`,
      questions
    );
    return response.data;
  },

  getAllActiveQuestions: async (): Promise<QuestionsListResponse> => {
    const response = await apiClient.get<QuestionsListResponse>(
      "/question/get-all-activate"
    );
    return response.data;
  },
};
