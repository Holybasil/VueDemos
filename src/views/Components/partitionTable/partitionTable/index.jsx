
export default {
  props: {
    // 表格的数据
    data: {
      type: Array
    },
    // 是否斑马纹
    stripe: {
      type: Boolean,
      default: false
    },
    // 斑马纹的深度
    deep: {
      type: Number,
      default: 1
    },
    // 值为几列
    column: {
      type: Number,
      default: 1
    },
    // 文字状态
    align: {
      type: String,
      default: 'left',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['left', 'center', 'right'].includes(value)
      }
    }
  },
  render () {
    console.log(this.$slots.default, 'partitionTable')
    return (

      <div className="PartitionTable">
        {
          this.$slots.default
        }
      </div>
    )
  }
}
