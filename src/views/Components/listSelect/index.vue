<template>
  <div>
    <HolyList :data="list" v-model="selected" :empty-text="'暂无数据'">
    </HolyList>
  </div>
</template>
<script>
import HolyList from "./holyList";
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          label: "《魔道祖师》"
        },
        {
          id: 2,
          label: "《月刊少女野崎君》"
        },
        {
          id: 3,
          label: "《刀剑神域》"
        },
        {
          id: 4,
          label: "《景恒街》"
        },
        {
          id: 5,
          label: "《白夜行》"
        },
        {
          id: 6,
          label: "《黎明之街》"
        }
      ],
      selected: []
    };
  },
  components: { HolyList }
};
</script>
<style></style>
