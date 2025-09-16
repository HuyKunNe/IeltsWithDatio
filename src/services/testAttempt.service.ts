import apiClient from "./api";
import type { ApiResponse } from "./types";

export interface CreateTestAttemptRequest {
  studentId: number;
  testId: number;
}

export interface StudentAnswerRequest {
  answerText: string;
  testQuestionId: number;
  answerId: number;
}

export interface SubmitTestAttemptRequest {
  testAttemptId: number;
  listStudentAnswers: StudentAnswerRequest[];
}

export interface StudentInfo {
  accountId: number;
  userName: string;
  name: string;
  phoneNumber: string;
  address: string;
  status: string;
  createAt: string;
  roleName: string;
}

export interface TestAttemptResponse {
  id: number;
  attemptAllowed: number;
  startAt: string;
  submitAt: string;
  score: number;
  status: string;
  student: StudentInfo;
  testId: number;
  listStudentAnswers?: StudentAnswerResponse[];
}

export interface StudentAnswerResponse {
  id: number;
  answerText: string;
  isCorrect: boolean;
  testQuestionId: number;
  answerId: number;
}

export interface CreateTestAttemptResponse extends ApiResponse {
  data: TestAttemptResponse;
}

export interface SubmitTestAttemptResponse extends ApiResponse {
  data: TestAttemptResponse;
}

export const testAttemptService = {
  createTestAttempt: async (
    data: CreateTestAttemptRequest
  ): Promise<CreateTestAttemptResponse> => {
    const response = await apiClient.post<CreateTestAttemptResponse>(
      "/test-attempt/create",
      data
    );
    return response.data;
  },

  submitTestAttempt: async (
    data: SubmitTestAttemptRequest
  ): Promise<SubmitTestAttemptResponse> => {
    const response = await apiClient.post<SubmitTestAttemptResponse>(
      "/test-attempt/submit",
      data
    );
    return response.data;
  },

  getStudentAttempts: async (
    studentId: number,
    testId: number
  ): Promise<ApiResponse> => {
    const response = await apiClient.get<ApiResponse>(
      `/test-attempt/user-attempts/${studentId}/${testId}`
    );
    return response.data;
  },
};
