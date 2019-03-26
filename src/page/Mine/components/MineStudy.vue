<template>
  <el-card class="study-wrapper">
    <ul
      class="study-list"
      v-if="liveList.length!=0"
    >
      <li
        class="study-item"
        v-for="item in liveList"
        :key="item.Id"
      >
        <router-link
          tag="div"
          class="live-cover"
          :to="`/liveroom/${item.Id}`"
        ><img
            class="live-img"
            :src="item.Headpic"
            alt=""
          ></router-link>
        <div class="live-info">
          <router-link
            class="live-name"
            :to="`/liveroom/${item.Id}`"
          >{{ item.Name }}</router-link>
          <div class="live-intro">简介：{{ item.Subtitle }}</div>
          <div class="live-bottom clearfix">
            <div class="hotViewNum"><span><i class="iconfont">&#xe7b3;</i> {{ item.Views }} </span><span><i class="iconfont">&#xe870;</i>{{ item.vote }}</span></div>
            <div class="live-time">开播时间：<span class="time">{{ item.Begindate*1000|timeMoment }}</span></div>
          </div>
        </div>
      </li>
    </ul>
    <el-alert
      v-else
      title="没有最近学习的数据"
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
  </el-card>
</template>

<script>
import { getView } from "@/api/api";
export default {
  name: "MineStudy",
  data() {
    return {
      page: 1,
      offset: 10,
      liveList: [],
      noMoreData: false,
      keywords: ""
    };
  },
  created() {
    this.loadLiveList();
  },
  methods: {
    loadLiveList() {
      getView({
        p: this.page,
        offset: this.offset,
        keywords: this.keywords
      }).then(res => {
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
              Begindate,
              Views,
              vote
            }) => {
              return {
                Id,
                Name,
                Screenshot,
                Headpic,
                Subtitle,
                Begindate,
                Views,
                vote
              };
            }
          )
        );
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.study-wrapper
  background-color: #fff
  padding: 20px 30px

  .study-list
    padding: 0 0

    .study-item
      display: flex
      padding: 10px 0

      &:nth-last-child(n+2)
        border-bottom: 1px solid #DADADA

      .live-cover
        height: 120px
        width: 200px
        margin-right: 20px
        background-color: #dfdfdf
        cursor: pointer

        .live-img
          height: 100%
          width: 100%

      .live-info
        flex: 1

        .live-name
          font-size: 18px
          font-weight: 500
          color: #3f3f3f
          margin-bottom: 5px

          &:hover
            color: #2d8cf0

        .live-intro
          color: #999
          font-size: 14px
          line-height: 1.5
          min-height: 63px

        .live-bottom
          margin-top: 5px
          color: #999
          font-size: 13px

          .hotViewNum
            float: left

            span+span
              margin-left: 10px

          .live-time
            float: right

  .el-alert
    margin: 10px 0
</style>
