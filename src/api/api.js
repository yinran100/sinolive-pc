import caizhanRequest from "./interceptors";
import md5 from "js-md5";
import Store from '@/store/store'
// const caizhanRequest = Axios.create({
//     baseURL: `https://${Store.state.systemInfo.postUrl}`,
//     transformRequest: [
//         //axios请求将json格式数据转换为FormData
//         function (data) {
//             let ret = "";
//             for (let it in data) {
//                 ret +=
//                     encodeURIComponent(it) +
//                     "=" +
//                     encodeURIComponent(data[it]) +
//                     "&";
//             }
//             return ret;
//         }
//     ],
//     headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
// });
function updateParams(params) {
    Store.commit("updateTimestamp");
    return Object.assign({
        userid: Store.state.userMsg.userid == undefined ? "" : Store.state.userMsg.userid,
        username: Store.state.userMsg.username == undefined ? "" : Store.state.userMsg.username,
        usertype: Store.state.userMsg.usertype == undefined ? "" : Store.state.userMsg.usertype,
        usersource: Store.state.systemInfo.usersource,
        sessionid: Store.state.token,
        deviceid: Store.state.deviceId,
        channel: Store.state.systemInfo.channel,
        version: Store.state.systemInfo.version,
        provinceid: Store.state.provinceId,
        sign: Store.getters.sign,
        timestamp: Store.state.timestamp
    }, params)
}

export function getState() { //获取state
    let timestamp = Math.floor(new Date().getTime() / 1000) + "";
    let theSign = md5(
        `${Store.state.deviceId}0${Store.state.systemInfo.channel}${
			Store.state.systemInfo.version
        }${timestamp}${Store.state.systemInfo.privateKey}`
    );
    caizhanRequest.post("/live/state", {
        provinceId: Store.state.provinceId,
        version: Store.state.systemInfo.version,
        channel: Store.state.systemInfo.channel,
        deviceid: Store.state.deviceId,
        timestamp,
        sign: theSign
    }).then(data => {
        Store.commit("saveStateInfo", data.state);

    });
}
export const modifyAvatar = formdata => Axios.create({ //修改头像
    baseURL: `https://${Store.state.systemInfo.postUrl}`,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}).post("/user/modify/avatar", formdata);

export function hasLogin(timestamp) { //登录信息校验
    return caizhanRequest.post("/user/validate", {
        channel: Store.state.systemInfo.channel,
        version: Store.state.systemInfo.version,
        usersource: Store.state.systemInfo.usersource,
        state: Store.state.stateInfo,
        sessionid: Store.state.token,
        timestamp: timestamp + "",
        sign: md5(
            Store.state.stateInfo +
            Store.state.token +
            Store.state.systemInfo.usersource +
            Store.state.systemInfo.channel +
            Store.state.systemInfo.version +
            timestamp +
            Store.state.systemInfo.privateKey
        )
    })
}

export const checkCode = params => caizhanRequest.post("/user/code", updateParams(params)); //点击获取验证码

export const checkVoiceCode = params => caizhanRequest.post("/ronglian/Phone/VoiceVerify", updateParams(params)); //获取语音验证码

export const login = params => caizhanRequest.post("/user/login", updateParams(params)); //登录

export const getIndexInfo = params => caizhanRequest.post("/live/index", updateParams(params)); //首页信息

export const getLiveVoteInfo = params => caizhanRequest.post("/live/voteinfo", updateParams(params)); //获取直播点赞信息

export const voteLive = params => caizhanRequest.post("/live/vote", updateParams(params)); //直播点赞或取消

export const getLiveDetail = params => caizhanRequest.post("/live/getone", updateParams(params)); //根据直播id获取直播详情

export const addView = params => caizhanRequest.post("/live/addview", updateParams(params)); //查询是否有考试

export const getView = params => caizhanRequest.post("/live/getview", updateParams(params)); //我的学习

export const getTaskTitle = params => caizhanRequest.post("/learnTask/getTaskTitle", updateParams(params)); //任务标题信息

