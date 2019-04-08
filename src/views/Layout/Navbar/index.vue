<template>
  <header>
    <ToggleSidebar></ToggleSidebar>
    <Breadcrumb></Breadcrumb>
    <Logo></Logo>
  </header>
</template>

<script>
import ToggleSidebar from "./toggleSidebar";
import Breadcrumb from "./breadcrumb";
import Logo from "./logo";
export default {
  components: { ToggleSidebar, Breadcrumb, Logo }
};
</script>

<style lang="scss" scoped>
$gap: 10px;
header {
  display: grid;
  height: 40px;
  grid-template-columns: min-content 1fr min-content;
  grid-column-gap: $gap;
  align-items: center;
  padding: 0 $gap;
}
</style>
