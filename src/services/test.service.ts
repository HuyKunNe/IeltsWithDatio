import apiClient from "./api";
import type { ApiResponse } from "./types";

export interface TestQuestionRequest {
  points: number;
  questionId: number;
}

export interface TestResourceRequest {
  resourceType: "AUDIO" | "IMAGE";
  url: string;
  content: string;
  description: string;
  displayOrder: number;
}

export interface CreateTestRequest {
  title: string;
  description: string;
  timeLimit: number;
  type: "READING" | "LISTENING";
  maxAttempts: number;
  testQuestions: TestQuestionRequest[];
  testResources: TestResourceRequest[];
}

export interface TestQuestionResponse {
  id: number;
  points: number;
  status: string;
  createdAt: string;
  questionResponse: {
    id: number;
    content: string;
    type: string;
    status: string;
    createAt: string;
    listAnswers: Array<{
      id: number;
      content: string;
      isCorrect: string;
      status: string;
      createAt: string;
    }>;
  };
}

export interface TestResourceResponse {
  id: number;
  resourceType: string;
  url: string;
  content: string;
  description: string;
  displayOrder: number;
  status: string;
  createdAt: string;
}

export interface CreateTestResponseData {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  type: string;
  maxAttempts: number;
  status: string;
  createdAt: string;
  testQuestionResponses: TestQuestionResponse[];
  testResourceResponses: TestResourceResponse[];
}

export interface TestListItem {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  type: "READING" | "LISTENING";
  maxAttempts: number;
  status: string;
  createdAt: string;
}

export interface TestDetail {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  type: "READING" | "LISTENING";
  maxAttempts: number;
  status: string;
  createdAt: string;
  testQuestionResponses: TestQuestionResponse[];
  testResourceResponses: TestResourceResponse[];
}
export interface TestDetailResponse extends ApiResponse {
  data: TestDetail;
}
export interface GetAllTestsResponse extends ApiResponse {
  data: TestListItem[];
}

export interface CreateTestResponse extends ApiResponse {
  data: CreateTestResponseData;
}

export const testService = {
  createTest: async (
    testData: CreateTestRequest
  ): Promise<CreateTestResponse> => {
    const response = await apiClient.post<CreateTestResponse>(
      "/test/create",
      testData
    );
    return response.data;
  },

  getAllTests: async (): Promise<GetAllTestsResponse> => {
    const response = await apiClient.get<GetAllTestsResponse>("/test/getAll");
    return response.data;
  },

  getTestById: async (id: number): Promise<TestDetailResponse> => {
    const response = await apiClient.get<TestDetailResponse>(`/test/${id}`);
    return response.data;
  },
};
