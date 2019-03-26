import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import './assets/css/reset.css'
import './assets/css/overWrite.css'
import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import moment from "moment"
import {
    Divider,
    Time
} from 'iview'
Vue.use(ElementUI);

Vue.prototype.showMessage = message => {
    if (message) {
        ElementUI.Message({
            showClose: true,
            message: message,
            type: "error",
            center: true
        });
        console.info(message);
    }
}
Vue.component('Divider', Divider);
Vue.component('Time', Time);
Vue.config.productionTip = false
//时间戳转换为特定格式
Vue.filter("dateMoment", function (value, formatString) {
    formatString = formatString || "YYYY-MM-DD";
    return moment(value).format(formatString);
});
//时间戳转换为特定格式
Vue.filter("timeMoment", function (value, formatString) {
    formatString = formatString || "YYYY-MM-DD HH:mm:ss";
    return moment(value).format(formatString);
});
Vue.directive("focus", {
    inserted: function (el, obj) {
        // console.log(el);
        el.focus();
    }
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')