<template>
  <div class="text">
    <!-- <p>
      <span v-for="item in text" :key="item">{{ item }}</span>
    </p>-->
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      text: "",
      svg: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const width = document.querySelector(".text").offsetWidth;
      const height = document.querySelector(".text").offsetHeight;
      this.svg = d3
        .select(".text")
        .append("svg")
        .attr("class", "holySvg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(200, ${height / 2})`);

      d3.interval(() => {
        const t = d3.transition().duration(750);
        const text = this.svg
          .selectAll("text")
          .data(this.randomLetters(), d => d);
        text
          .enter()
          .append("text")
          .attr("fill", "green")
          .attr("y", -30)
          .style("fill-opacity", 0)
          // .merge(text)
          .attr("x", (d, i) => i * 26)
          .text(d => d)
          .transition(t)
          .attr("y", 0)
          .style("fill-opacity", 1);

        text
          .attr("fill", "#555")
          // .attr("y", 0)
          // .style("fill-opacity", 1)
          .transition(t)
          .attr("x", (d, i) => {
            return i * 26;
          });

        // text.update().attr("fill", "#555");
        text
          .exit()
          .attr("fill", "red")
          .transition(t) // 设置动画
          .attr("y", 30) // 设置y坐标, 使元素向下离开界面 (y: 0 => 60)
          .style("fill-opacity", 0)
          .remove();
      }, 1000);
    },
    randomLetters() {
      return d3
        .shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
        .slice(0, Math.floor(6 + Math.random() * 20))
        .sort();
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  width: 100%;
  height: 100%;
  font-family: Monospace;
}
.holySvg {
  text-align: center;
}
p {
  position: relative;
  left: 20px;
  top: calc(50% - 30px);
}
span {
  display: inline-block;
  width: 26px;
  font-size: 26px;
}
</style>
<style>
text {
  font-size: 26px;
}
</style>
