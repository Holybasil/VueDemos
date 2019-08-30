import * as d3 from "d3";
class holyNeo4j {
  constructor(selector, options = {}) {
    this.svg = null;
    this.nodes = null; // svg
    this.links = null;
    this.svgNodes = null;
    this.svgLinks = null;
    this.myLink = null;
    this.options = {
      arrowSize: 4,
      nodeRadius: 15,
      nodeTextColor: "#333",
      noseTextSize: "14px",
      nodeTextKey: "labels",
      linkColor: "#a5abb6",
      linkTextSize: "12px",
      linkKey: "id",
      linkTextRotate: false,
      linkTextKey: "type",
      linkTextMap: undefined,
      data: undefined
    };
    this.init(selector, options);
  }
  init(selector, options) {
    this.mergeOption(options);
    this.appendSVGGraph(selector);
    this.initSimulation();
    this.updateNode();
    this.updateLink();
    // this.initSimulation();
    // .force("x", d3.forceX())
    // .force("y", d3.forceY());
  }
  appendSVGGraph(selector) {
    const width = document.querySelector(selector).offsetWidth;
    const height = document.querySelector(selector).offsetHeight;
    this.svg = d3
      .select(selector)
      .append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    const realNodeArrKey = this.options.data.graph.nodes
      .map(node => node[this.options.linkKey])
      .sort((a, b) => a - b);
    console.log(realNodeArrKey, "realNodeArrKey");
    const linkNode = this.options.data.graph.relationships
      .map(link => [link.target, link.source])
      .flat()
      .sort((a, b) => a - b);
    console.log([...new Set(linkNode)]);
    this.nodes = this.options.data.graph.nodes.map(d => Object.create(d));
    this.links = this.options.data.graph.relationships
      .filter(d => {
        return d.source !== d.target;
      })
      .map(d => Object.create(d));
    // console.log(this.links, "links");
    this.nodeSvg = this.svg.append("g").attr("class", "nodes");
    this.linkSvg = this.svg.append("g").attr("class", "links");
  }
  initSimulation() {
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        "link",
        d3
          .forceLink(this.links)
          .id(d => d[this.options.linkKey])
          .distance(function() {
            return 200;
          })
      )

