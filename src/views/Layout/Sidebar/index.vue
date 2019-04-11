<template>
  <aside>
    <a-menu
      @click="handleClick"
      :inlineCollapsed="sidebarCollapsed"
      :defaultSelectedKeys="selectedKeys"
      :defaultOpenKeys="openKeys"
      mode="inline"
    >
      <template v-for="item in directory">
        <a-menu-item
          v-if="!item.children"
          :key="item.name"
          @click="menuItemClick(item)"
        >
          <a-icon :type="item.icon" />
          <span>{{ item.name }}</span>
        </a-menu-item>
        <SubMenu
          v-else
          :menuInfo="item"
          :key="item.name"
          @menuItemClick="menuItemClick"
        ></SubMenu>
      </template>
    </a-menu>
  </aside>
</template>

<script>
import directory from "@/router/directory";
import { mapState } from "vuex";
import SubMenu from "./subMenu";
export default {
  data() {
    return {
      directory,
      collapsed: false
    };
  },
  computed: {
    ...mapState(["sidebarCollapsed", "breadCrumb"]),
    // TODO: 处理复杂场景 可见elementui el-menu
    // https://github.com/ElemeFE/element/blob/dev/packages/menu/src/menu.vue
    openKeys() {
      const { path } = this.$route;
      const breadCrumb = path.split("/");
      return breadCrumb.slice(1, breadCrumb.length - 1);
    },
    selectedKeys() {
      const { path } = this.$route;
      const breadCrumb = path.split("/");
      return [breadCrumb[breadCrumb.length - 1]];
    }
  },
  components: { SubMenu },
  methods: {
    handleClick() {},
    titleClick({ key, domEvent }) {
      console.log(key, domEvent);
    },
    menuItemClick(item) {
      this.$store.commit("setBreadcrumb", [item.name]);
      this.$router.push(item.path);
    }
  }
};
</script>

<style lang="scss" scoped>
aside {
  // 为了适应收起状态的宽度
  background-color: #ffdead;
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none !important;
  }
  .ant-menu:not(.ant-menu-inline-collapsed) {
    width: 200px;
  }
}
</style>
