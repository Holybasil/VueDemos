const elementuiSelect = () => import("@/views/Components/elementuiSelect");
const introduce = () => import("@/views/Overview/introduce");

export default [
  {
    name: "overview",
    path: "/overview",
    icon: "bars",
    component: introduce
  },
  {
    name: "components",
    icon: "project",
    children: [
      {
        name: "elementSelect",
        path: "/components/elementSelect",
        component: elementuiSelect
      }
    ]
  }
];
