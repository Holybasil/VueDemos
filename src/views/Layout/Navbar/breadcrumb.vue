<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="item in breadCrumb" :key="item">
      {{ item }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["breadCrumb"])
  }
};
</script>

<style scoped></style>
