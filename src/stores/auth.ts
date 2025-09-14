import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import type { LoginResponseData } from "@/services";

interface User {
  accountId: number;
  userName: string;
  name: string;
  phoneNumber: string;
  address: string;
  status: string;
  createAt: string;
  roleName: string;
}

interface LoginCredentials {
  userName: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const token = ref<string | null>(null);

  const { login: loginApi } = useApi();

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    try {
      const response = await loginApi(credentials);
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data != null) {
        const loginData = response.data.data as LoginResponseData;
        user.value = {
          accountId: loginData.accountId,
          userName: loginData.userName,
          name: loginData.name,
          phoneNumber: loginData.phoneNumber,
          address: loginData.address,
          status: loginData.status,
          createAt: loginData.createAt,
          roleName: loginData.roleName,
        };
        token.value = loginData.token;
        isAuthenticated.value = true;

        // Lưu vào localStorage
        localStorage.setItem("authToken", loginData.token);
        localStorage.setItem("user", JSON.stringify(user.value));
      }

      return response;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const checkAuth = () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
    }
  };

  // Kiểm tra auth khi store được khởi tạo
  checkAuth();

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
  };
});
