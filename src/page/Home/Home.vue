<template>
  <el-container direction="vertical">
    <home-header ref="header"></home-header>
    <el-main>
      <home-main :style="{'minHeight':minHeight+'px'}"></home-main>
    </el-main>
    <home-footer ref="footer"></home-footer>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import HomeHeader from "@/components/HomeHeader";
import HomeMain from "./components/HomeMain";
import HomeFooter from "@/components/HomeFooter";
export default {
  components: {
    HomeHeader,
    HomeMain,
    HomeFooter
  },
  data() {
    return {
      extralHeight: 0
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
</style>