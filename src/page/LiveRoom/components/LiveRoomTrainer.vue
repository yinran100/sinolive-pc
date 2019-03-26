<template>
  <div class="trainer-wrapper">
    <div class="trainer-avatar">
      <img
        class="avatar-img"
        :src="trainerPhoto"
        alt=""
      >
    </div>
    <div class="trainer-info ellipsis">
      <div class="trainer-name">{{trainerName}}</div>
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
      <div class="tips ellipsis">{{introduce}}</div>
      <div class="trainer-data">
        <span class="iconfont">&#xe61c;</span>{{influence}}
        <span class="iconfont">&#xe7b3;</span>{{watchNum}}
      </div>
    </div>
  </div>
</template>

<script>
import { getTrainerDetail } from "@/api/api";
export default {
  name: "LiveRoomTrainer",
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
  methods: {
    getTrainDetail(userid) {
      getTrainerDetail({
        usertrainer: userid
      }).then(
        res => {
          res = res.data;
          this.trainerName = res.nickName;
          this.trainerPhoto = res.avatar;
          this.watchNum = res.watchNum;
          this.trainerLable = res.desc.map((item, index) => {
            if (index < 3) return item.trim().substr(0, 5);
          });
          this.influence = res.influence;
          this.motto = res.motto.trim();
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.trainer-wrapper
  display: flex
  align-items: center
  height: 100px
  background-color: #fff
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  border-radius: 4px
  padding: 5px 5px 5px 10px

  .trainer-avatar
    height: 75px
    width: 75px
    border-radius: 50%
    background-color: #d1d1d1

    .avatar-img
      width: 100%
      height: 100%
      border-radius: 50%

  .trainer-info
    flex: 1
    margin-left: 10px

    .trainer-name
      font-size: 20px
      line-height: 1.5
      color: #000

    .trainer-tags
      margin-top: 3px
      margin-bottom: 5px

      .el-tag
        margin-right: 5px

    .tips
      color: #666666
      font-size: 13px

    .trainer-data
      color: #B5B5B5
      font-size: 12px
      line-height: 1.5
</style>
