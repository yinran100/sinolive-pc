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
            <router-view class='main-view'></router-view>
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
import HomeFooter from "@/components/HomeFooter";
export default {
  components: {
    HomeHeader,
    HomeFooter
  },
  data() {
    return {
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
    this.extralHeight =
      this.$refs.header.$el.clientHeight + this.$refs.footer.$el.clientHeight;
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

    .main-view
      flex: 1
</style>