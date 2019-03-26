<template>
  <el-row
    class="header-wrapper"
    type="flex"
    justify="space-around"
  >
    <el-col
      :sm="24"
      :md="20"
      :lg="16"
    >
      <el-row
        type="flex"
        align="middle"
        justify="space-between"
      >
        <el-col
          :span="4"
          :xs="6"
        >
          <router-link
            tag="div"
            class="head-name"
            to="/"
          >
            <img
              class="head-name-img"
              src="@/assets/images/logo_name.png"
              alt=""
            >
          </router-link>
        </el-col>
        <el-col
          :xs="15"
          :sm="12"
          :md="10"
          :lg="9"
        >
          <el-input
            placeholder="请输入关键字"
            v-model="keyword"
          >
            <el-select
              slot="prepend"
              v-model="value"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              type="primary"
            ></el-button>
          </el-input>
        </el-col>
        <el-col
          :span="6"
          :xs="3"
          class="header-btn"
        >
          <el-popover
            class="download-panel  hidden-xs-only"
            width="185"
            trigger="hover"
          >
            <img
              class="download-img"
              src="@/assets/images/download.jpg"
              alt=""
            >
            <p class="download-tips">手机扫一扫即可访问下载</p>
            <el-button
              type="text"
              slot="reference"
            >下载App</el-button>
          </el-popover>

          <Divider
            class="hidden-xs-only"
            type="vertical"
          />
          <router-link
            tag="div"
            class="login-btn btn hidden-xs-only"
            v-if="!hasLogin"
            to="/login"
          >登录/注册</router-link>
          <router-link
            tag="div"
            class="img-wrpper"
            to="/mine"
          >
            <img
              class="mine-img"
              :src="userMsg.avatar"
              alt=""
              @click="$router.push(`/mine`)"
            >
          </router-link>
          <router-link
            tag="div"
            class="username btn hidden-xs-only hidden-sm-only"
            v-if="hasLogin"
            to="/mine"
          >{{userMsg.nickname}}</router-link>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "HomeHeader",
  data() {
    return {
      keyword: "",
      options: [
        {
          value: "course",
          label: "课程"
        },
        {
          value: "trainer",
          label: "培训师"
        },
        {
          value: "live",
          label: "直播"
        },
        {
          value: "exam",
          label: "考试"
        },
        {
          value: "study",
          label: "最近学习"
        }
      ],
      value: "course"
    };
  },
  computed: {
    ...mapState(["userMsg", "hasLogin"])
  }
};
</script>

<style lang="stylus" scoped>
.el-input>>>.el-input-group__append
  background-color: #409EFF
  color: #fff

@css {
  .download-img{
    width: 100%;
    height: 100%
  }
  .download-tips{
    text-align:center;    
  }
}

.header-wrapper
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1)

.el-row
  height: 75px
  min-width: 645px

  // border-bottom: 1px solid #e2e9f3
  .head-name
    cursor: pointer
    height: 32px
    width: 135px
    margin: 0 20px

    .head-name-img
      height: 100%
      width: 100%

  .el-input
    .el-select
      min-width: 105px
      color: #333

  .header-btn
    text-align: right

    .btn
      cursor: pointer
      display: inline
      color: #3f3f3f
      font-weight: 500
      vertical-align: middle
      font-size: 14px

    .download-panel
      .el-button
        color: #FF4400

    .login-btn
      color: #000

    .img-wrpper
      margin: 0 10px 0 5px
      height: 28px
      width: 28px
      cursor: pointer
      display: inline-block
      background: url('../assets/images/mine.png') no-repeat
      background-size: cover
      vertical-align: middle

      .mine-img
        width: 100%
        height: 100%
        border-radius: 50%

    .username
      color: #3f3f3f
</style>