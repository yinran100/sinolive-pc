<template>
  <div>
    <div class="news-title">{{title}}</div>
    <div class="news-info"><i class="el-icon-time"></i><span class="updateTime">{{ updateTime*1000|timeMoment }} </span>
      来源：<span class="system">{{sourceName}}</span>
    </div>
    <div
      class="news-content"
      v-html="contentHtml"
    ></div>
    <div class="clearfix">
      <div class="news-reading"><i class="el-icon-view"></i><span class="readnum">观看数{{readingQuantity}}</span></div>
      <div
        class="like-btn"
        @click="voteArticle"
        :class="{'hasvote':isVote}"
      >
        <span class="iconfont">{{isVote?"&#xe870;":"&#xe871;"}}</span>
        <span>赞{{voteNumber}}</span>
      </div>
    </div>
    <comment-input
      :articleId="this.articleId"
      @success="resetComment"
    ></comment-input>
    <comment-list
      :articleId="this.articleId"
      ref="commentList"
    ></comment-list>
  </div>
</template>

<script>
import CommentList from "./components/CommentList";
import CommentInput from "./components/CommentInput";
import { getNewsContent, voteNews } from "@/api/api";
export default {
  components: {
    CommentInput,
    CommentList
  },
  data() {
    return {
      articleId: this.$route.params.id,
      title: "",
      updateTime: "",
      sourceName: "",
      nickName: "",
      contentHtml: "",
      isVote: false,
      readingQuantity: 0,
      voteNumber: 0
    };
  },
  created() {
    this.loadContentData();
  },
  methods: {
    loadContentData() {
      getNewsContent({
        articleId: this.articleId
      }).then(
        res => {
          this.contentHtml = res.contentHtml;
          this.title = res.title;
          this.updateTime = res.updateTime;
          this.readingQuantity = res.readingQuantity;
          this.isVote = res.isVote;
          this.sourceName = res.sourceName;
          this.voteNumber = res.voteNumber;
        },
        e => this.showMessage(e.data.message)
      );
    },
    voteArticle() {
      voteNews({
        articleId: this.articleId
      }).then(
        res => {
          this.isVote = !this.isVote;
          if (this.isVote) this.voteNumber++;
          else this.voteNumber--;
        },
        e => this.showMessage(e.data.message)
      );
    },
    resetComment() {
      this.$refs.commentList.reset();
    }
  }
};
</script>

<style lang="stylus" scoped>
.news-content>>>p
  margin: 5px 0
  text-indent: 32px

.news-content>>>a
  color: #07f

  &:hover
    text-decoration: underline

.news-content>>>img, .news-content>>>table
  max-width: 750px
  margin: 20px 0
  word-break: break-all

.news-content>>>ul, .news-content>>>h1, .news-content>>>h2, .news-content>>>h3, .news-content>>>h4
  padding: 5px 0

.news-content>>>ul, .news-content>>>li
  padding: 3px 5px

.news-content>>>video
  position: relative
  margin: 0 auto
  width: 90%
  background-color: #dfdfdf

.news-title
  font-size: 22px
  margin: 40px auto 20px
  text-align: center
  font-weight: bold

.news-info
  color: #999999
  letter-spacing: 1px
  margin: 10px 0 40px
  text-align: center

  .el-icon-time
    margin-right: 5px

  .updateTime
    margin-right: 10px

  .system
    color: #DD0E0E

.news-content
  font-size: 16px
  line-height: 24px
  color: #333
  padding: 0 20px
  min-width: 400px
  text-align: justify
  margin-bottom: 20px

.clearfix
  min-width: 400px
  padding: 0 30px

  .news-reading
    font-size: 16px
    color: #9b9b9b
    float: left
    padding: 15px 0

    .readnum
      margin-left: 3px

  .like-btn
    padding: 15px 0
    cursor: pointer
    font-size: 17px
    color: #9b9b9b
    float: right

    &:hover
      color: #2487EE

  .hasvote
    color: #2487EE
</style>