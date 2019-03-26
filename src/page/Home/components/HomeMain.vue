<template>
  <div class="main-wrapper">
    <div class="main-ad-wrapper"><img
        class="main-ad-img"
        src="@/assets/images/home.png"
        alt=""
      ></div>
    <el-row
      class="main-nav"
      type="flex"
      justify="space-around"
    >
      <el-col
        :sm="24"
        :md="20"
        :lg="16"
      >
        <el-menu
          :default-active="homeViewName"
          mode="horizontal"
          text-color="#666666"
          active-text-color="#209EF2"
          @select="handleSelect"
        >
          <el-menu-item index="Index">首页</el-menu-item>
          <el-menu-item index="LiveCenter">直播中心</el-menu-item>
          <el-menu-item index="KnowledgeBase">知识库</el-menu-item>
          <el-menu-item index="NewsList">新闻资讯</el-menu-item>
          <el-menu-item index="TrainerList">培训师</el-menu-item>
          <el-menu-item index="CourseList">课程列表</el-menu-item>
          <el-menu-item index="MyExam">我的考试</el-menu-item>
          <el-menu-item index="TaskList">学习任务</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="space-around"
    >
      <el-col
        :sm="24"
        :md="20"
        :lg="16"
      >
        <keep-alive>
          <component
            :is="homeViewName"
            :clientWidth="clientWidth"
          ></component>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Index from "@/page/Index/Index";
import LiveCenter from "@/page/LiveCenter/LiveCenter";
import KnowledgeBase from "@/page/KnowledgeBase/KnowledgeBase";
import TrainerList from "@/page/TrainerList/TrainerList";
import NewsList from "@/page/NewsList/NewsList";
import CourseList from "@/page/CourseList/CourseList";
import MyExam from "@/page/Mine/components/MyExam";
import TaskList from "@/page/Mine/components/TaskList";
import { mapState } from "vuex";

export default {
  components: {
    Index,
    LiveCenter,
    KnowledgeBase,
    NewsList,
    TrainerList,
    CourseList,
    MyExam,
    TaskList
  },
  data() {
    return {
      activeIndex: "Index",
      timer: null,
      clientWidth: document.documentElement.clientWidth
    };
  },
  computed: {
    ...mapState(["homeViewName"])
  },
  mounted() {
    this.activeIndex = this.homeViewName;
    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
    const that = this;
    window.onresize = function() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        that.clientWidth = document.documentElement.clientWidth;
      }, 50);
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$store.commit("saveViewName", key);
    }
  }
};
</script>
<style lang="stylus" scoped>
.main-wrapper
  padding-bottom: 50px

  .main-ad-wrapper
    height: 250px
    width: 100%
    background-color: #4B82E6
    display: flex
    flex-direction: column
    align-items: center

    .main-ad-img
      height: 100%
      margin: 0 auto

  .main-nav
    &:after
      display: block
      content: ''
      position: absolute
      left: 0
      right: 0
      bottom: 0
      margin-top: -1px
      border-bottom: solid 1px #e6e6e6

    .el-menu
      margin: 0 10px

      .el-menu-item
        font-size: 17px
</style>
