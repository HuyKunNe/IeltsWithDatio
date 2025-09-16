import type { CreateTestRequest } from "@/services/test.service";
import { testService } from "@/services/test.service";
import type { AxiosError } from "axios";
import { shallowRef } from "vue";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  statusCode?: number;
}

export function useTest() {
  const callApi = async <T>(
    apiCall: Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: string, statusCode?: number) => void
  ): Promise<ApiState<T>> => {
    const state = shallowRef<ApiState<T>>({
      data: null,
      loading: true,
      error: null,
      statusCode: undefined,
    });

    try {
      const response = await apiCall;
      state.value.data = response;
      state.value.loading = false;
      state.value.statusCode = 200;
      if (onSuccess) onSuccess(response);
      return state.value;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as any)?.message ||
        axiosError.message ||
        "Có lỗi xảy ra";

      state.value.error = errorMessage;
      state.value.statusCode = axiosError.response?.status;
      state.value.loading = false;

      if (onError) onError(errorMessage, axiosError.response?.status);
      return state.value;
    }
  };

  return {
    createTest: (testData: CreateTestRequest) =>
      callApi(testService.createTest(testData)),

    getAllTests: () => callApi(testService.getAllTests()),

    getTestById: (id: number) => callApi(testService.getTestById(id)),

    callApi,
  };
}
