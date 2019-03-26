<template>
  <div class="index-wrapper">
    <el-carousel
      trigger="click"
      :autoplay="true"
      :interval="5000"
      height="300px"
      ref="carousel"
    >
      <el-carousel-item
        v-for="item in headdata"
        :key="item.Id"
      >
        <index-swiper
          :liveInfo="item"
          @click.native="()=>$router.push(`/liveroom/${item.Id}`)"
        ></index-swiper>
      </el-carousel-item>
    </el-carousel>
    <div class="recommend-wrapper">
      <div class="recommend-title">热门推荐</div>
      <table-data
        :data="hotdata"
        :colNum="colnum"
        componentName="IndexLiveItem"
      >
      </table-data>

    </div>
  </div>
</template>

<script>
import { getIndexInfo } from "@/api/api";
import TableData from "@/components/TableData";
import IndexSwiper from "./components/IndexSwiper";
export default {
  name: "index",
  components: {
    TableData,
    IndexSwiper
  },
  props: { clientWidth: { type: Number, default: 1920 } },
  data() {
    return {
      headdata: [],
      viewdata: [],
      hotdata: [],
      activeIndex: 0
    };
  },
  computed: {
    colnum() {
      return this.clientWidth <= 758 ? 2 : 4;
    }
  },
  created() {
    this.getIndexInfo();
  },
  methods: {
    getIndexInfo() {
      getIndexInfo().then(
        res => {
          this.hotdata = res.hotdata;
          this.headdata = res.headdata;
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.index-wrapper
  margin: 20px 0 0

  .el-carousel
    margin: 0 10px

    .el-carousel__item
      background-color: #F4F4F4

  .recommend-wrapper
    margin-top: 10px

    .recommend-title
      font-size: 28px
      text-align: center
      margin: 0 10px
      line-height: 2
      border-bottom: solid 4px #e6e6e6
</style>
