{
  "data": Data,
  "msg": "查询提示信息",
  "flag": "0或者1"
}

interface Data {
  nodes: Array<Node>,
  links: Array<Link>
}

interface Node {
  id: number | string,
  label: string, // 节点名称
  properties: object, // 查看节点属性面板的数据
  type: number // 节点颜色的标识
}

interface Link {
  id: number | string,
  label: string, // 关系名称
  properties: object, // 查看关系属性面板的数据
  source: number | string, // 对应node的id
  target: number | string // 对应node的id
}