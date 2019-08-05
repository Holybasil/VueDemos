
export default {
  data () {
    return {
      deep: 1,
      spanColumn: 0
    }
  },
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
    // deep: {
    //   type: Number,
    //   default: 1
    // },
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
  created () {
    this.getGridSpanFromData(this.$slots.default)
    // if(this.column)
    // deep 2 column 2
    this.spanColumn = 2 * this.column + this.deep - 1
    console.log(this.deep, 'deep')
  },
  methods: {
    haveComponent (children) {
      return children.filter(child => {
        return child.tag
      }).length
    },
    getGridSpanFromData (data) {
      // debugger
      let nextData = []
      if (!data.length) return
      for (let i = 0; i < data.length; i++) {
        if (data[i].componentOptions && data[i].componentOptions.children && this.haveComponent(data[i].componentOptions.children)) {
          nextData = [...nextData, ...data[i].componentOptions.children]
        }
      }
      if (nextData.length) {
        this.deep++
        nextData.forEach((child) => {
          child.deep = this.deep
        })
      }
      this.getGridSpanFromData(nextData)
    },
    getDataItemDeep (item) {
      let deep = 0
      if (item.children) {
        deep++
        // this.getDataItemDeep()
        item.children.forEach((child) => {
          this.getDataItemDeep(child)
        })
      }
      return deep
    }
    // getPartitionTableItem(){

    // }
  },
  provide () {
    return {
      partitionTable: this
    }
  },
  render () {
    console.log(this.$slots.default, 'partitionTable')
    // const { data } = this
    return (

      <div class="PartitionTable">
        {
          this.$slots.default
        }
      </div>
      // <div className="PartitionTable">
      //   {
      //     data.map((item, index) => {
      //       this.getPartitionTableItem(item)
      //     })
      //   }
      // </div>
    )
  }
}
