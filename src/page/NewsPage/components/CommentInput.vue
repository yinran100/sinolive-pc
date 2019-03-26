<template>
  <el-card>
    <div class="wrapper-tiltle">发表评论</div>

    <div class="input-wrapper">
      <div class="photo-wrapper">
        <img
          :src="userMsg.avatar"
          alt=""
        >
      </div>
      <div class="wrapper-right">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="说点什么吧..."
          v-model="commentText"
          clearable
        ></el-input>
      </div>
    </div>
    <el-button
      type="primary"
      @click="commit"
    >发布</el-button>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import { commitComment } from "@/api/api";
export default {
  props: {
    articleId: { required: true }
  },
  data() {
    return {
      commentText: ""
    };
  },
  computed: {
    ...mapState(["userMsg"])
  },
  methods: {
    commit() {
      this.commentText = this.commentText.trim();
      if (this.commentText.length <= 2) {
        this.$message.warning({
          message: "字数不足，请多说点什么吧",
          center: true
        });
        return;
      }
      commitComment({
        refid: this.articleId,
        content: this.commentText,
        type: 1 //1代表文章评论
      }).then(
        res => {
          if (res.code == 1) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.commentText = "";
            this.$emit("success");
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        },
        e => this.showMessage(e.data.message)
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.input-wrapper>>>.el-textarea__inner
  max-height: 69px

.el-card
  padding: 20px 30px

.wrapper-tiltle
  color: #000
  font-size: 18px
  margin-bottom: 15px

  &:before
    border-left: 3px solid #209EF2
    content: ''
    margin-right: 10px

.input-wrapper
  display: flex
  align-items: center

  .photo-wrapper
    width: 70px
    height: 70px
    margin-right: 20px
    background-color: #dfdfdf
    border-radius: 50%
    border: 1px solid #DADADA

    img
      width: 100%
      height: 100%
      border-radius: 50%

  .wrapper-right
    flex: 1

.el-button
  float: right
  margin: 10px 0 0
</style>