      .force("charge", d3.forceManyBody())
      .on("tick", () => {
        this.tickNode();
        this.tickLink();
      })
  }
  appendNode() {
    return this.nodeSvg
      .selectAll("g.node")
      .data(this.nodes)
      .join("g")
      .attr("class", "node")
      .on("click", d => {
        if (typeof this.options.onNodeClick === "function") {
          this.options.onNodeClick(d);
        }
      })
      .on("mouseenter", d => {
        if (typeof this.options.onNodeMouseenter === "function") {
          this.options.onNodeMouseenter(d);
        }
      })
      .on("mouseleave", d => {
        if (typeof this.options.onNodeMouseleave === "function") {
          this.options.onNodeMouseleave(d);
        }
      })
      .on("dblclick", d => {
        if (typeof this.options.onNodeDBClick === "function") {
          this.options.onNodeDBClick(d);
        } else {
          this.stickNode(d);
        }
      })
      .call(this.drag(this.simulation));
  }
  appendCircleToNode(node) {
    node
      .append("circle")
      .attr("r", this.options.nodeRadius)
      .attr("fill", this.color());
  }
  appendTextToNode(node) {
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", this.options.nodeTextSize)
      .attr("fill", this.options.nodeTextColor)
      .attr("pointer-events", "none")
      .attr("y", this.options.nodeRadius / 3)
      .text(d => {
        return d[this.options.nodeTextKey];
      });
  }
  updateNode() {
    const node = this.appendNode();
    this.appendCircleToNode(node);
    this.appendTextToNode(node);
  }
  appendLink() {
    return this.linkSvg
      .selectAll("g.link")
      .data(this.links)
      .join("g")
      .attr("class", "link");
    // .attr("stroke-width", d => Math.sqrt(d.value))
    // .attr("stroke", "#999")
  }
  // appendOutlineToLink(link) {
  //   return link
  //     .append("path")
  //     .attr("class", "outline")
  //     .attr("fill", "#a5abb6")
  //     .attr("stroke", "none");
  // }
  appendTextToLink(link) {
    link
      .append("text")
      .attr("class", "text")
      .attr("fill", "#000000")
      .attr("font-size", this.options.linkTextSize)
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .text(d => {
        return this.options.linkTextMap ? 
        this.options.linkTextMap[d[this.options.linkTextKey]] 
        : d[this.options.linkTextKey];
      });
  }
  appendLineToLink(link) {
    this.path = link
      .append("path")
      .attr("class", "path")
      .attr("fill", "#a5abb6")
      .attr("stroke", "none");
    // this.myLink = link.append("line").attr("stroke", "#999");
    // .attr("marker-mid", "url(#head)");
  }
  updateLink() {
    const link = this.appendLink();
    console.log(link, "mylink");
    // const relationship = appendRelationship(),
    this.appendTextToLink(link);
    this.appendLineToLink(link);
    // this.appendLineToLink(link);
  }
  // 固定node的位置
  stickNode(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  tickNode() {
    if (this.nodeSvg) {
      this.nodeSvg.selectAll("g.node").attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }
    // this.node.attr("transform", function(d) {
    //   return "translate(" + d.x + "," + d.y + ")";
    // });
  }
  tickLink() {
    if (this.linkSvg) {
      this.linkSvg.selectAll("g.link").attr("transform", d => {
        const angle = this.rotation(d.source, d.target);
        return (
          "translate(" +
          d.source.x +
          ", " +
          d.source.y +
          ") rotate(" +
          angle +
          ")"
        );
      });

      this.tickRelationshipsTexts();
      this.tickRelationshipsOutlines();
    }
  }
  tickRelationshipsOutlines() {
    const _this = this;
    this.linkSvg.selectAll("g.link").each(function(relationship) {
      const rel = d3.select(this);
      const outline = rel.select(".path");
      const text = rel.select(".text");
      // const bbox = text.node().getBBox();
      // const padding = 3;
      // debugger;
      outline.attr("d", d => {
        const center = { x: 0, y: 0 };
        const angle = _this.rotation(d.source, d.target);
        const textBoundingBox = text.node().getBBox();
        // debugger;
        if (!textBoundingBox) {
          console.log(textBoundingBox, "textBoundingBox");
        }
        const textPadding = 5;
        const u = _this.unitaryVector(d.source, d.target);
        const textMargin = {
          x:
            (d.target.x -
              d.source.x -
              (textBoundingBox.width + textPadding) * u.x) *
            0.5,
          y:
            (d.target.y -
              d.source.y -
              (textBoundingBox.width + textPadding) * u.y) *
            0.5
        };
        const n = _this.unitaryNormalVector(d.source, d.target);
        const rotatedPointA1 = _this.rotatePoint(
          center,
          {
            x: 0 + (_this.options.nodeRadius + 1) * u.x - n.x,
            y: 0 + (_this.options.nodeRadius + 1) * u.y - n.y
          },
          angle
        );
        const rotatedPointB1 = _this.rotatePoint(
          center,
          { x: textMargin.x - n.x, y: textMargin.y - n.y },
          angle
        );
        const rotatedPointC1 = _this.rotatePoint(
          center,
          { x: textMargin.x, y: textMargin.y },
          angle
        );
        const rotatedPointD1 = _this.rotatePoint(
          center,
          {
            x: 0 + (_this.options.nodeRadius + 1) * u.x,
            y: 0 + (_this.options.nodeRadius + 1) * u.y
          },
          angle
        );
        const rotatedPointA2 = _this.rotatePoint(
          center,
          {
            x: d.target.x - d.source.x - textMargin.x - n.x,
            y: d.target.y - d.source.y - textMargin.y - n.y
          },
          angle
        );
        const rotatedPointB2 = _this.rotatePoint(
          center,
          {
            x:
              d.target.x -
              d.source.x -
              (_this.options.nodeRadius + 1) * u.x -
              n.x -
              u.x * _this.options.arrowSize,
            y:
              d.target.y -
              d.source.y -
              (_this.options.nodeRadius + 1) * u.y -
              n.y -
              u.y * _this.options.arrowSize
          },
          angle
        );
        const rotatedPointC2 = _this.rotatePoint(
          center,
          {
            x:
              d.target.x -
              d.source.x -
              (_this.options.nodeRadius + 1) * u.x -
              n.x +
              (n.x - u.x) * _this.options.arrowSize,
            y:
              d.target.y -
              d.source.y -
              (_this.options.nodeRadius + 1) * u.y -
              n.y +
              (n.y - u.y) * _this.options.arrowSize
          },
          angle
        );
        const rotatedPointD2 = _this.rotatePoint(
          center,
          {
            x: d.target.x - d.source.x - (_this.options.nodeRadius + 1) * u.x,
            y: d.target.y - d.source.y - (_this.options.nodeRadius + 1) * u.y
          },
          angle
        );
        const rotatedPointE2 = _this.rotatePoint(
          center,
          {
            x:
              d.target.x -
              d.source.x -
              (_this.options.nodeRadius + 1) * u.x +
              (-n.x - u.x) * _this.options.arrowSize,
            y:
              d.target.y -
              d.source.y -
              (_this.options.nodeRadius + 1) * u.y +
              (-n.y - u.y) * _this.options.arrowSize
          },
          angle
        );
        const rotatedPointF2 = _this.rotatePoint(
          center,
          {
            x:
              d.target.x -
              d.source.x -
              (_this.options.nodeRadius + 1) * u.x -
              u.x * _this.options.arrowSize,
            y:
              d.target.y -
              d.source.y -
              (_this.options.nodeRadius + 1) * u.y -
              u.y * _this.options.arrowSize
          },
          angle
        );
        const rotatedPointG2 = _this.rotatePoint(
          center,
          {
            x: d.target.x - d.source.x - textMargin.x,
            y: d.target.y - d.source.y - textMargin.y
          },
          angle
        );
        // console.log(
        //   `M ${rotatedPointA1.x} ${rotatedPointA1.y} L ${rotatedPointB1.x} ${
        //     rotatedPointB1.y
        //   } L ${rotatedPointC1.x} ${rotatedPointC1.y} L ${rotatedPointD1.x} ${
        //     rotatedPointD1.y
        //   } Z M ${rotatedPointA2.x} ${rotatedPointA2.y} L ${rotatedPointB2.x} ${
        //     rotatedPointB2.y
        //   } L ${rotatedPointC2.x} ${rotatedPointC2.y} L ${rotatedPointD2.x} ${
        //     rotatedPointD2.y
        //   } L ${rotatedPointE2.x} ${rotatedPointE2.y} L ${rotatedPointF2.x} ${
        //     rotatedPointF2.y
        //   } L ${rotatedPointG2.x} ${rotatedPointG2.y} Z`
        // );
        return `M ${rotatedPointA1.x} ${rotatedPointA1.y} L ${
          rotatedPointB1.x
        } ${rotatedPointB1.y} L ${rotatedPointC1.x} ${rotatedPointC1.y} L ${
          rotatedPointD1.x
        } ${rotatedPointD1.y} Z M ${rotatedPointA2.x} ${rotatedPointA2.y} L ${
          rotatedPointB2.x
        } ${rotatedPointB2.y} L ${rotatedPointC2.x} ${rotatedPointC2.y} L ${
          rotatedPointD2.x
        } ${rotatedPointD2.y} L ${rotatedPointE2.x} ${rotatedPointE2.y} L ${
          rotatedPointF2.x
        } ${rotatedPointF2.y} L ${rotatedPointG2.x} ${rotatedPointG2.y} Z`;
      });
    });
  }
  tickRelationshipsTexts() {
    // debugger
    this.linkSvg.selectAll(".text").attr("transform", d => {
      // debugger
      const angle = (this.rotation(d.source, d.target) + 360) % 360;
      const mirror = angle > 90 && angle < 270;
      const center = { x: 0, y: 0 };
      const n = this.unitaryNormalVector(d.source, d.target);
      const nWeight = mirror ? 2 : -3;
      const point = {
        x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight,
        y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight
      };
      const rotatedPoint = this.rotatePoint(center, point, angle);
      return (
        "translate(" +
        rotatedPoint.x +
        ", " +
        rotatedPoint.y +
        ") rotate(" +
        (mirror ? 180 : 0) +
        ")"
      );
    });
  }
  color() {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.id);
  }
  drag(simulation) {
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
  rotate(cx, cy, x, y, angle) {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = cos * (x - cx) + sin * (y - cy) + cx;
    const ny = cos * (y - cy) - sin * (x - cx) + cy;

    return { x: nx, y: ny };
  }
  rotatePoint(c, p, angle) {
    return this.rotate(c.x, c.y, p.x, p.y, angle);
  }
  rotation(source, target) {
    return (
      (Math.atan2(target.y - source.y, target.x - source.x) * 180) / Math.PI
    );
  }
  unitaryVector(source, target, newLength) {
    const length =
      Math.sqrt(
        Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
      ) / Math.sqrt(newLength || 1);

    return {
      x: (target.x - source.x) / length,
      y: (target.y - source.y) / length
    };
  }
  unitaryNormalVector(source, target, newLength) {
    const center = { x: 0, y: 0 },
      vector = this.unitaryVector(source, target, newLength);

    return this.rotatePoint(center, vector, 90);
  }

  mergeOption(options) {
    this.options = {
      ...this.options,
      ...options
    };
  }
}

export default holyNeo4j;
