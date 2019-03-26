<template>
  <div class="swiper-item">
    <div class="swiper-left">
      <img
        class="live-img"
        :src="liveInfo.Screenshot"
        alt=""
      >
      <div class="live-info ellipsis">
        <p class="live-title ellipsis">{{liveInfo.Name}}</p>
        <div class="liver-name">讲师：{{trainerName}}</div>
        <p class="live-subtitle ellipsis">{{liveInfo.Subtitle}}</p>
        <div class="live-time ellipsis">开播时间：<span class="time">{{ liveInfo.Begindate*1000|timeMoment }}</span></div>
        <!-- <el-button
                    type="primary"
                    @click.stop="attention"
                >立即关注</el-button> -->
      </div>
    </div>
    <div class="swiper-right">
      <div class="trainer-info">
        <div class="trainer-avatar">
          <img
            class="avatar-img"
            :src="trainerPhoto"
            alt=""
          >
        </div>
        <div class="trainer-data ellipsis">
          <p class="trainer-name ellipsis">{{trainerName}}</p>
          <p class="trainer-motto ellipsis">{{motto}}</p>
          <div class="trainer-tags">
            <el-tag
              v-for="(label,index) in trainerLable"
              :key="index"
              size="mini"
              v-show="label.length>0"
            >
              {{label}}
            </el-tag>
          </div>
        </div>
      </div>
      <div class="trainer-intro">简介：{{introduce}}</div>
    </div>
  </div>

</template>

<script>
import { getTrainerDetail } from "@/api/api";
export default {
  props: {
    liveInfo: Object
  },
  data() {
    return {
      trainerPhoto: "",
      trainerName: "",
      influence: 0,
      watchNum: 0,
      trainerLable: [],
      motto: "",
      introduce: ""
    };
  },
  created() {
    this.getTrainDetail();
  },
  methods: {
    getTrainDetail() {
      getTrainerDetail({
        usertrainer: this.liveInfo.Userid
      }).then(
        res => {
          res = res.data;
          this.trainerName = res.nickName;
          this.trainerPhoto = res.avatar;
          this.watchNum = res.watchNum;
          this.trainerLable = res.desc.map((item, index) => {
            if (index < 3) return item.trim().substr(0, 5);
          });
          this.motto = res.motto.trim();
          this.introduce = res.introduce;
        },
        e => this.showMessage(e.data.message)
      );
    },
    attention() {
      this.$message({
        message: "关注了，该功能还没上线",
        type: "success"
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.swiper-item
  display: flex
  height: 100%
  width: 100%

  .swiper-left
    height: 100%
    width: 65%
    position: relative

    .live-img
      width: 100%
      height: 100%

    .live-info
      position: absolute
      display: flex
      flex-direction: column
      align-items: center
      top: 0
      left: 0
      right: 0
      bottom: 0
      line-height: 1.5
      color: #ffffff
      padding: 10px
      background-color: rgba(0, 0, 0, 0.6)

      .live-title
        font-size: 38px
        font-weight: bold
        margin-top: 20px
        margin-bottom: 10px

      .liver-name
        font-size: 20px
        line-height: 2
        padding-bottom: 2px
        margin-bottom: 10px
        border-bottom: 2px solid #fff

      .live-subtitle
        font-size: 16px
        margin-top: 15px
        margin-bottom: 15px

      .live-time
        font-size: 17px
        margin-bottom: 25px

      .el-button
        border-radius: 0

  .swiper-right
    height: 100%
    width: 35%
    position: relative
    display: flex
    flex-direction: column

    .trainer-info
      display: flex
      align-items: center
      margin: 25px 30px 15px

      .trainer-avatar
        height: 75px
        width: 75px
        margin-right: 20px
        border-radius: 5px
        overflow: hidden
        background-color: #999

        .avatar-img
          width: 100%
          height: 100%

      .trainer-data
        flex: 1

        .trainer-name
          color: #333333
          font-size: 22px
          margin-bottom: 5px

        .trainer-motto
          color: #666666
          margin-bottom: 7px
          font-size: 13px

        .trainer-tags
          margin-top: 3px
          margin-bottom: 5px

          .el-tag
            margin-right: 5px

    .trainer-intro
      flex: 1
      margin: 5px 30px 15px
      color: #777777
      line-height: 1.5
</style>
