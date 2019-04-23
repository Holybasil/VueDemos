<template>
  <div>
    <div class="flex">
      Plus:<a-input placeholder="plus1" v-model="plus1" />+<a-input
        placeholder="plus2"
        v-model="plus2"
      />={{ plus }}
    </div>
    <div class="flex">
      Minus:<a-input placeholder="minus1" v-model="minus1" />-<a-input
        placeholder="minus2"
        v-model="minus2"
      />={{ minus }}
    </div>
    <div class="flex">
      Round: <a-input placeholder="round1" v-model="round1" />~<a-input
        placeholder="round2"
        v-model="round2"
      />={{ round }}
    </div>
  </div>
</template>

<script>
import NP from "number-precision";
export default {
  data() {
    return {
      plus1: "",
      plus2: "",
      minus1: "",
      minus2: "",
      round1: "",
      round2: ""
    };
  },
  computed: {
    plus() {
      return NP.plus(this.plus1, this.plus2) || 0;
    },
    minus() {
      return NP.minus(this.minus1, this.minus2);
    },
    round() {
      return NP.round(this.round1, this.round2) || 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}
</style>
