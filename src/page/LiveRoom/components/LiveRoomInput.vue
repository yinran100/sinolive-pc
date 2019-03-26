<template>
  <div class="input-wrapper">
    <el-input
      type="textarea"
      :rows="2"
      :clearable="true"
      placeholder="吐槽两句吧..."
      v-model.trim="commentContent"
    >
    </el-input>

    <el-button
      size="small"
      type="primary"
      @click="commit"
    >发送</el-button>
  </div>
</template>

<script>
export default {
  name: "LiveRoomInput",
  data() {
    return {
      commentContent: ""
    };
  },
  methods: {
    clear() {
      this.commentContent = "";
    },
    commit() {
      if (this.commentContent == "") {
        this.$message({
          message: "发送内容不能为空哦",
          type: "warning"
        });
      } else if (this.commentContent.length > 500) {
        this.$message.error("评论字数不能超过500(包括空格和标点符号)");
      } else {
        this.$emit("commit", this.escapeHtml(this.commentContent));
      }
    },
    escapeHtml(str) {
      let s = str.replace(/&/g, "&amp;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      s = s.replace(/\n/g, "<br>");
      return s;
    }
  }
};
</script>

<style lang="stylus" scoped>
.input-wrapper>>>.el-textarea__inner
  max-height: 69px

.input-wrapper
  background-color: #ffffff
  margin-top: 10px
  height: 110px
  padding: 5px 5px 0
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  border-radius: 4px

  .el-button
    padding: 5px 15px
    float: right
    margin-top: 5px
</style>