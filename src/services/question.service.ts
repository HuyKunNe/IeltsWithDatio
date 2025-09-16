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

export interface AnswerResponse {
  id: number;
  content: string;
  isCorrect: string;
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

  getQuestions: async (): Promise<CreateQuestionsResponse> => {
    const response = await apiClient.get<CreateQuestionsResponse>("/questions");
    return response.data;
  },

  // updateQuestion: async (
  //   id: number,
  //   question: Partial<QuestionRequest>
  // ): Promise<ApiResponse> => {
  //   const response = await apiClient.put<ApiResponse>(
  //     `/questions/${id}`,
  //     question
  //   );
  //   return response.data;
  // },

  // deleteQuestion: async (id: number): Promise<ApiResponse> => {
  //   const response = await apiClient.delete<ApiResponse>(`/questions/${id}`);
  //   return response.data;
  // },
};
