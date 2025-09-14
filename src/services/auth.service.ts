import apiClient from "./api";
import type { ApiResponse } from "./types";

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  accountId: number;
  userName: string;
  name: string;
  phoneNumber: string;
  address: string;
  status: string;
  createAt: string;
  roleName: string;
}

export interface LoginResponse extends ApiResponse {
  data: LoginResponseData;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseData?: ApiResponse
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      // Kiểm tra nếu status không phải 200
      if (response.status !== 200) {
        throw new AuthError(
          response.data?.message,
          response.status,
          response.data
        );
      }

      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Server trả về response với status code khác 2xx
        throw new AuthError(
          error.response.data?.message,
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response
        throw new AuthError(
          "Unable to connect to the server. Please try again later."
        );
      } else {
        // Lỗi khác
        throw new AuthError(error.message || "An error occurred during login.");
      }
    }
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/refresh");
    return response.data;
  },
};
