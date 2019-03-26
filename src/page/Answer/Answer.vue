<template>
  <el-row
    type="flex"
    justify="space-around"
  >
    <el-col
      :sm="24"
      :md="20"
      :lg="16"
    >
      <div class="exam-title clearfix">
        <el-button
          class="exit-btn"
          type="danger"
          icon="el-icon-back"
          circle
          @click="exit"
        ></el-button>
        <p>{{title}}</p>
      </div>
      <div v-loading="loading">
        <div
          class="exam-time"
          v-show="!viewModel&&!isOver"
        >
          <div class="countdown">离考试结束还有<span class="time">{{timeStr}}</span></div>
          <el-progress
            :percentage="currentRate"
            :stroke-width="12"
            :color="countdown>60?'#409EFF':'#F56C6C'"
            :show-text="false"
          ></el-progress>
        </div>
        <el-card v-show="!isOver">
          <div
            class="index-num"
            v-if="viewModel"
          >{{numStr}}</div>
          <el-steps
            :active="currentIndex"
            process-status="wait"
            v-else
          >
            <el-step
              v-for="(item,index) in totalIndex"
              :key="index"
            ></el-step>
          </el-steps>
          <p class="question">
            <span class="question-type">{{questionObject.Questiontype==2?"【多选】":"【单选】"}}</span>
            {{ questionObject.Questionname }}
          </p>
          <div class="option-wrapper">
            <el-radio-group
              v-model="answer"
              v-show="questionObject.Questiontype==1"
            >
              <el-radio
                v-for="item in questionObject.Option"
                :label="item.Value"
                :key="item.Value"
                :disabled="viewModel"
              >{{item.Value}}. {{item.Name}}</el-radio>
            </el-radio-group>
            <el-checkbox-group
              v-model="answer"
              v-show="questionObject.Questiontype==2"
            >
              <el-checkbox
                v-for="item in questionObject.Option"
                :label="item.Value"
                :key="item.Value"
                :disabled="viewModel"
              >{{item.Value}}. {{item.Name}}</el-checkbox>
            </el-checkbox-group>
            <p
              class="correct-answer"
              v-show="viewModel"
            >正确答案：{{questionObject.Questionanswer}}</p>
          </div>
          <div class="clearfix">
            <el-button-group v-show="viewModel">
              <el-button
                type="primary"
                :disabled="viewModel&&examQuestionIndex==0"
                @click="previous"
                icon="el-icon-arrow-left"
              >上一题</el-button>
              <el-button
                type="primary"
                :disabled="viewModel &&
          examQuestionIndex == examQuestion.length - 1"
                @click="next"
              >下一题<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
            <el-button
              class="next-btn"
              type="primary"
              v-show="!viewModel"
              :disabled="this.answer.length == 0"
              @click="getQuestion"
              :loading="nextloading"
            >{{textmsg}}</el-button>
          </div>
        </el-card>
        <el-card v-show="isOver">

          <div class="mark">
            <div class="result-icon">
              <i
                class="el-icon-success"
                v-if="examInfo.sign==1"
              ></i>
              <i
                class="el-icon-error"
                v-else
              ></i>
            </div> 本考试成绩为：
            <span
              class="mark-number"
              :class="{pass:examInfo.sign==1}"
            >{{examInfo.Mark}}</span>分
          </div>
          <div class="detail-info">
            <p>正确 : <span class="correct">{{ examInfo.Right }}</span></p>
            <p>错误 : <span class="error">{{ examInfo.Wrong }}</span></p>
          </div>
          <div class="end-date">考试截止时间：{{examInfo.Enddate*1000|timeMoment}}</div>
          <div class="btn-group">
            <el-button
              @click="retryExam"
              type="warning"
              plain
              round
            >重新考试</el-button>
            <el-button
              @click="viewExamDetail"
              type="primary"
              plain
              round
            >查看考试详情</el-button>
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { joinExam, repareExam, viewExam } from "@/api/api";
import ExamDetail from "./ExamDetail";
export default {
  name: "Answer",
  components: { ExamDetail },
  data() {
    return {
      examid: this.$route.params.id,
      loading: true,
      answer: [], //提交的答案
      paperName: "", //考试题目
      nextloading: false,
      questionObject: {}, //当前的考题
      isOver: false, // 是否答完结束了
      countdown: 360, //剩余时长
      examtime: 360, //考试总时长
      examInfo: {}, //考试结果
      counter: null, //倒计时对象
      viewModel: false, //true为查看试卷，false为答题
      examQuestion: [], //试卷考题集
      testPaper: {}, //查看试卷
      examQuestionIndex: 0 //当前阅览的考题序号
    };
  },
  computed: {
    title() {
      if (this.viewModel) return this.testPaper.Papername;
      return this.isOver ? this.examInfo.Papername : this.paperName;
    },
    currentIndex() {
      if (this.isOver) return 0;
      if (this.viewModel) return this.examQuestionIndex;
      return this.questionObject.Answernum - 1 || 0;
    },
    totalIndex() {
      if (this.isOver) return 0;
      return this.viewModel
        ? this.examQuestion.length
        : this.questionObject.Nums;
    },
    numStr() {
      if (this.isOver) return "";
      if (this.viewModel)
        return this.examQuestionIndex + 1 + "/" + this.examQuestion.length;
      return this.questionObject.Answernum
        ? this.questionObject.Answernum + "/" + this.questionObject.Nums
        : "0/0";
    },
    timeStr() {
      let hour = Math.floor(this.countdown / 3600);
      let lasttime = parseInt(this.countdown % 3600);
      let minutes = Math.floor(lasttime / 60);
      let seconds = parseInt(lasttime % 60);
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      if (hour > 0) return hour + ":" + minutes + ":" + seconds;
      else return minutes + ":" + seconds;
    },
    currentRate() {
      return (this.countdown / this.examtime).toFixed(4) * 100;
    },
    textmsg() {
      return this.questionObject.Answernum >= this.questionObject.Nums
        ? "完成答题"
        : "下一题";
    }
  },
  created() {
    this.getQuestion();
  },
  beforeDestroy() {
    clearInterval(this.counter);
  },

  methods: {
    previous() {
      if (this.viewModel) {
        this.examQuestionIndex = Math.max(this.examQuestionIndex - 1, 0);
        this.questionObject = this.examQuestion[this.examQuestionIndex];
        this.answer = this.questionObject.Answer;
      }
    },
    next() {
      this.examQuestionIndex = Math.min(
        this.examQuestionIndex + 1,
        this.examQuestion.length - 1
      );
      this.questionObject = this.examQuestion[this.examQuestionIndex];
      if (this.questionObject.Questiontype == 1)
        this.answer = this.questionObject.Answer;
      else this.answer = this.questionObject.Answer.split("");
    },
    getQuestion() {
      this.nextloading = true;
      joinExam({
        examquestionid: this.questionObject.Id || "",
        answer: Array.isArray(this.answer) ? this.answer.join("") : this.answer,
        examid: this.examid
      }).then(
        res => {
          this.answer = [];
          if (res.action == "finish") {
            clearInterval(this.counter);
            this.counter = null;
            this.examInfo = res.data[0];
            this.isOver = true;
          } else {
            this.questionObject = res.data[0];
            if (res.countdown) this.countdown = res.countdown;
            this.paperName = res.papername;
            if (res.examtime) this.examtime = res.examtime;
            if (!this.counter) {
              //进入页面第一次获取
              this.countDowns();
            }
          }
          this.nextloading = false;
          this.loading = false;
        },
        e => this.showMessage(e.data.message)
      );
    },
    retryExam() {
      repareExam({
        examid: this.examid
      }).then(
        res => {
          this.isOver = false;
          this.answer = [];
          this.questionObject = {};
          this.examQuestion = {};
          this.examQuestionIndex = 0;
          this.getQuestion();
        },
        e => this.showMessage(e.data.message)
      );
    },
    viewExamDetail() {
      //查看试卷
      viewExam({
        examid: this.examid
      }).then(
        res => {
          if (res.examQuestion) {
            this.examQuestion = res.examQuestion;
            this.viewModel = true;
            this.isOver = false;
            this.testPaper = res.testPaper;
            this.questionObject = this.examQuestion[this.examQuestionIndex];
            this.answer = this.questionObject.Answer;
          } else {
            this.$alert("本场考试没有添加考题", "查看失败", {
              type: "error"
            });
          }
        },
        e => this.showMessage(e.data.message)
      );
    },
    exit() {
      if (this.isOver) this.$router.go(-1);
      else if (this.viewModel) {
        this.viewModel = false;
        this.isOver = true;
      } else {
        this.$confirm(
          "离开考试后，倒计时仍会继续进行，直到考试结束。在【我的考试】中也可回到考试，继续答题。",
          "确定离开考试?",
          { type: "warning" }
        )
          .then(() => {
            this.$router.go(-1);
          })
          .catch(() => {});
      }
    },
    countDowns() {
      this.counter = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.counter);
          this.$alert("试卷已提交。", "考试时间到！", { type: "warning" }).then(
            () => {
              //   this.$router.push(this.$route.path);
              this.getQuestion();
              this.counter = null;
            }
          );
        }
      }, 1000);
    }
  }
};
</script>