export const getStudyTask = params => caizhanRequest.post("/learnTask/getAll", updateParams(params)); //任务列表

export const getTaskDetail = params => caizhanRequest.post("/learnTask/getTaskDetail", updateParams(params)); //任务详情

export const getTaskRanks = params => caizhanRequest.post("/learnTask/getRanks", updateParams(params)); //任务排行榜

export const getLiveList = params => caizhanRequest.post("/live/getall", updateParams(params)); //获取直播中心列表

export const getHotList = params => caizhanRequest.post("/live/gethot", updateParams(params)); //根据热门列表

export const getNoticeSort = params => caizhanRequest.post("/notice/sort/getnoticesort", updateParams(params)); //获取新闻种类

export const getNewsList = params => caizhanRequest.post("/notice/getlistbysortid", updateParams(params)); //获取新闻列表

export const getNewsContent = params => caizhanRequest.post("/notice/getbyid", updateParams(params)); //获取新闻详情

export const voteNews = params => caizhanRequest.post("/notice/voteorcancel", updateParams(params)); //新闻点赞

export const getCommentList = params => caizhanRequest.post("/comment/list", updateParams(params)); //获取新闻或者直播的评论列表

export const commitComment = params => caizhanRequest.post("/comment/commit", updateParams(params)); //提交新闻评论

export const voteComment = params => caizhanRequest.post("/comment/vote", updateParams(params)); //新闻的评论点赞

export const getTrainerList = params => caizhanRequest.post("/trainer/getall", updateParams(params)); //获取培训师列表

export const getTrainerDetail = params => caizhanRequest.post("/trainer/getone", updateParams(params)); //根据培训师id获取培训师详情

export const getTrainerDetailbyUserid = params => caizhanRequest.post("/trainer/user_trainer", updateParams(params)); //根据培训师id获取培训师详情

export const getCourseList = params => caizhanRequest.post("/course/getall", updateParams(params)); //获取课程列表

export const getCourseDetail = params => caizhanRequest.post("/course/getone", updateParams(params)); //根据课程id获取课程详情

export const getCoursewareList = (params, courseId) =>
    caizhanRequest.post(
        courseId == "" ?
        "/courseware/getwithtrainer" :
        "/courseware/getwithcourse",
        updateParams(params)
    ); //根据培训师id或课程id获取课件列表

export const getMyExam = params => caizhanRequest.post("/exam/getmy", updateParams(params)); //获取我的考试

export const joinExam = params => caizhanRequest.post("/exam/join", updateParams(params)); //立即参与考试

export const repareExam = params => caizhanRequest.post("/live/repareexam", updateParams(params)); //重新考试前清空数据

export const viewExam = params => caizhanRequest.post("/live/viewpaper", updateParams(params)); //查看考试详情

export const gradeLive = params => caizhanRequest.post("/evaluation/add", updateParams(params)); //点评直播

export const getAmount = params => caizhanRequest.post("/all/amount", updateParams(params)); //获取目标内容的总条数

export const getUserMsgbyToken = params => caizhanRequest.post("/notice/token", params); //根据url里的token获取账户信息

export const getCourseType = params => caizhanRequest.post("/course/coursetype", updateParams(params)); //获取课程分类

export const getSationInfo = params => caizhanRequest.post("/stationinfo/getone", updateParams(params)); //获取用户站点信息

export const modifyNickname = params => caizhanRequest.post("/user/modify/nickname", updateParams(params)); //修改昵称

export const modifyPwd = params => caizhanRequest.post("/stationinfo/changepwd", updateParams(params)); //验证码修改密码

export const modifyPwdWithOld = params => caizhanRequest.post("/stationinfo/changepwdwith_old", updateParams(params)); //旧密码修改密码

export const loginByPwd = params => caizhanRequest.post("/user/login/pwd", updateParams(params)); //密码登录

export const getLottChartData = params => caizhanRequest.post("/hnxyc/total", params); //幸运彩的数据

export const getKnowledgeData = params => caizhanRequest.post("/knowledgeLibrary", updateParams(params)); //知识库