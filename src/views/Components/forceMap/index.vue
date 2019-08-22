<template>
  <!-- <div class="forceMap"> -->
  <div class="forceMap" ref="forceMap"></div>
  <!-- </div> -->
</template>

<script>
// let data;
// nodes中的group 是为了表示哪些node属于一个颜色
// link中的value 是为了表示连线的粗细
import data from "./data";
import * as d3 from "d3";
export default {
  data() {
    return {
      svg: null
    };
  },
  created() {
    console.log(data);
  },
  async mounted() {
    // data = await d3.json(
    //   // "/data.json"
    //   "https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json"
    // );
    this.createForceMap();
    // d3.select(window).on("resize", this.updateWindow);
  },
  methods: {
    updateWindow() {
      const width = this.$refs.forceMap.offsetWidth;
      const height = this.$refs.forceMap.offsetHeight;

      this.svg.attr("width", width).attr("height", height);
      this.simulation.force("center", d3.forceCenter(width / 2, height / 2));
    },
    createForceMap() {
      const width = this.$refs.forceMap.offsetWidth;
      const height = this.$refs.forceMap.offsetHeight;
      const links = data.links.map(d => Object.create(d));
      const nodes = data.nodes.map(d => Object.create(d));
      // const nodes = data.nodes;
      debugger;
      console.log(nodes, " data nodes");
      console.log(d3.forceSimulation(nodes), "forceSimulation");
      this.simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      this.svg = d3
        .select(".forceMap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const link = this.svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("stroke", "#999");

      // const image =
      // const link = this.svg
      //   .selectAll(".link")
      //   .data(links)
      //   .enter()
      //   .append("line")
      //   .attr("class", "link");
      const node = this.svg
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("g.node")
        .data(nodes)
        .join("g")
        .append("g")
        .attr("class", "node")
        .call(drag(this.simulation));
      console.log(node, "node");

      // const pattern = d3
      //   .create("defs")
      //   .append("pattern")
      //   .attr("patternUnits", "userSpaceOnUse")
      //   .attr("height", "30")
      //   .attr("width", 30);
      // const image = pattern
      //   .append("image")
      //   .attr(
      //     "xlink:href",
      //     "http://5b0988e595225.cdn.sohucs.com/images/20190725/9af6a5c7aaad426a8926f7bd4a93f41a.jpeg"
      //   )
      //   .attr("x", -15)
      //   .attr("y", -15)
      //   .attr("width", 30)
      //   .attr("height", 30);
      const defs = node
        // .selectAll("defs")
        // .data()
        // .enter()
        .append("defs");
      // .append("");
      const pattern = defs
        .append("pattern")
        .attr("id", "image")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("x", "0")
        .attr("y", "0")
        .attr("height", "30")
        .attr("width", "30");

      pattern
        .append("image")
        .attr(
          "xlink:href",
          "http://5b0988e595225.cdn.sohucs.com/images/20190725/9af6a5c7aaad426a8926f7bd4a93f41a.jpeg"
        )
        // .attr("x", -15)
        // .attr("y", -15)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "30")
        .attr("height", "30");
      node
        .append("circle")
        .attr("r", 15)
        .attr("cx", 15)
        .attr("cy", 15)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill", "url(#image)");
      // node
      //   .append("image")
      //   .attr(
      //     "xlink:href",
      //     "http://5b0988e595225.cdn.sohucs.com/images/20190725/9af6a5c7aaad426a8926f7bd4a93f41a.jpeg"
      //   )
      //   .attr("x", -15)
      //   .attr("y", -15)
      //   .attr("width", 30)
      //   .attr("height", 30);

      // node
      //   .append("text")
      //   .attr("dx", 12)
      //   .attr("dy", ".35em")
      //   .text(function(d) {
      //     return d.name;
      //   });
      node.append("title").text(d => d.id);

      this.simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
        // node.attr("cx", d => d.x).attr("cy", d => d.y);
      });
      function drag(simulation) {
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }
      function color() {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
      }
      // invalidation.then(() => simulation.stop());

      // return svg.node();
    }
    // drag: simulation => {},
    // color: () => {}
  }
};
</script>

<style lang="scss" scoped>
.forceMap {
  width: 100%;
  height: 100%;
}
</style>
