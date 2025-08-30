import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      theme: 'light',
      sidebarPosition: 'left',
      token: localStorage.getItem('token') || null,
      user: null,
    };
  },
  mutations: {
    setTheme(state, newTheme) {
      state.theme = newTheme;
    },
    setSidebarPosition(state, position) {
      state.sidebarPosition = position;
    },
    setToken(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    changeTheme({ commit }, newTheme) {
      commit('setTheme', newTheme);
    },
    changeSidebarPosition({ commit }, position) {
      commit('setSidebarPosition', position);
    },
    login({ commit }, { token, user }) {
      commit('setToken', token);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    theme(state) {
      return state.theme;
    },
    sidebarPosition(state) {
      return state.sidebarPosition;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    currentUser(state) {
      return state.user;
    },
  },
});

export default store;
