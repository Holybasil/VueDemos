const introduce = () => import("@/views/Overview/introduce");
const elementuiSelect = () => import("@/views/Components/elementuiSelect");
const elementTree = () => import("@/views/Components/elementTree");
const numberPrecision = () => import("@/views/Components/numberPrecision");
const treeSelect = () => import("@/views/Components/treeSelect");

const d3Funnel = () => import("@/views/VisualDataGraph/d3Funnel");

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
      },
      {
        name: "elementTree",
        path: "/components/elementTree",
        component: elementTree
      },
      {
        name: "numberPrecision",
        path: "/components/numberPrecision",
        component: numberPrecision
      },
      {
        name: "treeSelect",
        path: "/components/treeSelect",
        component: treeSelect
      }
    ]
  },
  {
    name: "visualDataGraph",
    icon: "project",
    children: [
      {
        name: "d3Funnel",
        path: "/visualDataGraph/d3Funnel",
        component: d3Funnel
      }
    ]
  }
];
