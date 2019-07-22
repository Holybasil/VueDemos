const introduce = () => import("@/views/Overview/introduce");
const elementuiSelect = () => import("@/views/Components/elementuiSelect");
const elementTree = () => import("@/views/Components/elementTree");
const numberPrecision = () => import("@/views/Components/numberPrecision");
const treeSelect = () => import("@/views/Components/treeSelect");
const listSelect = () => import("@/views/Components/listSelect");
const clickoutside = () => import("@/views/Components/clickoutside");
const transfer = () => import("@/views/Components/transfer");

const d3Funnel = () => import("@/views/VisualDataGraph/d3Funnel");
// jsDetail-jsonEditor
const jsonEditor = () => import("@/views/jsDetail/jsonEditor");
const jsonValidate = () => import("@/views/jsDetail/jsonValidate");

// css 有趣的特性
const selector = () => import("@/views/cssCharacter/selector");

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
      },
      {
        name: "listSelect",
        path: "/components/listSelect",
        component: listSelect
      },
      {
        name: "clickoutside",
        path: "/components/clickoutside",
        component: clickoutside
      },
      {
        name: "transfer",
        path: "/components/transfer",
        component: transfer
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
  },
  {
    name: "cssCharacter",
    icon: "project",
    children: [
      {
        name: "selector",
        path: "/cssCharacter/selector",
        component: selector
      }
    ]
  },
  {
    name: "jsDetail",
    icon: "project",
    children: [
      {
        name: "jsonEditor",
        path: "/jsDetail/jsonEditor",
        component: jsonEditor
      },
      {
        name: "jsonValidate",
        path: "/jsDetail/jsonValidate",
        component: jsonValidate
      }
    ]
  }
];
