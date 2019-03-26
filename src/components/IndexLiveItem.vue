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
        <div class="hotViewNum"> <i class="el-icon-view"></i> {{ item.Views }}</div>
        <div class="recomend-time ellipsis">{{ item.Updated*1000|dateMoment }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexLiveItem",
  props: {
    item: { type: Object, required: true }
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
  }
};
</script>

<style lang="stylus" scoped>
.liveitem
  margin: 0 5px

.recomend-cover
  max-width: 260px
  margin: 0 auto
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

.recomend-info
  max-width: 260px
  margin: 10px auto 0

  .recomend-name
    line-height: 2
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
      font-size: 16px

    .recomend-time
      float: right
      font-size: 14px
</style>
