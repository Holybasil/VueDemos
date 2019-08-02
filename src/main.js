import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import { HolyClickoutside } from "holy-components";
// const { HolyClickoutside } = require("holy-components");
import HolyComponents from "holy-components";
import "holy-components/dist/holycomponents.css";
import AntdDesignVue from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
import ElementUI from "element-ui";
import { Button } from "element-ui";
import "./assets/element-#FF9300/index.css";

Vue.use(AntdDesignVue);
Vue.use(ElementUI);
// console.log(HolyComponents, "holy");
// const { HolyClickoutside } = HolyComponents;
// console.log(HolyClickoutside, "holy");
// Vue.component(HolyClickoutside.name, HolyClickoutside);
// console.log(ElementUI, Button, "element");
Vue.component(Button.name, Button);
Vue.use(HolyComponents);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
  // render(createElement) {
  //   return createElement(
  //     "div",
  //     {
  //       attrs: {
  //         id: "divv"
  //       }
  //     },
  //     "有钱哥哥"
  //   );
  // }
}).$mount("#app");
