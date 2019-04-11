<template>
  <div>
    <HolySelect
      placeholder="喝点什么呢"
      v-model="drink"
      size="mini"
      filterable
      multiple
    >
      <el-option
        v-for="item in drinks"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      ></el-option>
    </HolySelect>
    <EleSelect
      placeholder="喝点什么呢 element"
      v-model="drink1"
      size="mini"
      filterable
      multiple
      default-first-option
    >
      <el-option
        v-for="item in drinks"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      ></el-option>
      <div slot="empty">heheheh</div>
    </EleSelect>
  </div>
</template>

<script>
import HolySelect from "./holySelect";
import EleSelect from "./eleSelect";
export default {
  data() {
    return {
      drink: "",
      drink1: "",
      drinks: [
        // {
        //   name: "纯牛奶",
        //   value: 0
        // },
        // {
        //   name: "芝芝莓莓",
        //   value: 1
        // },
        // {
        //   name: "霸气芝士莓莓莓",
        //   value: 2
        // },
        // {
        //   name: "燕麦椰奶",
        //   value: 3
        // },
        // {
        //   name: "多肉草莓",
        //   value: 4
        // },
        // {
        //   name: "霸气水果茶",
        //   value: 5
        // },
        // {
        //   name: "波霸奶茶",
        //   value: 6
        // },
        // {
        //   name: "芋泥波波茶",
        //   value: 7
        // }
      ]
    };
  },
  components: { HolySelect, EleSelect }
};
</script>

<style scoped></style>
