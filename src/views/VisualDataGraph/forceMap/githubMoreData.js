export default {
  nodes: [
    {
      id: 20,
      properties: {},
      type: 1,
      label: "魏长泽"
    },
    {
      id: 21,
      properties: {},
      type: 6,
      label: "藏色散人"
    }
  ],
  links: [
    {
      id: 30,
      source: 1,
      target: 20,
      type: "父亲",
      properties: {}
    },
    {
      id: 31,
      source: 20,
      target: 1,
      type: "儿砸",
      properties: {}
    },
    {
      id: 32,
      source: 21,
      target: 1,
      type: "阿羡",
      properties: {}
    },
    {
      id: 33,
      source: 1,
      target: 2,
      type: "不必保我弃了吧",
      properties: {}
    }
  ]
};
