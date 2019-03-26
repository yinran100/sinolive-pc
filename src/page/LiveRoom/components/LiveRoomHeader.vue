<template>
  <el-row
    class="live-header"
    ref="header"
    type="flex"
    justify="space-around"
  >
    <el-col
      :sm="24"
      :md="22"
      :lg="20"
    >
      <el-row
        type="flex"
        align="middle"
        justify="space-between"
      >
        <el-col
          class="live-tiltle ellipsis"
          :md="14"
          :xs="19"
        >{{ tittle }}</el-col>
        <el-col
          class="live-btns"
          :md="10"
          :xs="5"
        >
          <el-button
            type="text"
            class="btn hidden-xs-only"
            @click="gotoHome"
          >
            <div class="logo-wrapper"><img
                src="/img/logo.png"
                alt=""
              ></div>
            <div class="logo-text">首页</div>
          </el-button>
          <el-button
            type="text"
            class="btn hidden-xs-only"
            @click="gotoExam"
          ><span class="iconfont">&#xe723;</span>考试</el-button>
          <el-button
            type="text"
            class="btn hidden-xs-only"
          ><span class="iconfont">&#xe620;</span>分享</el-button>
          <el-button
            type="text"
            class="btn hidden-xs-only"
            @click="showRate"
          ><span class="iconfont">&#xe60d;</span>评价</el-button>
          <Divider
            class="hidden-xs-only"
            type="vertical"
          />
          <router-link
            tag="div"
            class="img-wrapper"
            to="/mine"
          >
            <img
              class="mine-img"
              :src="userMsg.avatar"
              alt=""
            >
          </router-link>
          <router-link
            tag="div"
            class="username hidden-xs-only hidden-sm-only"
            to="/mine"
          >{{userMsg.username}}</router-link>
          <el-dropdown
            class="more hidden-sm-and-up"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more-outline"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="gotoHome">
                <img
                  src="/img/logo.png"
                  alt=""
                  style="width: 17px;margin-right: 3px"
                >首页
              </el-dropdown-item>
              <el-dropdown-item command="gotoExam"><span class="iconfont">&#xe723;</span>考试</el-dropdown-item>
              <el-dropdown-item command=""><span class="iconfont">&#xe620;</span>分享</el-dropdown-item>
              <el-dropdown-item command="showRate"><span class="iconfont">&#xe60d;</span>评价</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    tittle: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(["userMsg"])
  },
  methods: {
    gotoHome() {
      this.$router.push("/");
    },
    gotoExam() {
      this.$emit("gotoexam");
    },
    showRate() {
      this.$emit("showrate");
    },
    handleCommand(command) {
      if (command !== "") this[command]();
    }
  }
};
</script>

<style lang="stylus" scoped>
.live-header
  height: 75px
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1)

  .el-row
    padding: 0 10px
    height: 100%

    .live-tiltle
      color: #010101
      font-size: 22px

    .live-btns
      display: flex
      align-items: center
      justify-content: end

      .btn
        color: #909399
        line-height: 18px
        margin-right: 5px

      .logo-wrapper
        display: inline-block
        width: 17px
        height: 19px
        margin-right: 5px
        padding-bottom: 2px
        vertical-align: middle

        img
          width: 100%
          height: 100%
          vertical-align: middle
          display: block

      .logo-text
        display: inline-block

      .img-wrapper
        margin: 0 10px 0 5px
        cursor: pointer
        height: 28px
        width: 28px
        display: inline-block
        background: url('../../../assets/images/mine.png') no-repeat
        background-size: cover
        vertical-align: middle

        .mine-img
          width: 100%
          height: 100%
          border-radius: 50%

      .username
        cursor: pointer
        display: inline
        color: #3f3f3f
        font-weight: 500
        vertical-align: middle
        font-size: 14px

      .more
        font-size: 24px
        color: #3f3f3f
        margin-left: 5px
</style>
