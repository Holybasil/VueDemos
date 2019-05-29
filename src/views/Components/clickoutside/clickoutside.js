import Vue from "vue";
// import { on } from 'element-ui/src/utils/dom';

const on = (function() {
  if (!Vue.prototype.$isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        // 事件名（"click"） 事件函数 默认false冒泡捕获
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

const nodeList = [];
const ctx = "@@clickoutsideContext";

let startClick;
let seed = 0;

!Vue.prototype.$isServer && on(document, "mousedown", e => (startClick = e));

!Vue.prototype.$isServer &&
  on(document, "mouseup", e => {
    // debugger;
    console.log(startClick, "startClick");
    // nodeList中的node上挂载的函数documentHandler均执行
    nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
  });

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      // 判断mouseup事件的节点是否为当前节点的后代节点
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      // 判断是否在vnode的下拉菜单中
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))
    )
      return;

    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
      debugger;
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  // el: 绑定元素 ref
  // binding: 包含指令名 绑定值 绑定值的表达式(函数名)的对象
  bind(el, binding, vnode) {
    console.log(el, binding, vnode, "当前vue node");
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },

  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },

  unbind(el) {
    let len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
};
