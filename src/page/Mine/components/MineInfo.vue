<template>
  <div class="info-page">
    <el-card class="info-wrapper">
      <div class="info-item">
        <router-link
          class="avatar-wrapper"
          to='personinfo'
        ><img
            class="avatar-img"
            :src="userMsg.avatar"
          ></router-link>
        <div class="mine-name ellipsis">{{userMsg.nickname}}</div>
        <div class="badge-wrapper"><img :src="taskTitle.img"></div>
      </div>
      <divider />
      <div class="info-item">
        <div class="study-data">
          <span>今日学习：{{ getFormatString(taskTitle.todayWatchLength)}}</span>
          <span>累计学习：{{getFormatString(taskTitle.totalWatchLength)}}</span>
        </div>
        <el-button
          type="danger"
          @click="logout"
        ><i class="iconfont">&#xe654;</i>退出登录</el-button>
      </div>
    </el-card>
  </div>

</template>

<script>
import { mapState } from "vuex";
import TaskList from "./TaskList";
import { getTaskTitle } from "@/api/api";
export default {
  name: "MineInfo",
  components: {
    TaskList
  },
  data() {
    return {
      taskTitle: {
        todayWatchLength: 0,
        totalWatchLength: 0,
        img: "",
        learnTaskNum: 0,
        doingNum: 0,
        finshNum: 0,
        delayNum: 0,
        recentlyNum: 0
      }
    };
  },
  computed: {
    ...mapState(["userMsg"])
  },
  created() {
    this.initTaskData();
  },
  methods: {
    initTaskData() {
      getTaskTitle().then(
        res => {
          this.taskTitle = res.data;
        },
        e => this.showMessage(e.data.message)
      );
    },
    getFormatString(num) {
      let minutes = Math.round(num / 60);
      let hour = minutes / 60;
      return hour < 1 ? minutes + "分钟" : hour.toFixed(1) + "小时";
    },
    logout() {
      this.$confirm("确定退出账号?", { type: "warning" })
        .then(() => {
          //存已登录
          this.$store.commit("saveToken", "");
          this.$store.commit("saveLogin", 0);
          this.$store.commit("saveUserMsg");
          console.log("logout");
          this.$router.push(`/login`);
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="stylus" scoped>
.info-wrapper
  padding: 20px 30px
  margin-bottom: 20px

.info-item
  display: flex
  align-items: center
  padding: 0 10px

  .avatar-wrapper
    margin-right: 30px
    width: 70px
    height: 70px
    border: 1 solid #ccc
    border-radius: 50%
    background: url('../../../assets/images/mine.png') no-repeat
    background-size: cover

    .avatar-img
      border-radius: 50%
      height: 100%
      width: 100%

  .badge-wrapper
    width: 83px
    height: 70px
    margin-left: 20px

    img
      width: 100%
      height: 100%

  .study-data
    flex: 1
    font-size: 14px

    span
      margin-right: 0.6rem
      color: #000

  .mine-name
    flex: 1
    font-size: 20px
    font-weight: 500
    color: #3f3f3f
</style>
