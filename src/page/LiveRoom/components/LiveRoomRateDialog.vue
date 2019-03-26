<template>
  <el-dialog
    class="rate-wrapper"
    title="评价"
    :visible="dialogVisible"
    @close="closeDialog"
    center
    :close-on-click-modal="false"
  >
    <div class="rate">
      <span>请评分:</span>
      <el-rate
        v-model="rateVal"
        :texts="['很差', '失望', '一般', '满意', '超赞']"
        show-text
        text-color="#666"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
      >
      </el-rate>
    </div>

    <el-input
      type="textarea"
      :rows="3"
      :clearable="true"
      placeholder="点评两句吧..."
      v-model.trim="commentContent"
    >
    </el-input>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="commitRate"
      >提交</el-button>
    </div>
  </el-dialog>

</template>

<script>
export default {
  name: "LiveRoomRateDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rateVal: 5,
      commentContent: ""
    };
  },
  methods: {
    commitRate() {
      if (this.commentContent == "") {
        this.$message({
          message: "点评内容不能为空",
          type: "warning",
          center: true
        });
        return;
      } else if (this.commentContent.length > 500) {
        this.$message({
          message: "点评内容字数不能错过500",
          type: "warning",
          center: true
        });
        return;
      } else this.$emit("commit", this.commentContent, this.rateVal + "");
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="stylus" scoped>
.rate-wrapper>>>.el-textarea__inner
  max-height: 200px

.rate
  line-height: 20px
  font-size: 15px
  margin-bottom: 10px

  .el-rate
    margin-top: -2px
    margin-left: 5px
    display: inline-block
    vertical-align: middle
</style>
