import type { LoginRequest, UserProfile } from "@/services";
import { authService, testService, userService } from "@/services";
import type { AxiosError } from "axios";
import { ref } from "vue";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi() {
  const callApi = async <T>(
    apiCall: Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ): Promise<ApiState<T>> => {
    const state = ref<ApiState<T>>({
      data: null,
      loading: true,
      error: null,
    }) as import("vue").Ref<ApiState<T>>;

    try {
      const response = await apiCall;
      state.value.data = response;
      state.value.loading = false;
      if (onSuccess) onSuccess(response);
      return state.value;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        axiosError.message ||
        "An error has occurred.";

      state.value.error = errorMessage;
      state.value.loading = false;
      if (onError) onError(errorMessage);
      return state.value;
    }
  };

  return {
    // Auth APIs
    login: (credentials: LoginRequest) =>
      callApi(authService.login(credentials)),
    logout: () => callApi(authService.logout()),
    refreshToken: () => callApi(authService.refreshToken()),

    // User APIs
    getProfile: () => callApi(userService.getProfile()),
    updateProfile: (profile: Partial<UserProfile>) =>
      callApi(userService.updateProfile(profile)),
    changePassword: (passwordData: {
      currentPassword: string;
      newPassword: string;
    }) => callApi(userService.changePassword(passwordData)),

    // Test APIs
    getAllTests: () => callApi(testService.getAllTests()),
    getTestById: (id: number) => callApi(testService.getTestById(id)),
    submitTest: (testId: number, answers: any) =>
      callApi(testService.submitTest(testId, answers)),
    getTestResults: (testId: number) =>
      callApi(testService.getTestResults(testId)),

    // Generic call
    callApi,
  };
}
