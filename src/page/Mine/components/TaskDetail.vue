<template>
  <el-card class="detail-page">
    <div class="wrapper-tiltle">任务详情</div>
    <div class="task-info">
      <div class="cover-wrapper"><img
          :src="taskDetail.backgroundImg"
          alt=""
        ></div>
      <div class="task-middle">
        <div class="title">{{taskDetail.title}}</div>
        <div class="desc">
          简介：{{taskDetail.desc}}
        </div>
        <div class="date">截止时间：{{taskDetail.endTime*1000|timeMoment}}</div>
        <div class="clearfix">
          <div class="voteNum"><i class="iconfont">&#xe870;</i>{{ taskDetail.voteNum }}</div>
          <div class="watch"><i class="iconfont">&#xe6ae;</i>{{taskDetail.viewNum}}人学过</div>
        </div>
      </div>
      <div class="progress">
        <el-progress
          type="circle"
          :percentage="taskDetail.schedule"
          :color="taskDetail.schedule==100?'#01B137':'#FA4E1F'"
          :show-text="false"
          :width="100"
        ></el-progress>
        <div class="progress-text">
          <p class="mark">已完成</p>
          <p
            class="present"
            :style="{color:taskDetail.schedule==100?'#01B137':'#FA4E1F'}"
          >{{taskDetail.schedule}}%</p>
        </div>
      </div>

    </div>
    <div
      class="recent-study"
      v-show="Object.keys(recentcontent).length!=0"
    >
      <div class="ellipsis">上次任务：<span>{{recentcontent.name}}</span></div>
      <el-button
        type="primary"
        round
        plain
        size="medium"
        @click="()=>$router.push(`${gotoRouter[taskDetail.taskType- 1]}${recentcontent.id}`)"
      >继续</el-button>
    </div>
    <divider />
    <task-rank :taskId="taskId"></task-rank>
  </el-card>
</template>

<script>
import { getTaskDetail } from "@/api/api";
import TaskRank from "./TaskRank";
export default {
  name: "TaskDetail",
  components: {
    TaskRank
  },
  data() {
    return {
      taskId: this.$route.params.id,
      taskDetail: {
        title: "",
        desc: "",
        backgroundImg: "",
        endTime: 0,
        taskType: 1,
        taskStatus: 0,
        schedule: 0,
        viewNum: 0,
        voteNum: 0,
        recentlyWatch: {
          recentlyWatchVideo: {},
          recentlyWatchLive: {},
          recentlyWatchNews: {},
          recentlyWatchExam: {}
        }
      },
      gotoRouter: ["/liveRoom/", "/liveRoom/", "/newspage/", "/answer/"],
      recentname: [
        "recentlyWatchVideo",
        "recentlyWatchLive",
        "recentlyWatchNews",
        "recentlyWatchExam"
      ],
      status: ["未开始", "进行中", "已完成"]
    };
  },
  computed: {
    recentcontent() {
      return (
        this.taskDetail.recentlyWatch[
          this.recentname[this.taskDetail.taskType - 1]
        ] || {}
      );
    }
  },
  created() {
    this.initDetail();
  },
  methods: {
    initDetail() {
      getTaskDetail({ taskId: this.taskId }).then(
        res => {
          this.taskDetail = res.data;
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.detail-page
  padding: 20px 30px

  .wrapper-tiltle
    color: #000
    font-size: 18px
    margin-bottom: 15px

    &:before
      border-left: 3px solid #209EF2
      content: ''
      margin-right: 10px

.task-info
  display: flex

  .cover-wrapper
    width: 228px
    height: 128px
    background-color: #dfdfdf

    img
      height: 100%
      width: 100%

  .task-middle
    flex: 1
    margin: 0 15px

    .title
      color: #000
      font-size: 18px

    .desc
      font-size: 16px
      margin-top: 5px
      line-height: 1.5
      color: #747474

    .date
      margin-top: 5px
      font-size: 14px
      color: #999999

    .voteNum
      margin-top: 10px
      margin-right: 30px
      float: left
      color: #FA4E1F
      font-size: 15px

    .watch
      margin-top: 10px
      float: left
      font-size: 16px
      color: #929292

  .progress
    position: relative

    .progress-text
      position: absolute
      top: 0
      left: 0
      right: 0
      display: flex
      flex-direction: column
      align-items: center
      padding: 26px 10px
      line-height: 24px
      color: #ED1C24
      font-weight: 600
      font-size: 18px

      .mark
        font-size: 18px
        font-weight: bold
        color: #333

.recent-study
  display: flex
  align-items: center
  margin: 15px 0
  background-color: #f3f3f3
  padding: 15px 25px
  border-radius: 6px

  .ellipsis
    flex: 1
    font-size: 16px
    color: #0F0F0F
    margin-right: 15px

    span
      color: #59B1F4
</style>
