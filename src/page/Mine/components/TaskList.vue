<template>
  <div class="task-wrapper">
    <el-radio-group
      v-model="status"
      @change="radioChange"
    >
      <el-radio :label="1">未完成</el-radio>
      <el-radio :label="2">进行中</el-radio>
      <el-radio :label="3">逾期</el-radio>
    </el-radio-group>
    <ul
      class="task-list"
      v-if="taskList.length!=0"
    >
      <li
        class="task-item"
        v-for="item in taskList"
        :key="item.id"
      >
        <div class="icon-wrapper"><img
            :src="iconUrl[item.taskType-1]"
            alt=""
          ></div>
        <div class="task-content ellipsis">
          <div class="title ellipsis">{{item.title}}</div>
          <div class="bottom">
            <div class="date">任务日期：{{item.endTime*1000|timeMoment}}</div>
            <div class="schedule">进度：{{item.schedule}}%</div>
          </div>
        </div>
        <el-button
          type="primary"
          size="medium"
          @click="()=>$router.push(`/main/taskdetail/${item.id}`)"
        >查看详情</el-button>
      </li>
    </ul>
    <el-alert
      v-else
      title="没有找到相关学习任务"
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
          @click="loadTaskList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getStudyTask } from "@/api/api";
export default {
  props: {
    taskAmount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: 1,
      offset: 10,
      status: 1,
      taskList: [],
      noMoreData: false,
      keywords: "",
      iconUrl: [
        require("@/assets/images/video.png"),
        require("@/assets/images/course.png"),
        require("@/assets/images/article.png"),
        require("@/assets/images/exam.png")
      ],
      text: ["视频", "课程", "文章", "考试"]
    };
  },
  mounted() {
    this.loadTaskList();
  },
  methods: {
    pageChange(val) {
      this.page = val;
      this.loadTaskList();
    },
    radioChange(val) {
      this.status = val;
      this.page = 1;
      this.taskList = [];
      this.loadTaskList();
    },
    loadTaskList() {
      getStudyTask({
        page: this.page,
        offset: this.offset,
        status: this.status
      }).then(
        res => {
          if (res.data && res.data.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.taskList = this.taskList.concat(res.data);
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.task-wrapper
  padding: 20px 30px

.task-list
  padding: 0 10px

  .task-item
    display: flex
    align-items: center
    padding: 10px 0

    &:nth-last-child(n+2)
      border-bottom: 1px solid #DADADA

    .icon-wrapper
      width: 42px
      height: 42px
      margin-right: 18px

      img
        height: 100%
        width: 100%

    .task-content
      flex: 1

    .title
      font-size: 18px
      color: #1d7fc2

    .bottom
      display: flex
      margin-top: 5px
      align-items: center

      .date
        font-size: 14px
        color: #747474
        margin-right: 20px

      .schedule
        flex: 1
        color: #FA4E1F
        font-size: 14px

.el-alert
  margin-top: 10px
</style>
