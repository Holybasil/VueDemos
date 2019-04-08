// set...
const mutations = {
  setBreadcrumb(state, payload) {
    // 变更状态
    state.breadCrumb = [...payload];
  },
  setSidebarCollapsed(state, payload) {
    state.sidebarCollapsed = payload;
  }
};
export default mutations;
