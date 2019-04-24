<template>
  <div>
    <div class="container" ref="container">
      <!-- <svg></svg> -->
    </div>
    <div>{{ path }}</div>
  </div>
</template>

<script>
import * as d3 from "d3";
import data from "./data";
export default {
  data() {
    return {
      path: "",
      svg: null
    };
  },
  mounted() {
    this.init();
    window.addEventListener("resize", () => {
      // this.width = this.$refs.container.offsetWidth;
      // this.height = this.$refs.container.offsetHeight;
      // // this.xScale = d3.scaleLinear().range([0, this.width]);
      // // this.yScale = d3.scaleLinear().range([0, this.height]);
      // console.log(this.width, this.height, "resize");
      // this.svg
      //   .transition()
      //   .duration(750)
      //   .attr("transform", function(d) {
      //     return this.width + "";
      //   });
    });
  },
  methods: {
    init() {
      window.d3 = d3;
      // 限制svg的宽高
      const width = this.$refs.container.offsetWidth;
      const height = this.$refs.container.offsetHeight;
      const xScale = d3.scaleLinear().range([0, width]);
      const yScale = d3.scaleLinear().range([0, height]);
      console.log(xScale, yScale, "xScale yScale");
      // 限定数据展示格式 千位逗号符和对number toString
      const format = d3.format(",d");
      // scaleOrdinal 序数比例尺
      // interpolateRainbow 插值器（function）
      // quantize 从指定插值器返回n个均匀间隔的样本
      const color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );
      console.log(d3.interpolateRainbow, "rainbow");
      window.color = color;
      console.log(color, "color");
      const partition = data =>
        d3
          .partition()
          .size([height, width])
          .padding(1)(
          d3
            .hierarchy(data)
            // 如果每个非叶子节点已经提供了value（不需要计算）后序遍历
            // .sum(d => {
            //   // console.log(d, "node");
            //   return d.value;
            //   // return d.value ? d.value : 0;
            // })
            .sort((a, b) => b.height - a.height || b.value - a.value)
        );
      const root = partition(data);
      console.log(root, "tree data");
      console.log(
        d3
          .partition()
          .size([height, width])
          .padding(1),
        "sort"
      );
      var svgo = d3
        .select(".container")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

      const svg = svgo.style("font", "10px sans-serif");
      this.svg = svg;
      console.log(root.descendants(), "tree data-> array data");
      const cell = svg
        .selectAll("g")
        .attr("transform", `translateX(${width / 2}`)
        .data(root.descendants())
        .join("g");
      // .attr("transform", d => `translate(${d.y0},${d.x0})`);
      console.log(cell, "g cell");
      // debugger;
      cell
        .append("rect")
        .attr("x", function(d) {
          // return d.y0 + ((d.y1 - d.y0) / width) * (d.y1 - d.y0);
          return d.y0;
        })
        .attr("y", function(d) {
          return d.x0;
        })
        // .attr("position", "relative")
        .attr("width", d => d.y1 - d.y0)
        .attr("height", d => d.x1 - d.x0)
        .attr("fill-opacity", 0.6)
        .attr(
          "fill",
          d =>
            // {
            // console.log(d);
            // if (!d.depth) return "#ccc";
            // // 所以总是跟随父亲的颜色
            // while (d.depth > 1) d = d.parent;
            // console.log(color(d.data.name), d.data.name, d.data.value);
            // return color(d.data.name);
            // }
            d.data.color || "#eee"
        )
        .on("click", zoom);
      function getPath(d) {
        let node = d;
        let path = [node.data];
        while (node.parent) {
          node = node.parent;
          path.push(node.data);
        }
        this.path = path
          .reverse()
          .map(item => item.name)
          .join("->");
      }
      var rect = svg.selectAll("rect");

      function zoom(d) {
        xScale.domain([d.y0, width]).range([d.depth ? 20 : 0, width]);
        yScale.domain([d.x0, d.x1]);

        rect
          .transition()
          .duration(750)
          .attr("x", function(d) {
            return xScale(d.y0);
          })
          .attr("y", function(d) {
            return yScale(d.x0);
          })
          .attr("width", function(d) {
            return xScale(d.y1) - xScale(d.y0);
          })
          .attr("height", function(d) {
            return yScale(d.x1) - yScale(d.x0);
          });
        text
          .transition()
          .duration(750)
          .attr("x", function(d) {
            return xScale(d.y0 + 4);
          })
          .attr("y", function(d) {
            return yScale(d.x0 + 13);
          });
      }
      const text = cell
        .filter(d => d.x1 - d.x0 > 16)
        .append("text")
        .attr("x", function(d) {
          return d.y0 + 4;
        })
        .attr("y", function(d) {
          return d.x0 + 13;
        });
      // .attr("x", 4)
      // .attr("y", 13);
      var textG = svg.selectAll("text");
      console.log(textG, "假text");
      console.log(text, "真实text");

      text.append("tspan").text(d => d.data.name);

      text
        .append("tspan")
        .attr("fill-opacity", 0.7)
        .text(d => ` ${format(d.value)}`);

      text.append("title").text(
        d =>
          `${d
            .ancestors()
            .map(d => d.data.name)
            .reverse()
            .join("/")}\n${format(d.value)}`
      );

      // return svg.node();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./svg.css";
.container {
  width: 100%;
  height: 500px;
}
</style>
