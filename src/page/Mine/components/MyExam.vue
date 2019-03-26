<template>
  <div class="exam-wrapper">
    <div class="condition">
      <div>筛选：</div>
      <div class="selecter">
        <el-radio-group
          v-model="markSearch"
          @change="radioChange"
        >
          <el-radio :label="-2">全部</el-radio>
          <el-radio :label="-1">未完成</el-radio>
        </el-radio-group>
        <el-checkbox
          class="over-radio"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >完成</el-checkbox>
        <el-checkbox-group
          v-model="checkResult"
          @change="handleCheckedItemChange"
          v-show="markSearch==''"
        >
          <el-checkbox
            v-for="item in result"
            :label="item"
            :key="item"
          >{{item}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <ul
      class="exam-list"
      v-if="examList.length!=0"
    >
      <li
        class="exam-item"
        v-for="item in examList"
        :key="item.Id"
      >
        <div class="exam-info ">
          <p class="exam-name"><i class="iconfont">&#xe723;</i>
            <span>{{ item.Papername }}</span>
          </p>
          <p class="exam-end">考试截止时间：{{ item.Enddate*1000|timeMoment }}</p>
        </div>

        <div
          class="exam-score"
          v-show="item.Mark>=0"
        >
          <el-progress
            type="circle"
            v-if="item.Mark>=0"
            :percentage="item.Mark"
            :color="item.pass?'#01AF63':'#ED1C24'"
            :show-text="false"
            :stroke-width="3"
            :width="75"
          ></el-progress>
          <div class="exam-text">
            <p class="mark">{{item.pass?"及格":"不及格"}}</p>
            <p :class="{score:item.pass}">{{item.Mark}}分</p>
          </div>
        </div>
        <el-button
          v-if="item.Mark>=0"
          type="info"
          plain
          @click="$router.push(`/answer/${item.Id}`)"
        >查看详情</el-button>
        <el-button
          v-else
          type="primary"
          round
          @click="$router.push(`/answer/${item.Id}`)"
        >参加考试</el-button>
      </li>
    </ul>
    <el-alert
      v-else
      title="没有考试的数据"
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
          @click="loadExamList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMyExam } from "@/api/api";
export default {
  name: "MineExam",
  data() {
    return {
      page: 1,
      offset: 10,
      noMoreData: false,
      keywords: "",
      markSearch: -2,
      checkAll: false,
      checkResult: [],
      result: ["及格", "不及格"],
      isIndeterminate: false,
      examList: []
    };
  },
  computed: {
    mark() {
      //"" -1 未完成 1完成 2合格 3不合格
      if (this.markSearch != "") return this.markSearch;
      else if (this.checkAll) return 1;
      else if (this.checkResult[0] == this.result[0]) return 2;
      else return 3;
    }
  },
  created() {
    this.loadExamList();
  },
  methods: {
    radioChange(val) {
      this.checkResult = [];
      this.checkAll = false;
      this.isIndeterminate = false;
      this.conditionSearch();
    },
    handleCheckAllChange(val) {
      this.checkResult = val ? this.result : [];
      this.isIndeterminate = false;
      this.markSearch = val ? "" : -2;
      this.conditionSearch();
    },
    handleCheckedItemChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.result.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.result.length;
      if (!this.checkAll && !this.isIndeterminate)
        this.markSearch = this.checkAll ? -1 : -2;
      this.conditionSearch();
    },
    conditionSearch() {
      this.page = 1;
      this.examList = [];
      this.loadExamList();
    },
    loadExamList() {
      getMyExam({
        mark: this.mark,
        keywords: this.keywords,
        p: this.page,
        offset: this.offset
      }).then(
        res => {
          if (res.data && res.data.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.examList = this.examList.concat(
            res.data.map(
              ({ Id, Papername, Mark, sign, influence, Enddate }) => {
                return {
                  Id,
                  pass: sign == 1, //是否已通过
                  Papername,
                  Mark,
                  Enddate
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
.exam-wrapper
  padding: 20px 30px

  .condition
    margin-bottom: 10px
    line-height: 20px
    display: flex
    align-items: start

    .selecter
      flex: 1

      .over-radio
        margin-left: 30px

      .el-checkbox-group
        margin-top: 10px

  .exam-list
    padding: 0 0

    .exam-item
      display: flex
      padding: 10px 0
      align-items: center

      &:nth-last-child(n+2)
        border-bottom: 1px solid #DADADA

      .exam-info
        flex: 1

        .exam-name
          font-size: 20px
          font-weight: 500
          color: #3f3f3f
          margin-bottom: 10px

          a
            color: #3f3f3f

          .iconfont
            font-size: 20px
            color: #999

        .exam-start, .exam-end
          color: #999
          font-size: 14px
          line-height: 1.5

      .exam-score
        position: relative
        margin: 0 20px 0 15px

        .exam-text
          position: absolute
          top: 0
          left: 0
          right: 0
          display: flex
          flex-direction: column
          align-items: center
          padding: 14px 10px
          line-height: 24px
          color: #ED1C24
          font-weight: 600
          font-size: 16px

          .mark
            font-size: 14px
            font-weight: normal
            color: #333333

          .score
            color: #01AF63

  .el-alert
    margin: 10px 0
</style>
