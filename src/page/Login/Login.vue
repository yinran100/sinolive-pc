<template>
  <el-container
    direction="vertical"
    @keyup.enter="enter('loginForm')"
  >
    <div class="login-wrapper">
      <img
        class="login-img"
        src="@/assets/images/logo_name_white.png"
        alt=""
      >
      <div class="login-box">
        <div class="login-head">学员登录</div>
        <div class="login-body">

          <el-form
            class="login-form"
            :model="loginForm"
            ref="loginForm"
            :rules='rules'
            v-show="!passwordModel"
          >
            <el-form-item prop="phoneNumber">
              <el-input
                type="tel"
                placeholder="手机号"
                v-model.trim="loginForm.phoneNumber"
                autofocus
              ></el-input>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-input
                :class="{'able':countDown==0}"
                type="tel"
                placeholder="验证码"
                v-model.trim="loginForm.verifyCode"
              >
                <el-button
                  slot="append"
                  @click="getCode('loginForm',0)"
                >{{btnMsg}}</el-button>
              </el-input>
            </el-form-item>
            <el-button
              class="text-btn"
              type="text"
              v-show="showVoiceTip"
              @click="getCode('loginForm',1)"
            >收不到短信?试试语音验证码</el-button>
          </el-form>
          <el-form
            class="password-form"
            :model="passwordForm"
            ref="passwordForm"
            :rules='passwordRules'
            v-show="passwordModel"
          >
            <el-form-item prop="phoneNumber">
              <el-input
                type="tel"
                placeholder="手机号"
                v-model.trim="passwordForm.phoneNumber"
                autofocus
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="密码"
                v-model="passwordForm.password"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <div class="btn-wrap">
            <el-button
              type="success"
              @click="enter()"
            >登 录</el-button>
            <el-button @click="passwordModel=!passwordModel">{{toggleText}}<i class="el-icon-arrow-right"></i></el-button>
            <p class="tips">{{tip}}</p>
          </div>

        </div>
      </div>
    </div>
    <home-footer></home-footer>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import md5 from "js-md5";
