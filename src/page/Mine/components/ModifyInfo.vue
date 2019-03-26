<template>
  <el-card class="person-wrapper">
    <div class="wrapper-tiltle">个人信息</div>
    <ul class="person-info">
      <li>
        <label class="item">昵称</label>
        <el-input
          v-show="showNameInput"
          ref="nameInput"
          @blur="changeNickName"
          autofocus
          v-model="newUserName"
        >
        </el-input>
        <div
          class="info"
          v-show="!showNameInput"
        >
          <span>{{userMsg.nickname}}</span>
          <a
            class="modify-btn"
            href="javascript: void(0);"
            @click="editName"
          ><i
              class="el-icon-edit"
              style="color: #008cc8;"
            ></i> 编辑</a>

        </div>
      </li>
      <li>
        <label class="item">手机号</label>
        <div class="info">{{hidePhone}}</div>
      </li>
      <li>
        <label class="item">登录密码</label>
        <div class="info">******
          <a
            class="modify-btn"
            href="javascript: void(0);"
            @click="dialogFormVisible=true"
          ><i
              class="el-icon-edit"
              style="color: #008cc8;"
            ></i> 编辑</a>
        </div>
      </li>
    </ul>
    <div
      class="wrapper-tiltle"
      v-show="Object.keys(userInfo).length!=0"
    >站主信息</div>
    <ul
      class="person-info"
      v-if="Object.keys(userInfo).length!=0"
    >
      <li>
        <label class="item">姓名</label>
        <div class="info">{{userInfo.userName}}</div>
      </li>
      <li>
        <label class="item">身份证号</label>
        <div class="info">{{userInfo.idCard}}</div>
      </li>
      <li>
        <label class="item">站点编号</label>
        <div class="info">{{userInfo.stationCode}}</div>
      </li>
      <li>
        <label class="item">站点地址</label>
        <div class="info">{{userInfo.address}}</div>
      </li>
    </ul>
    <modify-pass-word
      :dialogFormVisible="dialogFormVisible"
      @close='dialogFormVisible=false'
    ></modify-pass-word>
  </el-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { modifyNickname, getSationInfo } from "@/api/api";
import ModifyPassWord from "./ModifyPassWord";
export default {
  name: "ModifyInfo",
  components: {
    ModifyPassWord
  },
  data() {
    return {
      dialogFormVisible: false,
      newUserName: "",
      showNameInput: false,
      userInfo: {}
    };
  },
  computed: {
    ...mapState(["userMsg"]),
    ...mapGetters(["hidePhone"])
  },
  created() {
    getSationInfo().then(
      res => {
        this.userInfo = res.data;
      },
      e => this.showMessage(e.data.message)
    );
  },
  methods: {
    editName() {
      this.showNameInput = true;
      setTimeout(() => {
        this.newUserName = this.userMsg.nickname;
        this.$refs.nameInput.focus();
      }, 200);
    },
    changeNickName() {
      this.showNameInput = false;
      if (this.newUserName == this.userMsg.nickname) return;
      if (this.newUserName.length > 15 || this.newUserName.length <= 1) {
        return this.$message({
          message: "昵称长度长度在2~15个之间",
          type: "error"
        });
      } else {
        modifyNickname({
          nickname: this.newUserName
        }).then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$store.commit("saveUserMsg", { nickname: res.data });
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.person-wrapper
  padding: 20px 30px
  margin-bottom: 20px

  .wrapper-tiltle
    color: #000
    font-size: 18px
    margin-bottom: 15px

    &:before
      border-left: 3px solid #209EF2
      content: ''
      margin-right: 10px

  .person-info
    margin: 20px auto

    li
      display: flex
      align-items: center
      margin-bottom: 10px
      font-size: 14px

      .item
        width: 120px
        line-height: 15px
        padding: 15px 0
        text-align: center
        background-color: #EBEEF5
        color: #303133
        margin-right: 8px
        font-weight: 700

      .info
        flex: 1
        line-height: 15px
        padding: 15px 0 15px 22px
        border-bottom: 1px solid #EBEEF5

        .modify-btn
          float: right
          color: #606266
          font-size: 14px

          &:hover
            color: #008cc8

      .el-input
        flex: 1
</style>
