<template>
  <ul class="holyList" v-if="data.length">
    <li
      v-for="(item, index) in data"
      :Key="item[nodeKey]"
      :class="{
        highlight: value.find(node => node[nodeKey] === item[nodeKey])
      }"
      @click.exact="clickItem(item, index)"
      @click.meta="addItem(item)"
      @click.shift="selectUntilItem(item, index)"
      @mousedown="allowMousemove(item)"
      @mousemove="addMoveItem(item)"
      @mouseup="banMousemove(item)"
    >
      {{ item.label }}
    </li>
  </ul>
  <div class="holyList" v-else>
    <p>{{ emptyText }}</p>
  </div>
</template>

<script>
export default {
  name: "HolyList",
  data() {
    return {
      addFlag: false,
      currentIndex: 0
    };
  },
  props: {
    value: {
      type: Array
    },
    data: {
      type: Array
    },
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    "node-Key": {
      type: String,
      default: "id"
    }
  },
  created() {
    console.log(this.data, "data");
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    clickItem(item, index) {
      this.selected = [item];
      this.currentIndex = index;
    },
    addItem(item) {
      if (
        this.selected.find(node => node[this.nodeKey] === item[this.nodeKey])
      ) {
        this.selected = this.selected.filter(
          node => node[this.nodeKey] !== item[this.nodeKey]
        );
      } else {
        this.selected = [...this.selected, item];
      }
    },
    allowMousemove(item) {
      this.addFlag = true;
    },
    addMoveItem(item) {
      if (this.addFlag) {
        if (
          !this.selected.find(node => node[this.nodeKey] === item[this.nodeKey])
        ) {
          this.selected = [...this.selected, item];
        }
      }
    },
    banMousemove(item) {
      this.addFlag = false;
    },
    selectUntilItem(item, index) {
      const [start, end] = [this.currentIndex, index].sort((a, b) => a - b);
      this.selected = this.data.slice(start, end + 1);
    }
  }
};
</script>

<style lang="scss" scoped>
ul.holyList {
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 240px;
  overflow: scroll;
  list-style: none;
  background-color: #fff;
  li {
    padding: 6px;
    cursor: pointer;
    user-select: none;
  }
  .highlight {
    background-color: #f0f7ff;
  }
}
div.holyList {
  text-align: center;
  box-sizing: border-box;
  background-color: #ffdead;
  p {
    position: relative;
    margin-top: 50%;
    transform: translateY(-50%);
  }
}
</style>
