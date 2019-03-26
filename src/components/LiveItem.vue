<template>
  <div class="liveitem">
    <div class="recomend-cover">
      <router-link
        tag="img"
        :to="`/liveroom/${item.Id}`"
        class="cover-img"
        :src="item.Headpic"
        alt=""
      />
      <div
        class="state-info"
        v-show="item.Livestate == 0&&timeArr"
      >
        <div v-if="timeArr&&timeArr[0]<3">
          <p>距离开播</p>
          <p class="count-down"> <span class="time-num">{{timeArr[0]}}</span>时
            <span class="time-num">{{timeArr[1]}}</span>分<span class="time-num">{{timeArr[2]}}</span>秒</p>
        </div>
        <p
          class="count-down"
          v-else
        >未开始</p>
      </div>
      <div
        class="state-tag"
        :style="{backgroundColor:stateTag.color}"
        v-show="stateTag"
      >{{stateTag.text}}</div>
    </div>
    <div class="recomend-info ellipsis">
      <router-link
        class="recomend-name ellipsis"
        :to="`/liveroom/${item.Id}`"
      >{{ item.Name }}</router-link>
      <p class="recomend-cont ellipsis">{{ item.Subtitle }}</p>
      <div class="recomend-bottom">
        <!-- <div class="hotViewNum"> <i class="el-icon-view"></i> {{ item.Views }}</div> -->
        <div class="recomend-time ellipsis">开播时间：<span class="time">{{ item.Begindate*1000|timeMoment }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LiveItem",
  props: {
    item: { type: Object, required: true }
  },
  data() {
    return {
      timeArr: false,
      timer: null
    };
  },
  computed: {
    stateTag() {
      if (this.item.Livestate == 0) return { text: "未开始", color: "#6175F7" };
      else if (this.item.Livestate == 1)
        return { text: "直播中", color: "#F24B43" };
      else if (this.item.Livestate == 2)
        return { text: "答题中", color: "#449d44" };
      else if (this.item.Livestate == 3)
        return { text: "已结束", color: "#676767" };
      else return false;
    }
  },
  mounted() {
    if (this.item.Livestate == 0)
      this.timer = setInterval(() => {
        this.getCountDown();
      }, 1000);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    getCountDown() {
      let subSecond =
        (this.item.Begindate * 1000 - new Date().getTime()) / 1000; //秒差
      if (subSecond > 0) {
        let hour = Math.floor(subSecond / 3600);
        let lasttime = parseInt(subSecond % 3600);
        let minutes = Math.floor(lasttime / 60);
        let seconds = parseInt(lasttime % 60);
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        this.timeArr = [hour, minutes, seconds];
        // else return [0,minutes,seconds];
      } else {
        this.timeArr = false;
        clearInterval(this.timer);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.liveitem
  margin: 0 5px

.recomend-cover
  margin: 0 auto
  max-width: 260px
  height: 140px
  position: relative
  cursor: pointer
  background-color: #dfdfdf

  .cover-img
    height: 100%
    width: 100%

  .state-tag
    font-size: 12px
    color: #fff
    border-radius: 3px
    position: absolute
    top: 5px
    left: 5px
    padding: 3px

  .state-info
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: rgba(0, 0, 0, 0.5)
    color: #fff
    text-align: center
    font-size: 16px
    padding: 40px 0 0
    line-height: 2

    .count-down
      font-size: 20px
      letter-spacing: 1px

      .time-num
        color: #23B8FF

.recomend-info
  margin: 5px auto 0
  max-width: 260px

  .recomend-name
    line-height: 1.7
    font-size: 18px
    color: #303133

    &:hover
      color: #2d8cf0

  .recomend-cont
    color: #999999
    line-height: 2
    font-size: 14px

  .recomend-bottom
    color: #999999
    display: flex
    align-items: center

    .hotViewNum
      flex: 1
      margin-right: 5px
      font-size: 15px

    .recomend-time
      float: right
      font-size: 14px

      .time
        color: #666
</style>
