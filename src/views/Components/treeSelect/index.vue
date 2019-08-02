<template>
  <div>
    <Treeselect v-model="value" :options="options" multiple></Treeselect>
    <HolyTree
      :data="treeData"
      node-key="id"
      default-expand-all
      check-strictly
      :expand-on-click-node="false"
      show-checkbox
      @node-click="selectNode"
      @check="checkNode"
    >
    </HolyTree>
  </div>
</template>

<script>
import HolyTree from "@/components/holyTree";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data() {
    return {
      value: null,
      // define options
      options: [
        {
          id: "a",
          label: "a",
          children: [
            {
              id: "aa",
              label: "aa"
            },
            {
              id: "ab",
              label: "ab"
            }
          ]
        },
        {
          id: "b",
          label: "b"
        },
        {
          id: "c",
          label: "c"
        }
      ],

      // holyTree
      treeData: [
        {
          id: 1,
          label: "1",
          children: [
            {
              id: 2,
              label: "1-1"
            },
            {
              id: 3,
              label: "1-2",
              children: [
                {
                  id: 5,
                  label: "1-2-1"
                }
              ]
            },
            {
              id: 4,
              label: "1-3"
            }
          ]
        },
        {
          id: 6,
          label: "2"
        }
      ]
    };
  },
  components: { Treeselect, HolyTree },
  methods: {
    checkNode(data, { checkedKeys, halfCheckedKeys }, path) {
      console.log(path, "path");
    },
    selectNode() {}
  }
};
</script>

<style lang="scss" scoped></style>
