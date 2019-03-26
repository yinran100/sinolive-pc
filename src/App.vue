<template>
  <div class="page-body">
    <el-scrollbar
      ref="scrollbar"
      class="page-component__scroll"
      :native="false"
    >
      <router-view class="router-class"></router-view>
    </el-scrollbar>
    <to-top-button :getTarger="getScrollTarget"></to-top-button>
  </div>

</template>

<script>
import ToTopButton from "@/components/ToTopButton";

export default {
  name: "App",
  components: {
    ToTopButton
  },
  data() {
    return {
      timer: null,
      transitionName: "slide-right" // 默认动态路由变化为slide-right  TrainerDetail,LiveRoom,CourseDetail,NewsContent
    };
  },
  watch: {
    $route(to, from) {
      if (to.path == "/login" && localStorage.hasLogin == 1) {
        //若是到/login.且未登录，则直接重定向到首页
        this.$router.push("/");
      }
    }
  },
  created() {
    let res = location.search.replace(/\?/, "").split("&"); //去掉第一个问号 decodeURIComponent(uri_encode)
    let query = {};
    res.map(item => {
      let temp = item.split("=");
      if (temp[0] == "provinceId") {
        this.$store.commit("setProvinceId", decodeURIComponent(temp[1]));
      } else if (temp[0] == "notice_token") {
        getUserMsgbyToken({ notice_token: decodeURIComponent(temp[1]) }).then(
          res => {
            this.$store.commit("saveUserMsg", res.data);
            this.$store.commit("saveToken", res.data.sessionid);
          }
        );
      } else if (temp[0] == "id") {
        this.$store.commit("setActivityId", decodeURIComponent(temp[1]));
      }
    });
  },
  mounted() {
    let store = this.$store;
    window.onresize = function() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        store.commit(
          "saveMinClientHeight",
          document.documentElement.clientHeight
        );
      }, 32);
    };
  },
  methods: {
    getScrollTarget() {
      return this.$refs.scrollbar.wrap;
    }
  }
};
</script>

<style >
.router-class,
.home-view {
  transition: all 0.4s ease;
}
.page-body {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.el-scrollbar {
  height: 100%;
}
.page-component__scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
.slide-left-enter,
.slide-right-leave-active {
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100% 0);
}

.next-leave-active {
  -webkit-transform: translate(-120%, 0);
  transform: translate(-120% 0);
}

.next-enter {
  -webkit-transform: translate(120%, 0);
  transform: translate(120%, 0);
}
.el-header,
.el-main {
  padding: 0 !important;
}
</style>
