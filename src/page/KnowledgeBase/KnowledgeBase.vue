<template>
  <div class="knowledge-wrapper">
    <div
      class="knowledge-item"
      v-for="(item, index) in knowledgeList"
      :key="item.id"
    >
      <p class="question">
        <span class="number">{{ index + 1 }}.</span>
        <span>{{item.questionType === 1?"【单选】":"【多选】"}}</span>
        <span class="topic">{{ item.questionName }}</span>
      </p>
      <div class="answer">
        <p
          class="answer-item"
          v-for="items in item.option"
          :key="items.id"
        >
          {{ items.Value }}. {{ items.Name }}
        </p>
        <span class="true-answer">正确答案：{{ item.answer }}</span>
      </div>
    </div>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="20">
        <el-button
          v-show="!noMoreData"
          style="width:100%"
          @click="getKnowData()"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getKnowledgeData } from "@/api/api";
export default {
  name: "KnowledgeBase",

  data() {
    return {
      page: 1,
      offset: 10,
      knowledgeList: [],
      noMoreData: false
    };
  },
  mounted() {
    this.getKnowData();
  },
  methods: {
    getKnowData() {
      getKnowledgeData({ p: this.page, offset: this.offset }).then(
        res => {
          if (res.data && res.data.length < this.offset) {
            this.noMoreData = true;
          }
          this.page++;
          this.knowledgeList = this.knowledgeList.concat(res.data);
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.knowledge-wrapper
  margin: 20px 30px 0

  .knowledge-item
    margin-bottom: 15px

    .number
      font-weight: bold

    .question
      font-size: 16px
      margin-bottom: 3px

      .topic
        line-height: 20px

      .true-answer
        font-weight: bold
        color: #4986e6
        padding: 12px

        p
          margin-bottom: 6px

  .answer
    padding: 0 24px

    .answer-item
      font-size: 14px
      line-height: 1.5

    .true-answer
      display: block
      margin-top: 6px
      color: #4986e6
      font-weight: 700
</style>
