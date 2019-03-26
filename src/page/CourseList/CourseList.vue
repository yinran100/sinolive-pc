<template>
  <div class="course-wrapper">
    <ul
      class="course-list"
      v-if="courseList.length!=0"
    >
      <li
        class="course-item"
        v-for="item in courseList"
        :key="item.courseId"
      >
        <div class="course-img"> <img
            :src="item.courseImg"
            alt=""
          >
        </div>
        <div class="course-info ellipsis">
          <div class="titel ellipsis">{{item.title}}</div>
          <div class="desc">
            介绍：{{item.desc}}
          </div>
          <div class="data">
            <span class="voteNum"><i class=" iconfont">&#xe870;</i>{{item.voteNum}}</span>
            <span class="watch"><i class="iconfont">&#xe7b3;</i>{{item.watchNum}}</span>
            <el-button
              type="info"
              plain
              size="mini"
              style="padding: 4px 10px;"
            >查看详情</el-button>
          </div>
        </div>
      </li>
    </ul>
    <el-alert
      v-else
      title="没有找到课程的数据"
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
          @click="loadCourseList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCourseList } from "@/api/api";
export default {
  name: "CourseList",
  data() {
    return {
      page: 1,
      offset: 10,
      courseList: [],
      noMoreData: false
    };
  },
  created() {
    this.loadCourseList();
  },
  methods: {
    loadCourseList() {
      getCourseList({
        p: this.page,
        offset: this.offset
      }).then(
        res => {
          if (res.data && res.data.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.courseList = this.courseList.concat(
            res.data.map(
              ({
                courseId,
                title,
                img,
                desc,
                influence,
                voteNum,
                watchNum,
                introduce
              }) => {
                return {
                  courseId,
                  title,
                  courseImg: img,
                  desc: desc.trim(),
                  voteNum,
                  watchNum,
                  introduce
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
.course-wrapper
  padding: 10px 30px

  .course-list
    padding: 0 10px

    .course-item
      display: flex
      align-items: center
      padding: 10px 0

      &:nth-last-child(n+2)
        border-bottom: 1px solid #DADADA

      .course-img
        height: 100px
        width: 180px
        overflow: hidden

        img
          width: 100%
          height: 100%

      .course-info
        flex: 1
        margin-left: 20px

        .titel
          font-size: 18px
          color: #333
          margin-bottom: 5px

        .desc
          color: #909399
          white-space: initial
          line-height: 1.3
          font-size: 14px

        .data
          color: #C0C4CC
          font-size: 13px
          display: flex
          align-items: center
          justify-content: end

          span
            margin-right: 20px

.el-alert
  margin: 10px 0
</style>
