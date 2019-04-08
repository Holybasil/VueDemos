<template>
  <a-sub-menu :key="menuInfo.name" v-bind="$props" v-on="$listeners">
    <span slot="title">
      <a-icon :type="menuInfo.icon" />
      <span>{{ menuInfo.name }}</span>
    </span>
    <a-menu-item
      v-for="child in menuInfo.children"
      :key="child.name"
      @click="menuItemClick(menuInfo.name, child)"
    >
      <a-tooltip placement="topRight">
        <template slot="title">
          <span>{{ child.name }}</span>
        </template>
        {{ child.name }}
      </a-tooltip>
    </a-menu-item>
  </a-sub-menu>
</template>

<script>
import { Menu } from "ant-design-vue";
// TODO: template functional
// https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu.vue
// https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu1.vue
// 因组件内部会动态更改a-sub-menu的属性，如果拆分成单文件，无法将属性挂载到a-sub-menu上，你需要自行声明属性并挂载。为了方便，避免属性的声明，我们推荐使用函数式组件。
export default {
  data() {
    return {
      isSubMenu: true
    };
  },
  props: {
    ...Menu.SubMenu.props,
    menuInfo: Object
  },
  methods: {
    menuItemClick(fatherName, child) {
      this.$store.commit("setBreadcrumb", [fatherName, child.name]);
      this.$router.push(child.path);
    }
  }
};
</script>

<style scoped></style>
