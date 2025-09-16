import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import Login from "@/components/Login.vue";
import QuestionManager from "@/components/QuestionManager.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/question-manager",
    name: "QuestionManager",
    component: QuestionManager,
    meta: { requiresAuth: true, requiresRole: "MANAGER" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard với role checking
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/");
  } else if (to.meta.requiresRole) {
    const userRole = authStore.user?.roleName;
    if (
      userRole === to.meta.requiresRole ||
      userRole === "ADMIN" ||
      userRole === "MANAGER"
    ) {
      next();
    } else {
      next("/");
      alert("Bạn không có quyền truy cập trang này");
    }
  } else {
    next();
  }
});

export default router;
