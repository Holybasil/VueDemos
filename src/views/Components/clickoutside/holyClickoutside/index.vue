<template>
  <div ref="clickoutside">
    <slot></slot>
  </div>
</template>

<script>
// import Clickoutside from "../clickoutside";
export default {
  data() {
    return {
      // mousedownTarget: null,
      // mouseupTarget: null
      clickTarget: null,
      exactList: []
    };
  },
  props: {
    except: {
      type: Array || String
    }
  },
  // directives: { Clickoutside },
  mounted() {
    document.addEventListener("click", this.clickEvent);
    this.exactList = this.except
      .map(item => [...document.querySelectorAll(item)])
      .flat(Infinity);
    console.log(this.exactList, "list");
  },
  methods: {
    clickEvent(e) {
      console.log(e, "current e");
      console.log("click document");
      this.clickTarget = e;
      if (
        !e.target ||
        this.$refs.clickoutside.contains(e.target) ||
        this.exactList.find(item => item.contains(e.target))
      ) {
        return;
      }
      this.$emit("handle");
    },
    handleClickoutside() {
      this.$emit("handle");
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.clickEvent);
  }
};
</script>

<style lang="scss" scoped></style>
