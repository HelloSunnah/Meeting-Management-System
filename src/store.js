import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      theme: 'light',
      sidebarPosition: 'left',
    };
  },
  mutations: {
    setTheme(state, newTheme) {
      state.theme = newTheme;
    },
    setSidebarPosition(state, position) {
      state.sidebarPosition = position; 
    },
  },
  actions: {
    changeTheme({ commit }, newTheme) {
      commit('setTheme', newTheme);
    },
    changeSidebarPosition({ commit }, position) {
      commit('setSidebarPosition', position); 
    },
  },
  getters: {
    theme(state) {
      return state.theme;
    },
    sidebarPosition(state) {
      return state.sidebarPosition;
    },
  },
});

export default store;
