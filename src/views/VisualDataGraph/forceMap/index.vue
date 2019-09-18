<template>
  <!-- <div class="forceMap"> -->
  <div class="forceMapPage">
    <el-button @click="refresh" class="refresh">刷新</el-button>
    <div class="forceMap" ref="forceMap"></div>
    <VueDraggableResizable :parent="true" :w="400">
      <div class="panel" v-show="isPanelShow">
        <div class="name">
          <span>{{ property.name || "???" }}</span>
          <span class="close" @click="isPanelShow = false">X</span>
        </div>
        <div class="content">
          <div>
            <span>身份证号：</span>
            <span>{{ property.idCard }}</span>
          </div>
          <div>
            <span>手机号：</span>
            <span>{{ property.phone }}</span>
          </div>
          <div>
            <span>邮箱：</span>
            <span>{{ property.email }}</span>
          </div>
          <div>
            <span>首次时间：</span>
            <span>{{ property.timestamp }}</span>
          </div>
          <div>
            <span>关联进件号：</span>
            <span>{{ property.loanIds }}</span>
          </div>
        </div>
      </div>
    </VueDraggableResizable>
  </div>

  <!-- </div> -->
</template>

<script>
// let data;
// nodes中的group 是为了表示哪些node属于一个颜色
// link中的value 是为了表示连线的粗细
// import data from "./data";
import data from "./githubData";
import moreData from "./githubMoreData";
import * as d3 from "d3";
// import HolyNeo4j from "holy-relationship-map";
import VueDraggableResizable from "vue-draggable-resizable";

import HolyNeo4j from "./holyNeo4j";
export default {
  data() {
    return {
      svg: null,
      isPanelShow: false,
      property: {}
    };
  },
  components: { VueDraggableResizable },
  created() {
    // console.log(data);
  },
  mounted() {
    this.init();
    // d3.select(window).on("resize", this.updateWindow);
  },
  methods: {
    async init() {
      // const res = await this.$axios.post(
      //   // "/data.json"
      //   "https://www.easy-mock.com/mock/5d65f13bde0085286bedfbe7/VueDemos/getForceMapOther"
      // );
      // // console.log(data, "eee");
      // data = res.data.data;
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
        },
        onLinkClick: d => {
          if (!this.isPanelShow) {
            this.isPanelShow = true;
          }
          this.property = { ...d.properties };
        }
      });
    },
    async refresh() {
      const res = await this.$axios.post(
        // "/data.json"
        "https://www.easy-mock.com/mock/5d65f13bde0085286bedfbe7/VueDemos/getMiniForceMap"
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
    },
    updateWindow() {
      const width = this.$refs.forceMap.offsetWidth;
      const height = this.$refs.forceMap.offsetHeight;

      this.svg.attr("width", width).attr("height", height);
      this.simulation.force("center", d3.forceCenter(width / 2, height / 2));
    },
    async getMoreData() {
      // const res = await this.$axios.post(
      //   // "/data.json"
      //   "https://www.easy-mock.com/mock/5d65f13bde0085286bedfbe7/VueDemos/getMoreForceData"
      // );
      // console.log(res.data);

      // const { nodes, links } = res.data.data;
      // const nodes = moreData.nodes.map(d => Object.create(d));
      // const links = moreData.links
      //   .filter(d => {
      //     return d.source !== d.target;
      //   })
      //   .map(d => Object.create(d));
      this.svg.updateGraph(moreData);
    }
  }
};
</script>

<style lang="scss" scoped>
.forceMapPage,
.forceMap {
  width: 100%;
  height: 100%;
}
.refresh {
  position: absolute;
  z-index: 99;
}
.forceMapPage {
  position: relative;
  .panel {
    // position: absolute;
    // top: 20px;
    // left: 20px;
    width: 400px;
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
<style lang="scss">
svg {
  cursor: move;
}
g.node,
g.link {
  cursor: pointer;
}
g.node text {
  stroke: none;
  stroke-width: unset;
  // background-color: aqua;
}
g.node circle {
  /* stroke: #ff0000; */
  /* stroke-width: 2; */
  /* filter: url(#shadow); */
  transition: all 0.2s ease-in;
}
g.selected circle {
  /* transform: scale(1.4); */
  // stroke-width: 5;
  // stroke: #d1d3d7;
  // fill: none;
}
/* g.link .path {
  position: relative;
  z-index: -99;
} */
g.link text textPath {
  /* background-color: #fff; */
}
</style>
