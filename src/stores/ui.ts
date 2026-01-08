import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const showHeader = ref(true);

  const setShowHeader = (value: boolean) => {
    showHeader.value = value;
  };

  return { showHeader, setShowHeader };
});
