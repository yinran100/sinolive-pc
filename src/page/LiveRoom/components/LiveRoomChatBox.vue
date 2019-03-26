<template>
  <div class="chat-box">
    <div class="chat-header"><span>互动聊天</span>
      <div class="views"><span class="viewNum">{{views}}</span>人在线观看</div>
    </div>
    <div class="chat-wrapper">
      <ul
        class="comment-ul"
        ref="commentUl"
      >
        <li
          class="comment-item"
          v-for="item in commentList"
          :key="item.id"
        >
          <span class="author">{{ item.username }}：</span>
          <span
            class="content"
            v-html="encodeQQFace(item.content)"
          ></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { encodeQQface } from "@/assets/js/qqface";
export default {
  name: "LiveRoomChatBox",
  props: {
    commentList: { type: Array, default: [] },
    views: { type: Number, default: 0 }
  },
  updated() {
    this.scrollBottom(); //滚动到最底部查看最近的信息
  },
  methods: {
    encodeQQFace(content) {
      return encodeQQface(content);
    },
    scrollBottom() {
      this.$refs.commentUl.scrollTop = this.$refs.commentUl.scrollHeight;
    }
  }
};
</script>
<style lang="stylus" scoped>
.content>>>.emotion
  width: 20px
  height: 20px

.chat-wrapper:-webkit-scrollbar
  display: none

.chat-box
  margin-top: 10px
  position: relative
  background-color: #fff
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  border-radius: 4px

  .chat-header
    border-bottom: 1px solid #E8E8E8
    line-height: 32px
    height: 32px
    color: #999999
    font-size: 14px
    padding: 0 5px

    .views
      float: right
      font-size: 13px

      .viewNum
        font-weight: bold
        color: #E72154

  .chat-wrapper
    height: 378px
    padding: 5px 10px

    .comment-ul
      overflow-y: auto
      overflow-x: hidden
      position: absolute
      top: 35px
      bottom: 3px
      left: 0
      right: 0

      .comment-item
        font-size: 14px
        margin: 2px 10px
        line-height: 20px
        word-wrap: break-word

        .author
          color: #4F9EFF
</style>
