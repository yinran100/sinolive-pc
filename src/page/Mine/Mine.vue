<template>
  <el-container direction="vertical">
    <home-header ref='header'></home-header>
    <el-main :style="{'minHeight':minHeight+'px'}">
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col
          :sm="24"
          :md="20"
          :lg="16"
        >
          <el-row
            class="content"
            type="flex"
            justify="space-between"
          >
            <el-col :span="5">

              <el-menu
                :default-active="activeIndex"
                mode="vertical"
                @select="handleSelect"
              >
                <el-menu-item index="/mine/info"><i class="el-icon-menu"></i>个人中心</el-menu-item>
                <el-menu-item index="/mine/study"><i class="el-icon-document"></i>最近学习</el-menu-item>
                <el-menu-item index="/mine/modifyinfo"><i class="el-icon-setting"></i>资料修改</el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="19">
              <keep-alive>
                <router-view></router-view>
              </keep-alive>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
    <home-footer ref="footer"></home-footer>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import HomeHeader from "@/components/HomeHeader";
import MineInfo from "./components/MineInfo";
import HomeFooter from "@/components/HomeFooter";
export default {
  components: {
    HomeHeader,
    MineInfo,
    HomeFooter
  },
  data() {
    return {
      activeIndex: "/mine/info",
      extralHeight: 0,
      timer: null
    };
  },
  computed: {
    ...mapState(["minClientHeight"]),
    minHeight() {
      return this.minClientHeight - this.extralHeight;
    }
  },
  mounted() {
    if (this.$route.path.indexOf("/info") < 0)
      this.activeIndex = this.$route.path;
    this.extralHeight =
      this.$refs.header.$el.clientHeight + this.$refs.footer.$el.clientHeight;
  },
  watch: {
    $route() {
      if (this.$route.path.indexOf("/info") < 0)
        this.activeIndex = this.$route.path;
      else this.activeIndex = "/mine/info";
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(keyPath[0]);
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-header, .el-main
  padding: 0

.el-main
  background-color: #F2F6FC

  .content
    margin: 20px auto 30px

    .el-menu
      border-right: none
      margin-right: 20px
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)

      .el-menu-item
        text-align: center

      .el-menu-item.is-active
        border-right: 2px solid #409EFF
        background-color: #f9fbff
</style>