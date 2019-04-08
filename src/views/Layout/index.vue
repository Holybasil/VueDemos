<template>
  <main>
    <Sidebar></Sidebar>
    <Navbar></Navbar>
    <div class="content">
      <div id="contentScroll">
        <transition name="move" mode="out-in">
          <keep-alive :key="1">
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
        </transition>
        <transition name="move" mode="out-in">
          <router-view :key="2" v-if="!$route.meta.keepAlive"></router-view>
        </transition>
      </div>
    </div>
  </main>
</template>

<script>
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
export default {
  components: { Navbar, Sidebar }
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-width: 1200px;
  grid-template-rows: min-content 1fr;
  grid-template-columns: min-content 1fr;
  aside {
    grid-row: span 2;
  }
  .content {
    padding: 0 10px 10px;
  }
}
</style>
