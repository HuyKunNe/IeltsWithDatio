import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export interface ApiResponse {
  message: string;
  status: string;
  data?: any;
}

// Tạo instance của axios với cấu hình mặc định
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để thêm token nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi chung
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Xử lý khi unauthorized
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Xử lý lỗi từ API response format
    if (error.response?.status) {
      const apiError = error.response.data as ApiResponse;
      error.message = apiError.message || error.message;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
