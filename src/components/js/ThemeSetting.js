import { computed } from "vue";
import { useStore } from "vuex";
export default function useTheme() {
  const store = useStore();
  const theme1 = computed(() =>
    store.state.theme === "dark"
      ? "bg-gray-100 text-gray-900 custom-scrollbar"
      : "bg-gray-900 text-gray-100 custom-scrollbar"
  );
  const theme2 = computed(() =>
    store.state.theme === "dark"
      ? "bg-gray-200 text-gray-800 custom-scrollbar"
      : "bg-gray-800 text-gray-200 custom-scrollbar"
  );
  const theme3 = computed(() =>
    store.state.theme === "dark"
      ? "bg-gray-300 text-gray-700 custom-scrollbar"
      : "bg-gray-700 text-gray-300 custom-scrollbar"
  );

  return {
    theme1,
    theme2,
    theme3,
    theme4: computed(() =>
      store.state.theme === "dark" ? "bg-gray-400 text-gray-600" : "bg-gray-600 text-gray-400"
    ),
    theme5: "bg-gray-500 text-gray-100",
    theme6: computed(() =>
      store.state.theme === "dark" ? "bg-gray-600 text-gray-50" : "bg-gray-400 text-gray-900"
    ),

        theme61: computed(() =>
      store.state.theme === "dark" ? "bg-gray-600 text-gray-50" : "bg-white text-gray-900"
    ),
    theme7: computed(() =>
      store.state.theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
    ),
    theme8: computed(() =>
      store.state.theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"
    ),
    theme9: computed(() =>
      store.state.theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    ), 

        themeText: computed(() =>
    store.state.theme === "dark" ? "text-white" : "text-gray-800"
    ), 
    theme81: computed(() =>
      store.state.theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
    ),
        themeInputText: computed(() =>
    store.state.theme === "dark" ? "text-gray-800" : "text-gray-800"
    ),
  };
}
