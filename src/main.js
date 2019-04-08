import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import AntdDesignVue from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
import ElementUI from "element-ui";
import "./assets/element-#FF9300/index.css";

Vue.use(AntdDesignVue);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
