<template>
  <!-- <div class="forceMap"> -->
  <div class="forceMapPage">
    <div class="forceMap" ref="forceMap"></div>
    <div class="panel" v-show="isPanelShow">
      <div class="name">
        <span>{{ property.name || "???" }}</span>
        <span class="close" @click="isPanelShow = false">X</span>
      </div>
      <div class="content">
        <div>
          <span>身份证号：</span><span>{{ property.idCard }}</span>
        </div>
        <div>
          <span>手机号：</span><span>{{ property.phone }}</span>
        </div>
        <div>
          <span>邮箱：</span><span>{{ property.email }}</span>
        </div>
        <div>
          <span>首次时间：</span><span>{{ property.timestamp }}</span>
        </div>
        <div>
          <span>关联进件号：</span><span>{{ property.loanIds }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->
</template>

<script>
let data;
// nodes中的group 是为了表示哪些node属于一个颜色
// link中的value 是为了表示连线的粗细
// import data from "./data";
import * as d3 from "d3";
import HolyNeo4j from "./holyNeo4j";
export default {
  data() {
    return {
      svg: null,
      isPanelShow: false,
      property: {}
    };
  },
  created() {
    // console.log(data);
  },
  async mounted() {
    const res = await this.$axios.post(
      // "/data.json"
      "https://www.easy-mock.com/mock/5d65f13bde0085286bedfbe7/VueDemos/getForceMapOther"
    );
    // console.log(data, "eee");
    data = res.data.data;
    // this.createForceMap();
    this.svg = new HolyNeo4j(".forceMap", {
      data,
      onNodeClick: d => {
        if (!this.isPanelShow) {
          this.isPanelShow = true;
        }
        this.property = { ...d.properties };
      },
      onNodeDBClick: d => {
        console.log(d);
        this.getMoreData();
      }
    });
    // d3.select(window).on("resize", this.updateWindow);
  },
  methods: {
    updateWindow() {
      const width = this.$refs.forceMap.offsetWidth;
      const height = this.$refs.forceMap.offsetHeight;

      this.svg.attr("width", width).attr("height", height);
      this.simulation.force("center", d3.forceCenter(width / 2, height / 2));
    },
    async getMoreData() {
      const res = await this.$axios.post(
        // "/data.json"
        "https://www.easy-mock.com/mock/5d65f13bde0085286bedfbe7/VueDemos/getMoreForceData"
      );
      console.log(res.data);
      // const { nodes, links } = res.data.data;
      const nodes = res.data.data.nodes.map(d => Object.create(d));
      const links = res.data.data.relationships
        .filter(d => {
          return d.source !== d.target;
        })
        .map(d => Object.create(d));
      // const data = {
      //   results: [
      //     {
      //       data: [
      //         {
      //           graph: {}
      //         }
      //       ]
      //     }
      //   ]
      // };
      // data.results[0].data[0].graph = res.data.data;
      // console.log(data, "参数data");
      // const { nodes, links } = this.neo4jDataToD3Data(data);
      // console.log(nodes, links, '结果参数')
      this.svg.updateNodeAndLink(nodes, links);
    },
    contains(array, id) {
      const filter = array.filter(elem => elem.id === id);

      return filter.length > 0;
    },
    neo4jDataToD3Data(data) {
      var graph = {
        nodes: [],
        links: []
      };

      data.results.forEach(result => {
        result.data.forEach(data => {
          data.graph.nodes.forEach(node => {
            if (!this.contains(graph.nodes, node.id)) {
              graph.nodes.push(node);
            }
          });

          data.graph.relationships.forEach(relationship => {
            // relationship.source = relationship.startNode;
            // relationship.target = relationship.endNode;
            graph.links.push(relationship);
          });

          data.graph.relationships.sort(function(a, b) {
            if (a.source > b.source) {
              return 1;
            } else if (a.source < b.source) {
              return -1;
            } else {
              if (a.target > b.target) {
                return 1;
              }

              if (a.target < b.target) {
                return -1;
              } else {
                return 0;
              }
            }
          });

          for (var i = 0; i < data.graph.relationships.length; i++) {
            if (
              i !== 0 &&
              data.graph.relationships[i].source ===
                data.graph.relationships[i - 1].source &&
              data.graph.relationships[i].target ===
                data.graph.relationships[i - 1].target
            ) {
              data.graph.relationships[i].linknum =
                data.graph.relationships[i - 1].linknum + 1;
            } else {
              data.graph.relationships[i].linknum = 1;
            }
          }
        });
      });

      return graph;
    },
    createForceMap() {
      const width = this.$refs.forceMap.offsetWidth;
      const height = this.$refs.forceMap.offsetHeight;
      // const links = data.graph.links;
      // const nodes = data.graph.nodes;
      const links = data.graph.relationships.map(d => Object.create(d));
      const nodes = data.graph.nodes.map(d => Object.create(d));
      // const nodes = data.nodes;
      // debugger;
      // console.log(nodes, " data nodes");
      // console.log(d3.forceSimulation(nodes), "forceSimulation");
      this.simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id(d => d.id)
            .distance(function() {
              return 200;
            })
          // .strength(link => {
          //   return 1 / Math.max(d3.count(link.source), d3.count(link.target));
          // })
        )

        .force("charge", d3.forceManyBody())
        // .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      this.svg = d3
        .select(".forceMap")
        .append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

      const link = this.svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("g.line")
        .data(links)
        .join("g")
        .attr("class", "line")
        // .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("stroke", "#999");

      // new
      // const linkDefs = link
      //   // .selectAll("defs")
      //   // .data()
      //   // .enter()
      //   .append("defs");

      // const linkPattern = linkDefs
      //   .append("marker")
      //   .attr("id", "head")
      //   .attr("linkDefs", "auto")
      //   .attr("markerWidth", 2)
      //   .attr("markerHeight", 4)
      //   .attr("refX", "0.1")
      //   .attr("refY", "2");

      // linkPattern
      //   .append("path")
      //   .attr("d", "M 0 0 L 10 5 L 0 10 z")
      //   // .attr("d", "M0,0 V4 L2,2 Z")
      //   .attr("fill", "#f00");

      const mylink = link
        .append("line")
        .attr("stroke", "#999")
        .attr("marker-mid", "url(#head)");

      const node = this.svg
        .append("g")
        // .attr("stroke", "#fff")
        // .attr("stroke-width", 1.5)
        .selectAll("g.node")
        .data(nodes)
        .join("g")
        .append("g")
        .attr("class", "node")
        .call(drag(this.simulation))
        .on("mouseenter", d => {
          // console.log(d.id, "mouseenter");
          const aa = data.graph.relationships
            .filter(link => {
              return link.source === d.id || link.target === d.id;
            })
            .map(link => (link.source === d.id ? link.target : link.source));
          // console.log(aa, "相关的节点");
          d3.selectAll("g.node")
            .filter(d => aa.includes(d.id))
            .attr("class", "selected");
        })
        .on("mouseleave", d => {
          const aa = data.graph.relationships
            .filter(link => {
              return link.source === d.id || link.target === d.id;
            })
            .map(link => (link.source === d.id ? link.target : link.source));
          // console.log(aa, "相关的节点");
          d3.selectAll("g.node")
            .filter(d => aa.includes(d.id))
            .attr("class", "node");
        })
        .on("dblclick", function(d) {
          stickNode(d);
        });
      // console.log(node, "node");

      function stickNode(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
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
        .attr("x", -15)
        .attr("y", -15)
        .attr("height", "30")
        .attr("width", "30");

      pattern
        .append("image")
        .attr(
          "xlink:href",
          "http://5b0988e595225.cdn.sohucs.com/images/20190725/9af6a5c7aaad426a8926f7bd4a93f41a.jpeg"
        )

        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "30")
        .attr("height", "30");

      node
        .append("circle")
        .attr("r", 15)
        // .attr("class", "image")
        .attr("width", "30")
        .attr("height", "30")
        .attr("fill", "url(#image)")
        .on("mouseenter", function() {
          // select element in current context
          // console.log("xxix");
          d3.select(this)
            // .transition()
            .attr("class", "image");
          // .attr("transform", "scale(1.5)")
          // .attr("transform", () => {
          //   return "translate(-5, -5) scale(1.5)";
          // });
          // .attr("cx", function() {
          //   return -10;
          // })
          // .attr("cy", function() {
          //   return -10;
          // })
          // .attr("width", "50")
          // .attr("height", "50")
        })
        // set back
        .on("mouseleave", function() {
          d3.select(this)
            // .transition()
            .attr("class", "");
          // .attr("transform", "scale(1)");
        });

      node
        .append("text")
        // .attr("dx", 12)
        // .attr("dy", ".35em")
        .attr("fill", "#333")
        .text(function(d) {
          return d.labels;
        });
      // node.append("title").text(d => d.id);

      this.simulation.on("tick", () => {
        mylink
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
          // stickNode(d);
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          // 注释掉可以拖拽时其他节点位置不变
          // d.fx = null;
          // d.fy = null;
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
.forceMapPage,
.forceMap {
  width: 100%;
  height: 100%;
}

.forceMapPage {
  position: relative;
  .panel {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 30%;
    // height: 50%;
    padding: 10px;
    // background-color: rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    color: #333;
    .name {
      // line-height: 2em;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      line-height: 2em;
      justify-content: space-between;
      .close {
        cursor: pointer;
      }
    }
    .content {
      pointer-events: none;
      div {
        line-height: 1.8em;
      }
    }
  }
}

</style>
<style>
g.node{
  cursor: pointer;
}
g.node circle{
  /* stroke: #ff0000; */
  /* stroke-width: 2; */
  /* filter: url(#shadow); */
  transition: all 0.2s ease-in;
}
g.selected circle{
  transform: scale(1.4);
}
g.link text{
  
}
</style>
