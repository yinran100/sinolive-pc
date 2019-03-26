<template>
    <div class="wrapper">
        <el-row
            type="flex"
            v-for="(rowData,index) in colData"
            :key="index"
        >
            <el-col
                :span="spanNum"
                v-for="item in rowData"
                :key="item.Id"
            >
                <component
                    :is="componentName"
                    :item="item"
                ></component>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import LiveItem from "./LiveItem";
import IndexLiveItem from "./IndexLiveItem";
export default {
  name: "TableData",
  components: { LiveItem, IndexLiveItem },
  props: {
    data: { type: Array, default: [] },
    colNum: { type: Number, default: 4 },
    componentName: { type: String, required: true }
  },
  computed: {
    colData() {
      let colData = [];
      for (
        let i = 0, row = Math.ceil(this.data.length / this.colNum);
        i < row;
        i++
      ) {
        colData.push(this.data.slice(i * this.colNum, (i + 1) * this.colNum));
      }
      return colData;
    },
    spanNum() {
      return 24 / this.colNum;
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrapper
    margin-bottom: 40px

    .el-row
        margin-top: 40px
</style>