import {
  getState,
  checkCode,
  login,
  checkVoiceCode,
  loginByPwd
} from "@/api/api";
import HomeFooter from "@/components/HomeFooter";
import encryptByDES from "@/assets/js/crypto";
export default {
  name: "Login",
  components: {
    HomeFooter
  },
  data() {
    let validatePhoneNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error("手机号格式有误"));
      } else callback();
    };
    let validateVerifyCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else if (!/^\d{6}$/.test(value)) {
        callback(new Error("验证码应为6位数字"));
      } else callback();
    };
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else callback();
    };
    return {
      loginForm: {
        phoneNumber: "", //手机号
        verifyCode: "" //验证码
      },
      rules: {
        phoneNumber: [{ validator: validatePhoneNumber, trigger: "blur" }],
        verifyCode: [{ validator: validateVerifyCode, trigger: "blur" }]
      },
      passwordForm: {
        phoneNumber: "", //手机号
        password: "" //密码
      },
      passwordRules: {
        phoneNumber: [{ validator: validatePhoneNumber, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }]
      },
      countDown: 0,
      tip: "",
      showVoiceTip: false,
      codeSymbol: 1,
      passwordModel: false,
      timer: null,
      mysqlDataTripleEcbDesKey: "C904F869415E8B9FU644E667"
    };
  },
  computed: {
    ...mapState(["systemInfo", "stateInfo"]),
    btnMsg() {
      return this.countDown == 0
        ? "获取验证码"
        : `${this.countDown}秒后重新获取`;
    },
    toggleText() {
      return this.passwordModel ? "手机验证码登录" : "密码登录";
    }
  },
  watch: {
    countDown(val) {
      if (val <= 5) this.showVoiceTip = true;
    }
  },
  mounted() {
    getState();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    codeCountDown() {
      this.countDown = 60;
      this.timer = setInterval(() => {
        if (this.countDown <= 0) {
          clearInterval(this.timer);
        } else {
          this.countDown--;
        }
      }, 1000);
    },
    sendVoiceDialog() {
      this.$alert("我们将通过电话方式告知您验证码，请注意接听", "语音验证码", {
        type: "info"
      }).then(() => {});
    },
    //******************获取验证码************************//
    getCode(formName, type) {
      if (this.countDown > 0) return;
      let error = "";
      this.$refs[formName].validateField("phoneNumber", errorMsg => {
        error = errorMsg;
      });
      if (error != "") return;

      let timestamp = Math.floor(new Date().getTime() / 1000) + "";
      let theSign = md5(
        `${this.loginForm.phoneNumber}${this.stateInfo}${
          this.systemInfo.usersource
        }${this.systemInfo.channel}${this.systemInfo.version}${timestamp}${
          this.systemInfo.privateKey
        }`
      );
      let postFunction = type == 0 ? checkCode : checkVoiceCode;
      postFunction({
        mobile: this.loginForm.phoneNumber,
        state: this.stateInfo,
        timestamp,
        sign: theSign,
        stationsymbol: this.codeSymbol
      }).then(res => {
        this.$store.commit("saveStateInfo", res.state);
        if (res.code == 2) {
          this.$store.commit("saveStateInfo", res.state);
          setTimeout(() => {
            this.getCode(formName, type);
          }, 500);
        } else if (res.code != 1) return this.showMessage(res.message);
        if (type == 0) {
          this.codeCountDown(); //开始倒计时
        } else this.sendVoiceDialog();
      });
    },
    sendVoiceDialog() {
      this.$alert("我们将通过电话方式告知您验证码，请注意接听", "语音验证码", {
        type: "info"
      }).then(() => {});
    },
    //******************登录/注册************************//
    enter() {
      this.tip = "";
      let formName = this.passwordModel ? "passwordForm" : "loginForm";
      let isOk = true;
      this.$refs[formName].validate((valid, pro) => {
        isOk = valid;
      });
      if (!isOk) return; //表单验证未通过
      let timestamp = Math.floor(new Date().getTime() / 1000) + "";
      let result;
      if (this.passwordModel) {
        let code = encryptByDES(
          this.passwordForm.password,
          this.mysqlDataTripleEcbDesKey
        );
        let theSign = md5(
          `${this.passwordForm.phoneNumber}${code}${
            this.systemInfo.usersource
          }${this.stateInfo}0${this.systemInfo.channel}${
            this.systemInfo.version
          }${timestamp}${this.systemInfo.privateKey}`
        );
        result = loginByPwd({
          state: this.stateInfo,
          mobile: this.passwordForm.phoneNumber,
          password: code,
          timestamp,
          sign: theSign,
          stationsymbol: this.codeSymbol
        });
      } else {
        let theSign = md5(
          `${this.loginForm.phoneNumber}${this.loginForm.verifyCode}${
            this.systemInfo.usersource
          }${this.stateInfo}${this.systemInfo.channel}${
            this.systemInfo.version
          }${timestamp}${this.systemInfo.privateKey}`
        );
        result = login({
          mobile: this.loginForm.phoneNumber,
          code: this.loginForm.verifyCode,
          state: this.stateInfo,
          stationsymbol: this.codeSymbol,
          timestamp,
          sign: theSign
        });
      }
      result.then(res => {
        if (res.code != 1) {
          this.tip = res.message;
          return this.showMessage(res.message);
        }
        this.textContent = "";
        //存token
        this.$store.commit("saveToken", res.data.sessionid);
        //存用户信息
        this.$store.commit("saveUserMsg", res.data);
        //cunstate
        this.$store.commit("saveStateInfo", res.state);
        //存已登录
        this.$store.commit("saveLogin", 1);
        this.$store.commit("saveLoginTime", timestamp);
        this.$store.commit("savePhone", this.loginForm.phoneNumber);
        console.log(res.message);
        this.$message({
          message: res.message,
          type: "success"
        });
        //跳转至上页面
        setTimeout(() => {
          this.$router.push(
            this.$route.query.redirect ? this.$route.query.redirect : `/`
          );
        }, 300);
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.able>>>.el-input-group__append
  background-color: #409EFF
  color: #fff

.el-container
  background: url('../../assets/images/back-img.png') no-repeat

  .login-wrapper
    width: 762px
    height: 379px
    position: relative
    margin: 290px auto 180px
    background-color: rgba(32, 158, 242, 0.4)
    display: flex
    align-items: center

    .login-img
      width: 197px
      height: 44px
      margin: 0 92px

    .login-box
      flex: 1
      display: flex
      flex-direction: column
      align-items: center
      height: 100%

      .login-head
        width: 100%
        line-height: 57px
        font-size: 22px
        text-align: center
        color: #fff
        background-color: #209EF2

      .login-body
        flex: 1
        padding: 15px 60px
        background-color: #fff

        .el-form
          .el-input
            margin: 5px 0

        .text-btn
          padding: 0
          margin-bottom: 5px
          float: right

        .btn-wrap
          width: 100%
          margin: auto

          .el-button
            letter-spacing: 3px
            margin: 5px 0
            width: 100%

          .tips
            color: #f56c6c
            font-size: 13px
            line-height: 1
</style>
