import { COLORS, ColorKey } from "@/constants/colors";
import { computed } from "vue";

export function useColors() {
  const getColor = (colorKey: ColorKey) => {
    return COLORS[colorKey];
  };

  const primaryColor = computed(() => COLORS.PRIMARY);
  const primaryLight = computed(() => COLORS.PRIMARY_LIGHT);
  const primaryDark = computed(() => COLORS.PRIMARY_DARK);

  return {
    colors: COLORS,
    getColor,
    primaryColor,
    primaryLight,
    primaryDark,
  };
}
