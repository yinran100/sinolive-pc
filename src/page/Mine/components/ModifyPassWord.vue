<template>
  <el-dialog
    class="dialog-wrapper"
    title="修改密码"
    :visible="dialogFormVisible"
    @close="closeDialog()"
    :close-on-click-modal="false"
  >
    <el-form
      v-show="oldMode"
      :model="oldPasswordForm"
      label-width="80px"
      ref="oldPasswordForm"
      :rules="oldPasswordRules"
      status-icon
    >
      <el-form-item
        label="旧密码"
        prop="passwordOld"
      >
        <el-input
          v-model="oldPasswordForm.passwordOld"
          type='password'
        ></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="password1"
      >
        <el-input
          v-model="oldPasswordForm.password1"
          type='password'
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="password2"
      >
        <el-input
          v-model="oldPasswordForm.password2"
          type='password'
        ></el-input>
      </el-form-item>
    </el-form>

    <el-form
      class="login-form"
      v-show="!oldMode&&step==0"
      label-width="80px"
      :model="loginForm"
      ref="loginForm"
      :rules="loginRules"
      status-icon
    >
      <el-form-item
        prop="phoneNumber"
        label="手机号"
      >
        <el-input
          type="tel"
          v-model.trim="loginForm.phoneNumber"
          autofocus
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="verifyCode"
        label="验证码"
      >
        <el-input
          :class="{'able':countDown==0}"
          type="tel"
          v-model.trim="loginForm.verifyCode"
        >
          <el-button
            slot="append"
            @click="getCode('loginForm',0)"
          >{{btnMsg}}</el-button>
        </el-input>
      </el-form-item>
      <el-button
        type="text"
        v-show="showVoiceTip"
        @click="getCode('loginForm',1)"
      >收不到短信?试试语音验证码</el-button>
    </el-form>
    <el-form
      v-show="!oldMode&&step==1"
      label-width="80px"
      :model="passwordForm"
      ref="passwordForm"
      :rules="passwordRules"
      status-icon
    >
      <el-form-item
        prop="password1"
        label="新密码"
      >
        <el-input
          type="password"
          v-model="passwordForm.password1"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="password2"
        label="确认密码"
      >
        <el-input
          type="password"
          v-model="passwordForm.password2"
        ></el-input>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        class="text-btn"
        @click="oldMode=!oldMode"
      >{{toggleText}}</el-button>
      <el-button @click="closeDialog()">取 消</el-button>
      <el-button
        type="primary"
        @click="comfirm()"
        :loading="btnLoading"
      >{{confirmButtonText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import md5 from "js-md5";
import {
  getState,
  login,
  checkCode,
  modifyPwd,
  modifyPwdWithOld,
  checkVoiceCode
} from "@/api/api";
import encryptByDES from "@/assets/js/crypto";
export default {
  name: "ModifyPassWord",
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
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
    let validatePassOld = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 32) {
        callback(new Error("密码长度在6~32之间"));
      } else {
        callback();
      }
    };
    let validatePass1 = formName => {
      return (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (value.length < 6 || value.length > 32) {
          callback(new Error("密码长度在6~32之间"));
        } else {
          if (this[formName].password2 !== "") {
            this.$refs[formName].validateField("password2");
          }
          callback();
        }
      };
    };
    let validatePass2 = formName => {
      return (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value.length < 6 || value.length > 32) {
          callback(new Error("密码长度在6~32之间"));
        } else if (value !== this[formName].password1) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
    };
    return {
      oldPasswordForm: {
        password1: "",
        password2: "",
        passwordOld: ""
      },
      oldPasswordRules: {
        passwordOld: [{ validator: validatePassOld, trigger: "blur" }],
        password1: [
          { validator: validatePass1("oldPasswordForm"), trigger: "blur" }
        ],
        password2: [
          { validator: validatePass2("oldPasswordForm"), trigger: "blur" }
        ]
      },
      loginForm: {
        phoneNumber: "", //手机号
        verifyCode: "" //验证码
      },
      loginRules: {
        phoneNumber: [{ validator: validatePhoneNumber, trigger: "blur" }],
        verifyCode: [{ validator: validateVerifyCode, trigger: "blur" }]
      },
      passwordForm: {
        password1: "",
        password2: ""
      },
      passwordRules: {
        password1: [
          { validator: validatePass1("passwordForm"), trigger: "blur" }
        ],
        password2: [
          { validator: validatePass2("passwordForm"), trigger: "blur" }
        ]
      },
      countDown: 0,
      tip: "",
      timer: null,
      oldMode: true,
      step: 0,
      secretmobile: "",
      btnLoading: false,
      codeSymbol: 1,
      showVoiceTip: false,
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
      return this.oldMode ? "忘记密码?使用手机验证码修改" : "使用原密码修改";
    },
    confirmButtonText() {
      return this.oldMode ? "确认" : this.step == 0 ? "下一步" : "确认密码";
    }
  },
  watch: {
    countDown(val) {
      if (val <= 5) this.showVoiceTip = true;
    }
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
        stationsymbol: this.codeSymbol,
        sign: theSign
      }).then(
        res => {
          this.$store.commit("saveStateInfo", res.state);
          if (type == 0) {
            this.codeCountDown(); //开始倒计时
          } else this.sendVoiceDialog();
          if (res.code == 2) {
            this.$store.commit("saveStateInfo", res.state);
            setTimeout(() => {
              this.getCode(formName, type);
            }, 500);
          }
        },
        () => {}
      );
    },
    sendVoiceDialog() {
      this.$alert("我们将通过电话方式告知您验证码，请注意接听", "语音验证码", {
        type: "info"
      }).then(() => {});
    },
    comfirm() {
      let formName = this.oldMode
        ? "oldPasswordForm"
        : this.step == 0
        ? "loginForm"
        : "passwordForm";
      let isOk = false;
      this.$refs[formName].validate(valid => {
        isOk = !!valid;
      });
      if (!isOk) return;
      this.btnLoading = true;
      let result;
      if (this.oldMode) {
        result = modifyPwdWithOld({
          passwordold: encryptByDES(
            this.oldPasswordForm.passwordOld,
            this.mysqlDataTripleEcbDesKey
          ),
          password1: encryptByDES(
            this.oldPasswordForm.password1,
            this.mysqlDataTripleEcbDesKey
          ),
          password2: encryptByDES(
            this.oldPasswordForm.password2,
            this.mysqlDataTripleEcbDesKey
          )
        });
      } else {
        if (this.step == 0) {
          let timestamp = Math.floor(new Date().getTime() / 1000) + "";
          let theSign = md5(
            `${this.loginForm.phoneNumber}${this.loginForm.verifyCode}${
              this.systemInfo.usersource
            }${this.stateInfo}${this.systemInfo.channel}${
              this.systemInfo.version
            }${timestamp}${this.systemInfo.privateKey}`
          ); //验证验证码
          return login({
            mobile: this.loginForm.phoneNumber,
            code: this.loginForm.verifyCode,
            state: this.stateInfo,
            timestamp,
            ischange: true,
            sign: theSign,
            stationsymbol: this.codeSymbol
          }).then(
            res => {
              this.btnLoading = false;
              if (res.code != 1) return this.showMessage(res.message);
              this.secretmobile = res.data.secretmobile;
              this.step = 1;
            },
            e => this.showMessage(e.data.message)
          );
        }
        result = modifyPwd({
          secretmobile: this.secretmobile,
          password1: encryptByDES(
            this.passwordForm.password1,
            this.mysqlDataTripleEcbDesKey
          ),
          password2: encryptByDES(
            this.passwordForm.password2,
            this.mysqlDataTripleEcbDesKey
          )
        });
      }
      result.then(
        res => {
          if (res.code != 1) {
            return;
          }
          this.$message({
            message: "密码修改成功",
            type: "success"
          });
          this.closeDialog();
        },
        e => {}
      );
    },
    closeDialog() {
      this.btnLoading = false;
      this.showVoiceTip = false;
      this.step = 0;
      this.$refs.passwordForm.resetFields();
      this.$refs.loginForm.resetFields();
      this.$refs.oldPasswordForm.resetFields();
      this.$emit("close");
    }
  }
};
</script>

<style lang="stylus" scoped>
.dialog-wrapper>>>.el-dialog
  padding: 15px 50px 5px
  width: 35%
  min-width: 400px

.able>>>.el-input-group__append
  background-color: #409EFF
  color: #fff

.text-btn
  float: left
</style>
