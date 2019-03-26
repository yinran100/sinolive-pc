<template>
  <div>
    <live-room-header
      ref="header"
      :tittle="videoInfo.Name"
      @showrate="showRate"
      @gotoexam="gotoExam"
    ></live-room-header>
    <el-row
      class="live-container"
      type="flex"
      justify="space-around"
      :style="{'minHeight':minHeight+'px'}"
    >
      <el-col
        :sm="24"
        :md="22"
        :lg="20"
      >
        <el-row
          class="live-content"
          :gutter="20"
        >
          <el-col
            class="player-container"
            :span="18"
          >
            <div
              id="player-con"
              class="video-wrapper"
            ></div>

          </el-col>
          <el-col
            :span="6"
            class="aside"
          >
            <live-room-trainer ref='trainerData'></live-room-trainer>
            <live-room-chat-box
              class="comment-box"
              :commentList="commentList"
              :views="videoInfo.Views"
              ref="commentBox"
            ></live-room-chat-box>
            <live-room-input
              @commit="addComment"
              ref="commentInput"
            ></live-room-input>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <live-room-rate-dialog
      :dialogVisible="dialogVisible"
      @commit="gradeLive"
      @closeDialog="()=>dialogVisible=false"
    ></live-room-rate-dialog>
    <home-footer ref="footer"></home-footer>
  </div>
</template>