<style lang="stylus" scoped>
.option-wrapper>>>.el-radio, .option-wrapper>>>.el-checkbox
  display: block
  white-space: unset
  line-height: 1.5

  .el-radio__label
    font-size: 16px

  .el-checkbox__label
    font-size: 16px

.option-wrapper>>>.el-radio+.el-radio, .option-wrapper>>>.el-checkbox+.el-checkbox
  margin-top: 15px
  margin-left: 0

.option-wrapper>>>.el-radio__input.is-disabled + span.el-radio__label
  color: #606266

.exam-title
  margin: 20px 10px
  font-size: 22px
  color: #222
  font-weight: bold
  text-align: center

  p
    line-height: 40.5px

  .exit-btn
    float: left

.exam-time
  margin: 30px auto
  padding: 0 20px

  .countdown
    font-size: 14px
    line-height: 1.5
    margin-bottom: 10px
    text-align: center

    .time
      font-size: 20px
      letter-spacing: 1px
      color: #E72959
      font-weight: bold

.el-card
  padding: 20px 30px

  .index-num
    text-align: right
    font-size: 18px
    line-height: 2
    color: #999

  .el-steps
    margin-bottom: 20px

  .question
    font-size: 16px
    line-height: 2

    .question-type
      color: #1D72CB

  .option-wrapper
    margin: 15px 0px 15px 30px

    .correct-answer
      margin-top: 10px
      font-size: 14px
      font-weight: bold
      color: #4986e6

  .next-btn, .el-button-group
    float: right

  .mark
    text-align: center
    font-size: 16px
    line-height: 45px

    .result-icon
      text-align: center
      font-size: 30px
      display: inline-block
      vertical-align: middle
      margin-right: 3px
      margin-top: -5px

      .el-icon-success
        color: #67C23A

      .el-icon-error
        color: #F56C6C

    .mark-number
      font-size: 24px
      color: #F56C6C
      font-weight: bold

    .pass
      color: #67C23A

  .detail-info
    margin-top: 15px
    font-size: 16px
    text-align: center

    p+p
      margin-top: 10px

    span
      font-weight: bold

    .correct
      color: #67C23A

    .error
      color: #F56C6C

  .end-date
    font-size: 14px
    margin-top: 20px
    color: #606266
    text-align: center

  .btn-group
    margin: 20px auto 0
    text-align: center
</style>
