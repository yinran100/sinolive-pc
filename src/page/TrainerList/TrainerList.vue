<template>
  <div class="trainer-wrapper">
    <ul
      class="trainer-list"
      v-if="trainerList.length!=0"
    >
      <li
        class="trainer-item"
        v-for="item in trainerList"
        :key="item.trainerId"
      >
        <div class="trainer-img"><img
            :src="item.trainerPhoto"
            alt=""
          ></div>
        <div class="trainer-info ellipsis">
          <div class="name-wrapper  ellipsis">
            <div class="name ellipsis">{{item.trainerName}}</div>
            <el-tag
              v-for="(label,index) in item.trainerLable"
              :key="index"
              size="mini"
              :type="index==0?'':'success'"
            >
              {{label}}
            </el-tag>
          </div>
          <div class="introduce">
            简介：{{item.introduce}}
          </div>
          <div class="data">
            <span class="influence"><i class="iconfont">&#xe61c;</i>{{item.influence}}</span>
            <span class="watch"><i class="iconfont">&#xe7b3;</i>{{item.watchNum}}</span>
            <el-button
              type="info"
              plain
              size="mini"
              style="padding: 4px 10px;"
            >查看详情</el-button>
          </div>
        </div>
      </li>
    </ul>
    <el-alert
      v-else
      title="没有找到培训师的数据"
      type="info"
      :closable="false"
      center
      show-icon
    >
    </el-alert>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="20">
        <el-button
          v-show="!noMoreData"
          style="width:100%"
          @click="loadTrainerList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTrainerList } from "@/api/api";
export default {
  name: "TrainerList",
  data() {
    return {
      page: 1,
      offset: 10,
      trainerList: [],
      noMoreData: false
    };
  },
  created() {
    this.loadTrainerList();
  },
  methods: {
    loadTrainerList() {
      getTrainerList({
        p: this.page,
        offset: this.offset
      }).then(
        res => {
          if (res.data && res.data.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.trainerList = this.trainerList.concat(
            res.data.map(
              ({
                trainerId,
                nickName,
                avatar,
                desc,
                influence,
                watchNum,
                introduce
              }) => {
                return {
                  trainerId,
                  trainerName: nickName,
                  trainerPhoto: avatar,
                  trainerLable: desc.map((item, index) => {
                    if (index < 2) return item.trim().substr(0, 5);
                  }),
                  influence: influence,
                  watchNum,
                  introduce: introduce.trim()
                };
              }
            )
          );
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.trainer-wrapper
  padding: 10px 30px

  .trainer-list
    padding: 0 10px

    .trainer-item
      display: flex
      align-items: center
      padding: 10px 0

      &:nth-last-child(n+2)
        border-bottom: 1px solid #DADADA

      .trainer-img
        width: 70px
        height: 70px
        margin: 0 30px 0 10px
        border-radius: 50%
        overflow: hidden

        img
          width: 100%
          height: 100%

      .trainer-info
        flex: 1

        .name-wrapper
          margin-bottom: 5px
          display: flex
          align-items: center

          .name
            font-size: 18px
            color: #333

          .el-tag
            margin-left: 10px

        .introduce
          color: #909399
          white-space: initial
          line-height: 1.3
          font-size: 14px

        .data
          color: #C0C4CC
          font-size: 13px
          display: flex
          align-items: center
          justify-content: end

          span
            margin-right: 20px

          .influence i
            color: #fe7b57

.el-alert
  margin: 10px 0
</style>
