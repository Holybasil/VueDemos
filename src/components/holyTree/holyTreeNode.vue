<template>
  <div
    class="el-tree-node"
    @click.stop="handleClick"
    @contextmenu="$event => this.handleContextMenu($event)"
    v-show="node.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.draggable"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
    ref="node"
  >
    <div
      class="el-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }"
    >
      <span
        @click.stop="handleExpandIconClick"
        :class="[
          { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded },
          'el-tree-node__expand-icon',
          tree.iconClass ? tree.iconClass : 'el-icon-caret-right'
        ]"
      >
      </span>
      <el-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      >
      </el-checkbox>
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading"
      >
      </span>
      <node-content :node="node"></node-content>
    </div>
    <el-collapse-transition>
      <div
        class="el-tree-node__children"
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        role="group"
        :aria-expanded="expanded"
      >
        <el-tree-node
          :render-content="renderContent"
          v-for="child in node.childNodes"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :key="getNodeKey(child)"
          :node="child"
          @node-expand="handleChildNodeExpand"
        >
        </el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/jsx">
import ElCollapseTransition from "element-ui/lib/transitions/collapse-transition";
// import ElCheckbox from "element-ui/packages/checkbox";
import emitter from "element-ui/src/mixins/emitter";
import { getNodeKey } from "element-ui/packages/tree/src/model/util";

export default {
  name: "ElTreeNode",

  componentName: "ElTreeNode",

  mixins: [emitter],

  props: {
    node: {
      default() {
        return {};
      }
    },
    props: {},
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },

  components: {
    ElCollapseTransition,
    // ElCheckbox,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        const parent = this.$parent;
        const tree = parent.tree;
        const node = this.node;
        const { data, store } = node;

        return (
          // eslint-disable-next-line
          parent.renderContent
          // eslint-disable-next-line
            ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
            : (tree.$scopedSlots.default
              ? tree.$scopedSlots.default({ node, data })
              : <span class="el-tree-node__label">{ node.label }</span>)
        );
      }
    }
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null
    };
  },

  watch: {
    "node.indeterminate": function (val) {
      this.handleSelectChange(this.node.checked, val);
    },

    "node.checked": function (val) {
      this.handleSelectChange(val, this.node.indeterminate);
    },

    "node.expanded": function (val) {
      this.$nextTick(() => { this.expanded = val; });
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },

  methods: {
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data);
    },

    handleSelectChange(checked, indeterminate) {
      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
        this.tree.$emit("check-change", this.node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },

    handleClick() {
      const store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit("current-change",
        store.currentNode ? store.currentNode.data : null,
        store.currentNode);
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      if (this.tree.checkOnClickNode && !this.node.disabled) {
        this.handleCheckChange(null, {
          target: { checked: !this.node.checked }
        });
      }
      this.tree.$emit("node-click", this.node.data, this.node, this);
    },

    handleContextMenu(event) {
      // eslint-disable-next-line
      if (this.tree._events["node-contextmenu"] && this.tree._events["node-contextmenu"].length > 0) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.tree.$emit("node-contextmenu", event, this.node.data, this.node, this);
    },

    handleExpandIconClick() {
      if (this.node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit("node-collapse", this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit("node-expand", this.node.data, this.node, this);
      }
    },
    // TODO: 去掉子节点
    handleCheckChange(value, ev) {
      // debugger;
      // if (this.tree.uniqueLeaf) {
      //   // 这里清空掉上次的checked 结果是每个node的checked和indeterminate 均为false
      //   this.tree.store.setCheckedKeys([]);
      // }
      if(this.tree.withoutChildren && this.node.indeterminate && this.tree.nodeKey){
          this.tree.store.setCheckedKeys([]);
        }
      this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
      // uniqueLeaf 为false的情况下 路径无意义
      // const path = this.tree.uniqueLeaf ? this.getNodePath(this.node.data) : undefined;
      const path = this.getNodePath(this.node.data);
      this.$nextTick(() => {
        const store = this.tree.store;
        this.tree.$emit("check", this.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        }, path);
      });
    },
    // 默认数组item为node data（同时需要name信息和node-key信息）
    getNodePath(data) {
      if (!this.tree.nodeKey) throw new Error("[Tree] nodeKey is required in getNodePath");
      const node = this.tree.store.getNode(data);
      if (!node) return [];
      const path = [node.data];
      let parent = node.parent;
      while (parent && parent !== this.tree.store.root) {
        path.push(parent.data);
        parent = parent.parent;
      }
      return path.reverse();
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast("ElTreeNode", "tree-node-expand", node);
      this.tree.$emit("node-expand", nodeData, node, instance);
    },

    handleDragStart(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit("tree-node-drag-start", event, this);
    },

    handleDragOver(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit("tree-node-drag-over", event, this);
      event.preventDefault();
    },

    handleDrop(event) {
      event.preventDefault();
    },

    handleDragEnd(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit("tree-node-drag-end", event, this);
    }
  },

  created() {
    const parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;
    if (!tree) {
      // eslint-disable-next-line
      console.warn("Can not find node's tree.");
    }

    const props = tree.props || {};
    const childrenKey = props.children || "children";

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }

    if (this.tree.accordion) {
      this.$on("tree-node-expand", (node) => {
        if (this.node !== node) {
          this.node.collapse();
        }
      });
    }
  }
};
</script>