<script >
import { mapGetters, mapState } from "vuex";
import LiveRoomHeader from "./components/LiveRoomHeader";
import LiveRoomTrainer from "./components/LiveRoomTrainer";
import LiveRoomChatBox from "./components/LiveRoomChatBox";
import LiveRoomInput from "./components/LiveRoomInput";
import LiveRoomRateDialog from "./components/LiveRoomRateDialog";
import HomeFooter from "@/components/HomeFooter";
import { Base64 } from "js-base64";
import {
  getLiveVoteInfo,
  voteLive,
  getLiveDetail,
  getCommentList,
  commitComment,
  addView,
  gradeLive
} from "@/api/api";
export default {
  name: "LiveRoom",
  components: {
    LiveRoomHeader,
    LiveRoomTrainer,
    LiveRoomChatBox,
    LiveRoomInput,
    LiveRoomRateDialog,
    HomeFooter
  },
  data() {
    return {
      liveid: this.$route.params.id,
      videoInfo: { Userid: "", Views: 0 },
      img: null,
      errorTimes: 0,
      player: null,
      commentList: [],
      internal: null,
      gotOneData: {},
      websock: null,
      has_vote: false,
      vote: 0,
      dialogVisible: false,
      interval: null,
      timer: null,
      extralHeight: 0
    };
  },
  computed: {
    ...mapState(["minClientHeight"]),
    ...mapGetters(["wsuri"]),
    minHeight() {
      return this.minClientHeight - this.extralHeight;
    }
  },
  created() {
    this.initLive();
    this.getCommentList();
    this.initWebSocket(); //用于接收评论推送
  },
  mounted() {
    this.extralHeight =
      this.$refs.header.$el.clientHeight + this.$refs.footer.$el.clientHeight;
  },
  beforeDestroy() {
    if (this.internal) clearInterval(this.internal);
    if (this.interval) clearInterval(this.interval);
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    initLive() {
      //获取直播详情
      getLiveDetail({
        liveid: this.liveid
      }).then(res => {
        if (res.data.length > 0) {
          this.videoInfo = res.data[0];
          document.title = `尊信培训_${this.videoInfo.Name}`;
        } else {
          console.log("没有直播数据");
          this.showMessage("没有直播数据");
        }
        if (!this.player) this.initPlayer();
      });
    },
    initPlayer() {
      this.$refs.trainerData.getTrainDetail(this.videoInfo.Userid); //培训师框获取培训师信息
      this.player = new Aliplayer(
        {
          id: "player-con",
          source: this.videoInfo.Liveurl,
          autoplay: false,
          playsinline: true,
          height: "100%",
          isLive: false,
          rePlay: true,
          x5_type: "h5",
          x5_video_position: "top",
          x5_fullscreen: false,
          x5_orientation: "portrait",
          preload: false,
          controlBarVisibility: "hover",
          useH5Prism: true,
          cover: this.videoInfo.Screenshot
        },
        function(player) {
          console.log("播放器创建了。");
        }
      );
      this.player.on("requestFullScreen", () => {
        this.player.x5_fullscreen = true;
        this.x5_orientation = "portrait";
        let video = document.getElementsByTagName("video")[0];
        video.style.objectFit = "contain";
        video.style.width = 100 + "% !important";
      });
      this.player.on("play", () => {
        this.recordStatus();
      });
      this.player.on("pause", () => {
        if (this.interval) clearInterval(this.interval);
      });
      this.getVideoInfo();
    },
    recordStatus() {
      this.interval = setInterval(() => {
        console.log(this.player.getStatus());
        if (this.player.getStatus() == "playing") {
          let data = Base64.encode(
            JSON.stringify({
              liveid: parseInt(this.liveid),
              add_play_sec: 5
            })
          );
          // console.log(Base64.decode(data));
          this.websocketsend(3, data); //订阅直播评论推送
        }
      }, 5000);
    },
    getVideoInfo() {
      //查看是否有考试
      addView({
        liveid: this.liveid
      }).then(
        res => {
          if (res.data.length !== 0) {
            let examInfo = res.data[0];
            this.internal = setInterval(() => {
              this.initLive(); //获取直播状态
              if (this.Livestate == 2) {
                this.$confirm(
                  `直播结束，是否前往完成《${
                    examInfo.Papername
                  }》的考试题？若取消，可在我的考试中查看本次考试`,
                  "答题考试",
                  {
                    type: "success",
                    confirmButtonText: "立即前往",
                    cancelButtonText: "稍后再去",
                    center: true
                  }
                )
                  .then(() => {
                    this.$router.push("/answer/" + examInfo.Examid);
                  })
                  .catch(() => {});
              } else {
                clearInterval(this.internal);
              }
            }, 15000);
          } else {
            console.log("没有考试");
          }
        },
        e => this.showMessage(e.data.message)
      );
    },
    gotoExam() {
      addView({
        liveid: this.liveid
      }).then(
        res => {
          if (res.data.length !== 0) {
            let examInfo = res.data[0];
            this.$confirm(
              `是否立即前往参与该直播相关的《${examInfo.Papername}》的考试？`,
              "答题考试",
              { lockScroll: false }
            )
              .then(() => {
                this.$router.push("/answer/" + examInfo.Examid);
              })
              .catch(() => {});
          } else {
            this.$message({
              message: "当前直播没有考试",
              type: "info",
              center: true
            });
          }
        },
        e => this.showMessage(e.data.message)
      );
    },
    getCommentList() {
      //获取评论列表
      getCommentList({
        refid: this.liveid,
        offset: 30,
        p: 1,
        order: 1
      }).then(
        res => {
          res = res.data;
          this.commentList = this.commentList.concat(res.comments);
          this.$refs.commentBox.scrollBottom();
        },
        e => this.showMessage(e.data.message)
      );
    },
    addComment(content) {
      //发送评论
      console.log(content);
      commitComment({
        refid: this.liveid,
        content: content
      }).then(
        res => {
          res = res.data;
          this.$refs.commentInput.clear();
          this.$refs.commentBox.scrollBottom();
        },
        e => this.showMessage(e.data.message)
      );
    },
    showRate() {
      this.dialogVisible = true;
    },
    gradeLive(content, rate) {
      //评分
      return gradeLive({
        liveid: this.liveid,
        contenttype: 1,
        content,
        startnum: rate
      }).then(
        res => {
          this.dialogVisible = false;
          this.$message({
            message: res.message,
            type: "success"
          });
        },
        e => this.showMessage(e.data.message)
      );
    } /************初始化weosocket**************/,
    initWebSocket() {
      //dev-live
      //console.log("wsuri=", this.wsuri);
      this.websock = new WebSocket(this.wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonmessage(e) {
      //数据接收
      let redata = JSON.parse(Base64.decode(JSON.parse(e.data).data));
      // console.log(redata);
      if (redata.username) {
        this.commentList = this.commentList.concat(redata);
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      console.log("连接到websocket服务端");
      let maxCommentId =
        this.commentList.length == 0
          ? 0
          : this.commentList[this.commentList.length - 1].id;
      let data = Base64.encode(
        JSON.stringify({
          liveid: parseInt(this.liveid),
          maxcommentid: maxCommentId
        })
      );
      // console.log(Base64.decode(data));
      this.websocketsend(1, data); //订阅直播评论推送
    },
    websocketonerror(res) {
      //连接建立失败重连
      this.errorTimes++;
      console.log("连接error,尝试重新连接" + this.errorTimes, res);
      if (this.errorTimes < 5) this.initWebSocket();
    },

    websocketclose(e) {
      //关闭
      console.log("断开连接");
    },
    websocketsend(categorytype, data) {
      //数据发送

      let sendData = {
        category: categorytype, // 消息类型：1: 订阅直播评论推送, 2: 取消订阅直播评论推送，3：发送播放时长
        data, // base64 编码的 JSON 消息内容，根据消息类型具有不同的结构，具体见下文
        request_id: 0, // 请求ID，响应消息将带上相同的 request_id
        ts: Math.floor(new Date().getTime() / 1000) // Unix 时间戳
      };
      this.websock.send(JSON.stringify(sendData));
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '//g.alicdn.com/de/prismplayer/2.7.2/skins/default/aliplayer-min.css'
@import '~@/assets/css/aliplayer_overWrite.css'

.live-container
  background-color: #F2F6FC
  padding: 20px 10px

  .player-container
    height: 640px

    .video-wrapper
      height: 100%
      width: 100%
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
</style>
