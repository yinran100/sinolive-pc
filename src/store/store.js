/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import md5 from "js-md5";
import state from "./state";
Vue.use(Vuex);
//本地存储
let saveToLocalSrorage = (key, item) => {
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {}
};
const mutations = {
    updateTimestamp(state) {
        state.timestamp = Math.floor(new Date().getTime() / 1000) + "";
    },
    saveSortId(state, item) {
        state.sortId = item;
    },
    saveMinClientHeight(state, item) {
        state.minClientHeight = item;
    },
    savePhone(state, item) {
        state.phone = item;
        saveToLocalSrorage("phone", item);
    },
    saveViewName(state, item) {
        state.homeViewName = item;;
    },
    saveLogin(state, item) {
        state.hasLogin = item;
        saveToLocalSrorage("hasLogin", item);
    },
    saveSortId(state, item) {
        state.sortId = item;
        saveToLocalSrorage("sortId", item);
    },
    saveToken(state, item) {
        state.token = item;
        saveToLocalSrorage("token", item);
    },
    saveStateInfo(state, item) {
        state.stateInfo = item;
        saveToLocalSrorage("stateInfo", item);
    },
    // 用户信息
    saveUserMsg(state, item, proto) {
        state.userMsg = Object.assign(state.userMsg, item);
        saveToLocalSrorage("userMsg", state.userMsg);
    },
    setProvinceId(state, item) {
        state.provinceId = item;
    },
    saveLoginTime(state, item) {
        state.checkLoginTime = item;
        saveToLocalSrorage("checkLoginTime", item);
    }
};

const getters = {
    sign(state) {
        return md5(
            state.token +
            state.userMsg.userid +
            state.systemInfo.channel +
            state.systemInfo.version +
            state.timestamp +
            state.systemInfo.privateKey
        );
    },
    hidePhone(state) {
        //隐藏的电话
        if (state.phone != "")
            return state.phone.substr(0, 3) + "*****" + state.phone.substr(8);
        else return "";
    },
    wsuri(state) {
        return `wss://${state.systemInfo.postUrl}/ws?&userid=${
			state.userMsg.userid
		  }&username=${encodeURIComponent(state.userMsg.username)}&usertype=${
			state.userMsg.usertype
		  }&usersource=${encodeURIComponent(
			state.systemInfo.usersource
		  )}&sessionid=${encodeURIComponent(
			state.token
		  )}&deviceid=${encodeURIComponent(state.deviceId)}&channel=${
			state.systemInfo.channel
		  }&version=${state.systemInfo.version}&timestamp=${
			state.timestamp
		  }&sign=${encodeURIComponent(md5(
			state.token +
			state.userMsg.userid +
			state.systemInfo.channel +
			state.systemInfo.version +
			state.timestamp +
			state.systemInfo.privateKey
		))}`;
    }
};

export default new Vuex.Store({
    getters,
    state,
    mutations
});