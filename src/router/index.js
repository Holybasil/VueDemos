import Vue from "vue";
import Router from "vue-router";
import Layout from "../views/Layout";
import directory from "./directory";

Vue.use(Router);

let realRoute = [];
(function getRoute() {
  directory.forEach(item => {
    if (item.children) {
      realRoute = [...realRoute, ...item.children];
    } else {
      realRoute = [...realRoute, item];
    }
  });
})();
export default new Router({
  routes: [
    {
      path: "/",
      name: "Layout",
      component: Layout,
      redirect: realRoute[0].path,
      children: realRoute
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
