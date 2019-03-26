<template>
  <el-container direction="vertical">

    <el-main :style="{'minHeight':minHeight+'px'}">
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
          <lott-chart></lott-chart>

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
import LottChart from "./components/LottChart";
export default {
  components: {
    HomeHeader,
    HomeFooter,
    LottChart
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
    this.extralHeight = this.$refs.footer.$el.clientHeight;
  },

  methods: {}
};
</script>
<style lang="stylus" scoped>
</style>
