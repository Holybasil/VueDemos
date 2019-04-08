<template>
  <div class="collapsed" @click="toggleSidebarCollapsed">
    <a-icon :type="sidebarCollapsed ? 'menu-unfold' : 'menu-fold'" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["sidebarCollapsed"])
  },
  methods: {
    toggleSidebarCollapsed() {
      this.$store.commit("setSidebarCollapsed", !this.sidebarCollapsed);
    }
  }
};
</script>

<style lang="scss" scoped>
.collapsed {
  cursor: pointer;
}
</style>
