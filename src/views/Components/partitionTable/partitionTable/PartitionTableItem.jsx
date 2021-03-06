import "./PartitionTableItem.scss";
const componentName = "PartitionTableItem";
export default {
  name: componentName,
  data() {
    return {
      // i: 0
    };
  },
  props: {
    label: {
      type: String
    }
  },
  created() {
    console.log(this.partitionTable.spanColumn, "table");
  },
  methods: {
    renderEmptyValueItem(label) {
      return (
        <div class="emptyValueItem">
          <span>{label}</span>
          <span />
        </div>
      );
    },
    renderEmptyItem() {
      return <div class="emptyItem" />;
    },
    renderTextItem(label, value) {
      return (
        <div class="textItem">
          <span>{label}</span>
          <span>{value}</span>
        </div>
      );
    },
    renderItem(label, vnodeList) {
      return (
        <div class="item">
          <span>{label}</span>
          {vnodeList}
        </div>
      );
    },
    mapSlotsDefaultToView() {
      if (!this.$slots.default) {
        if (this.label) {
          // debugger
          return this.renderEmptyValueItem(this.label);
        }
        return this.renderEmptyItem();
      } else {
        const [...vnodeList] = this.$slots.default;
        // 属于纯文本
        if (vnodeList.length === 1 && vnodeList[0].text) {
          return this.renderTextItem(this.label, vnodeList[0].text);
        }
        return this.renderItem(this.label, vnodeList);
      }
    }
  },
  inject: ["partitionTable"],
  render() {
    // const { i } = this
    // console.log(this.$slots.default, this.label, '$slots.default')
    return <div class="partitionTableItem">{this.mapSlotsDefaultToView()}</div>;
  }
};
