<template>
  <div class="live-wrapper">
    <table-data
      :data="liveList"
      :colNum="colnum"
      componentName="LiveItem"
    >
    </table-data>
    <el-alert
      v-if="liveList.length==0"
      title="当前没有直播"
      type="info"
      :closable="false"
      center
      show-icon
    >
    </el-alert>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="20">
        <el-button
          v-show="!noMoreData"
          style="width:100%"
          @click="loadLiveList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLiveList } from "@/api/api";
import TableData from "@/components/TableData";
export default {
  name: "LiveCenter",
  components: {
    TableData
  },
  props: { clientWidth: { type: Number, default: 1920 } },
  data() {
    return {
      page: 1,
      offset: 12,
      keywords: "",
      noMoreData: false,
      amount: 30,
      liveList: []
    };
  },
  computed: {
    colnum() {
      return this.clientWidth <= 758 ? 2 : 4;
    }
  },
  created() {
    // this.getLiveAmount();
    this.loadLiveList();
  },
  methods: {
    pageChange(val) {
      this.page = val;
      this.loadLiveList();
    },

    loadLiveList() {
      getLiveList({
        p: this.page,
        offset: this.offset,
        keywords: this.keywords
      }).then(
        res => {
          if (res.data && res.data.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.liveList = this.liveList.concat(
            res.data.map(
              ({
                Id,
                Name,
                Screenshot,
                Headpic,
                Subtitle,
                influence,
                Updated,
                Begindate,
                Views,
                Livestate
              }) => {
                return {
                  Id,
                  Name,
                  Screenshot,
                  Headpic,
                  Subtitle: Subtitle.trim(),
                  Begindate,
                  Updated,
                  Views,
                  Livestate
                };
              }
            )
          );
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-alert
  margin: 10px 0
</style>
