<template>
  <div>
    <div class="rank-header"><img
        src="@/assets/images/rank-header.png"
        alt=""
      ></div>
    <ul
      class="rank-list"
      v-if="rankList.length!=0"
    >
      <li
        class="rank-item"
        v-for="(item,index) in rankList"
        :key="item.userId"
      >
        <div class="num">
          <img
            :src="numImg[index]"
            alt=""
            v-if="index<3"
          >
          <p v-else>{{index+1}}</p>
        </div>
        <div
          class="avatar-wrapper"
          :class="classObjec(index)"
        >
          <img
            class="photo-img"
            :src="item.avatar"
          >
          <div
            class="num-text"
            v-if="index<3"
          >No.{{index+1}}</div>
        </div>
        <div class="rank-info ellipsis">
          <div class="name ellipsis">{{item.nickName}}</div>
          <div class="date">上次学习 {{item.endWatchTime*1000|timeMoment}}</div>
        </div>
        <div
          class="schedule"
          :style="{color:item.schedule==100?'#01B137':'#FA4E1F'}"
        >{{item.schedule==100?'已完成':item.schedule+'%'}}</div>
      </li>
    </ul>
    <el-alert
      v-else
      title="当前没有排名"
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
          @click="loadRankList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTaskRanks, getAmount } from "@/api/api";
export default {
  props: {
    taskId: String
  },
  data() {
    return {
      page: 1,
      offset: 10,
      tips: "",
      rankList: [],
      noMoreData: false,
      numImg: [
        require("@/assets/images/first.png"),
        require("@/assets/images/second.png"),
        require("@/assets/images/third.png")
      ]
    };
  },
  created() {
    this.loadRankList();
  },
  methods: {
    pageChange(val) {
      this.page = val;
      this.loadRankList();
    },
    loadRankList() {
      getTaskRanks({
        taskId: this.taskId,
        page: this.page,
        offset: this.offset
      }).then(
        res => {
          if (res.data && res.data.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.rankList = this.rankList.concat(res.data);
        },
        e => this.showMessage(e.data.message)
      );
    },
    classObjec(index) {
      if (index == 0) return "top1";
      else if (index == 1) return "top2";
      else if (index == 2) return "top3";
      else return "";
    }
  }
};
</script>

<style lang="stylus" scoped>
.rank-header
  background-color: #fff

  img
    display: block
    margin: auto
    width: 155px
    height: 35px

.rank-list
  padding: 0 20px
  background-color: #fff

  .rank-item
    display: flex
    align-items: center
    padding: 15px 0

    &:nth-last-child(n+2)
      border-bottom: 1px solid #DADADA

    .num
      width: 32px
      height: 38px

      img
        width: 100%
        height: 100%

      p
        line-height: 31px
        color: #747474
        text-align: center
        font-size: 18px

    .avatar-wrapper
      width: 50px
      height: 50px
      margin: 0 15px
      background-color: #ccc
      border-radius: 50%

      img
        border-radius: 50%
        width: 100%
        height: 100%

      .num-text
        position: relative
        bottom: 7px
        color: #fff
        text-align: center
        font-size: 12px
        width: 70%
        margin: auto
        border-radius: 3px
        background-color: #F5605A

    .top1
      border: 2px solid #F5605A

    .top2
      border: 2px solid #FB9936

      .num-text
        background-color: #FB9936

    .top3
      border: 2px solid #EFD226

      .num-text
        background-color: #EFD226

    .rank-info
      flex: 1
      margin-right: 5px

      .name
        color: #000000
        font-size: 16px
        line-height: 2

      .date
        font-size: 14px
        color: #747474

    .schedule
      font-size: 16px

.el-alert
  margin: 10px 0
</style>
