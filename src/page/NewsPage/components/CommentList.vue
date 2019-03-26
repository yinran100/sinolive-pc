<template>
  <el-card class="comment-wrapper">
    <div class="clearfix">
      <div class="comment-title">全部评论</div>

    </div>
    <ul
      class="comment-list"
      v-if="commentList.length!=0"
    >
      <li
        class="comment-item"
        v-for="(item,index) in commentList"
        :key="item.id"
      >
        <div class="user-photo">
          <img
            class="user-img"
            :src="item.avatar"
            alt=""
          ></div>
        <div class="user-info">
          <div class="clearfix">
            <div class="user-name">{{item.username}}</div>
            <div
              class="comment-like"
              :class="{'hasvote':item.has_vote}"
            >
              <span
                class="iconfont"
                @click="likeClick(index)"
              >{{item.has_vote?"&#xe870;":"&#xe871;"}}</span>
              赞{{item.vote}}
            </div>
          </div>
          <div class="comment-content">{{item.content}}</div>
          <Time
            class="date"
            :time="item.created_ts"
          />
        </div>
      </li>
    </ul>
    <el-alert
      v-else
      title="没有人评论~"
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
          @click="loadCommentList"
        >查看更多</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { voteComment, getCommentList } from "@/api/api";
export default {
  name: "CommentList",
  props: {
    articleId: { required: true }
  },
  data() {
    return {
      page: 1,
      offset: 10,
      commentList: [],
      noMoreData: false
    };
  },
  created() {
    this.loadCommentList();
  },
  methods: {
    loadCommentList() {
      getCommentList({
        refid: this.articleId,
        p: this.page,
        offset: this.offset,
        type: 1
      }).then(
        res => {
          if (
            res.data &&
            res.data.comments &&
            res.data.comments.length < this.offset
          ) {
            this.noMoreData = true;
          }
          this.page++;
          this.commentList = this.commentList.concat(res.data.comments);
        },
        e => this.showMessage(e.data.message)
      );
    },
    likeClick(index) {
      voteComment({
        id: this.commentList[index].id,
        action: this.commentList[index].has_vote ? 0 : 1
      }).then(
        res => {
          this.commentList[index].has_vote = !this.commentList[index].has_vote;
          this.commentList[index].vote = res.data.has_vote
            ? this.commentList[index].vote + 1
            : this.commentList[index].vote - 1;
        },
        e => this.showMessage(e.data.message)
      );
    },
    reset() {
      this.page = 1;
      this.commentList = [];
      this.loadCommentList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.comment-list>>>.date
  color: #b7b7b7
  margin-top: 5px
  font-size: 14px

.comment-wrapper
  padding: 20px 30px
  margin: 20px 0

.clearfix
  .comment-title
    float: left
    font-size: 18px
    line-height: 2
    color: #000
    margin-bottom: 10px

    &:before
      border-left: 3px solid #209EF2
      content: ''
      margin-right: 10px

  .comment-btn
    float: right
    color: #2487EE

.comment-list
  .comment-item
    padding: 0.2rem 0
    display: flex

    .user-photo
      width: 70px
      height: 70px
      float: left
      margin-right: 15px
      border-radius: 50%
      background-color: #dfdfdf

      .user-img
        border-radius: 50%
        width: 100%
        height: 100%

    .user-info
      flex: 1

      .user-name
        float: left
        font-size: 18px
        font-weight: bold
        color: #2487EE

      .comment-content
        font-size: 16px
        line-height: 1.5
        word-break: break-all

      .comment-like
        font-size: 16px
        cursor: pointer
        color: #777
        float: right

        &:hover
          color: #2487EE

      .hasvote
        color: #2487EE
</style>
