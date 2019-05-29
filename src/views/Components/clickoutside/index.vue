<template>
  <div>
    <div class="content">
      <!-- <div
        class="left"
        :class="{ highlight: holy === 'left' }"
        v-clickoutside="handleClickoutside"
        @click="holy = 'left'"
      >
        我是左边
      </div> -->
      <div
        class="right"
        :class="{ highlight: holy === 'right' }"
        @click="holy = 'right'"
      >
        我是右边
      </div>
    </div>
    <div class="content">
      <HolyClickoutside :except="['.right']" @handle="handleClickoutside">
        <div
          class="left"
          :class="{ highlight: holy === 'left' }"
          @click="holy = 'left'"
        >
          我是左边
        </div>
      </HolyClickoutside>
      <div
        class="right"
        :class="{ highlight: holy === 'right' }"
        @click="holy = 'right'"
      >
        我是右边
      </div>
    </div>
  </div>
</template>

<script>
// import Clickoutside from "element-ui/src/utils/clickoutside";
import Clickoutside from "./clickoutside";
import HolyClickoutside from "./holyClickoutside";
export default {
  data() {
    return {
      holy: "left"
    };
  },
  directives: { Clickoutside },
  components: { HolyClickoutside },
  methods: {
    handleClickoutside() {
      alert("处理我");
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  .highlight {
    background-color: gold;
  }
  & > div {
    cursor: pointer;
  }
}
</style>
