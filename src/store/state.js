import getDeviceId from "../assets/js/deviceId";
let provinceId = "100",
    hasLogin = 0,
    homeViewName = "Index", //首页视图
    checkLoginTime = 0,
    timestamp = "",
    phone = "",
    token = "",
    userMsg = {},
    minClientHeight = document.documentElement.clientHeight,
    stateInfo = "",
    deviceId = "",
    systemInfo = {
        channel: "web",
        version: "1.1.0",
        usersource: "caizhanfuwu.com",
        postUrl: "dev-live.caizhanfuwu.com/v1", //dev
        // postUrl: "api.caizhanfuwu.com/v1",
        // postUrl: '192.168.12.118:8080/v1',
        // postUrl: '192.168.12.114:8080/v1', //yb
        privateKey: "ZFAhCgMXu2{249vGjO,12PBHFfEG" //dev
        // privateKey: "1GJAqrfyewrt4eiHfRyMUosmere34}HFfEG"
    };

try {
    if (localStorage.provinceId) provinceId = JSON.parse(localStorage.provinceId);
    if (localStorage.hasLogin) hasLogin = JSON.parse(localStorage.hasLogin);
    if (localStorage.checkLoginTime)
        checkLoginTime = JSON.parse(localStorage.checkLoginTime);
    if (localStorage.phone) phone = JSON.parse(localStorage.phone);
    if (localStorage.token) token = JSON.parse(localStorage.token);
    if (localStorage.userMsg) userMsg = JSON.parse(localStorage.userMsg);
    if (localStorage.stateInfo) stateInfo = JSON.parse(localStorage.stateInfo);
    if (localStorage.deviceId) {
        deviceId = JSON.parse(localStorage.deviceId);
    } else {
        deviceId = getDeviceId();
        localStorage.setItem("deviceId", JSON.stringify(deviceId));
    }
} catch (error) {
    deviceId = getDeviceId();
}

export default {
    timestamp,
    hasLogin,
    checkLoginTime,
    provinceId,
    homeViewName,
    minClientHeight,
    phone,
    token,
    userMsg,
    stateInfo,
    deviceId,
    systemInfo
};