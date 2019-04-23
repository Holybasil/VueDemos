<template>
  <div class="tree">
    <div>
      <h3>改造中的</h3>
      <Tree
        :data="data"
        show-checkbox
        default-expand-all
        ref="tree"
        highlight-current
        without-children
        node-key="id"
        :props="defaultProps"
        @check="checkNode"
      >
      </Tree>
      <div>{{ curPath }}</div>
    </div>
    <div>
      <h3>原来的</h3>
      <Tree
        lazy
        :load="loadData"
        show-checkbox
        ref="tree"
        highlight-current
        :props="props"
        @check="checkNode"
      ></Tree>
    </div>
  </div>
</template>

<script>
import Tree from "./tree";
export default {
  // withoutChildren
  data() {
    return {
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 3,
              label: "二级 1-1",
              children: [
                {
                  id: 7,
                  label: "三级 1-1-1"
                },
                {
                  id: 8,
                  label: "三级 1-1-2",
                  children: [
                    {
                      id: 12,
                      label: "三级 1-1-2-1"
                    },
                    {
                      id: 13,
                      label: "三级 1-1-2-2"
                    },
                    {
                      id: 14,
                      label: "三级 1-1-2-3",
                      children: [
                        {
                          id: 16,
                          label: "三级 1-1-2-3-1"
                        },
                        {
                          id: 17,
                          label: "三级 1-1-2-3-2"
                        }
                      ]
                    },
                    {
                      id: 15,
                      label: "三级 1-1-2-4"
                    }
                  ]
                }
              ]
            },
            {
              id: 4,
              label: "二级 1-2",
              children: [
                {
                  id: 9,
                  label: "二级 1-2-1"
                },
                {
                  id: 10,
                  label: "二级 1-2-2"
                },
                {
                  id: 11,
                  label: "二级 1-2-3"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      props: {
        label: "name",
        children: "zones"
      },
      curPath: ""
    };
  },
  components: { Tree },
  methods: {
    checkNode(data, { checkedKeys, halfCheckedKeys }, path) {
      // debugger;
      this.curPath = path ? path.map(item => item.label).join("->") : "";
    },
    loadData(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: "region1" }, { name: "region2" }]);
      }
      if (node.level > 3) return resolve([]);

      let hasChild;
      if (node.data.name === "region1") {
        hasChild = true;
      } else if (node.data.name === "region2") {
        hasChild = false;
      } else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        let data;
        if (hasChild) {
          data = [
            {
              name: "zone" + this.count++
            },
            {
              name: "zone" + this.count++
            }
          ];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.tree {
  display: flex;
  justify-content: space-between;
}
</style>
