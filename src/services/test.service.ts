import apiClient from "./api";
import { ApiResponse } from "./types";

export interface Test {
  id: number;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  questions: Question[];
}

export interface Question {
  id: number;
  content: string;
  type: string;
  options: Option[];
}

export interface Option {
  id: number;
  content: string;
  isCorrect: boolean;
}

export interface TestResponse extends ApiResponse {
  data: Test[];
}

export interface SingleTestResponse extends ApiResponse {
  data: Test;
}

export const testService = {
  getAllTests: async (): Promise<TestResponse> => {
    const response = await apiClient.get<TestResponse>("/tests");
    return response.data;
  },

  getTestById: async (id: number): Promise<SingleTestResponse> => {
    const response = await apiClient.get<SingleTestResponse>(`/tests/${id}`);
    return response.data;
  },

  submitTest: async (testId: number, answers: any): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      `/tests/${testId}/submit`,
      answers
    );
    return response.data;
  },

  getTestResults: async (testId: number): Promise<ApiResponse> => {
    const response = await apiClient.get<ApiResponse>(
      `/tests/${testId}/results`
    );
    return response.data;
  },
};
