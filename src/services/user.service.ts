import apiClient, { ApiResponse } from "./api";

export interface UserProfile {
  accountId: number;
  userName: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
  createAt: string;
  roleName: string;
}

export interface UserResponse extends ApiResponse {
  data: UserProfile;
}

export const userService = {
  getProfile: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>("/users/profile");
    return response.data;
  },

  updateProfile: async (
    profile: Partial<UserProfile>
  ): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(
      "/users/profile",
      profile
    );
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/users/change-password",
      passwordData
    );
    return response.data;
  },
};
