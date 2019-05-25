// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import axios from "axios";
import Toasted from "vue-toasted";
import Vuelidate from "vuelidate";
import VueVideoPlayer from 'vue-video-player'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faSpinner,
  faAlignLeft,
  faFile,
  faFolder,
  faFileUpload,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import ErrorHandler from "./components/controls/errorHandler/errorHandler"
import Nav from "./components/Nav";
import Login from "./components/Login";
import LoginTFA from "./components/LoginTFA";
import Alert from "./components/controls/alert/AlertComponent";
import Control from "./components/dashboard/Control";
import FileList from "./components/dashboard/file/File";
import FileProperty from "./components/dashboard/file/FileProperty";
import DirectoryList from "./components/dashboard/directory/Directory";
import DirectoryAdd from "./components/dashboard/directory/DirectoryAdd";
import Upload from "./components/controls/Upload/Upload";
import Profile from "./components/dashboard/profile/Profile";
import ChangePwd from "./components/dashboard/profile/ChangePwd";
import Compress from "./components/controls/compress/compress";
import Preview from "./components/controls/preview/preview";
import ResetPwd from "./components/controls/resetPwd/resetPwd";
import TwoFA from "./components/dashboard/profile/TwoFA";

import AdminDashboard from "./components/admin/Dashboard";
import AdminCounter from "./components/admin/counter/Counter";
import AdminUserCreate from "./components/admin/user/CreateUser";
import AdminUserList from "./components/admin/user/ListUser";
import AdminUserEdit from "./components/admin/user/EditUser";
import AdminGroupCreate from "./components/admin/group/CreateGroup";
import AdminGroupList from "./components/admin/group/ListGroup";
import AdminConfig from "./components/admin/config/config";

import router from "./router";
import BootstrapVue from "bootstrap-vue";
import AuthService from "./service/AuthService.js";
import ServiceHelper from "./service/ServiceHelper.js";
import Base64 from "./service/Base64.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'video.js/dist/video-js.css';

Vue.use(BootstrapVue);
Vue.use(ServiceHelper);
Vue.use(axios);
Vue.use(Toasted);
Vue.use(Vuelidate);
Vue.use(require("vue-moment"));
Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)

axios.defaults.baseURL = localStorage.getItem("endpoint") + "/api";

axios.interceptors.response.use((response) => { // intercept the global error
  console.log(response)
  return response
}, function (error) {
  let originalRequest = error.config

  if (error.response.status === 401 && !originalRequest._retry) { // if the error is 401 and hasent already been retried
    originalRequest._retry = true
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('dirPath')
    localStorage.removeItem('currentDir')
    localStorage.removeItem('currentDirName')
    //console.log(window.location.href);
    let hrefArr = window.location.href.split('#')
    //console.log(hrefArr[1])
    if (hrefArr[1] == "/Login" || hrefArr[1] == "/login") {

    } else {
      window.location.href = '/'
    }

    return Promise.reject(error)
  }

  // Do something with response error
  return Promise.reject(error)
})

library.add(
  faCoffee,
  faSpinner,
  faAlignLeft,
  faFile,
  faFolder,
  faFileUpload,
  faPlus
);
Vue.prototype.$http = ServiceHelper;
Vue.prototype.$auth = AuthService;
Vue.prototype.$base64 = Base64;
ServiceHelper.getMethod("/auth/checkAuthMethod", {}).then((res) => {
  if ((res.data.data == "local")) {
    //return false; //local login
    console.log("$checkIsLocalLoginMethod:" + res.data.data);
    Vue.prototype.$checkIsLocalLoginMethod = true;
  } else {
    //return true; //other method
    Vue.prototype.$checkIsLocalLoginMethod = false;
  }
  console.log(Vue.prototype.$checkIsLocalLoginMethod);
})


Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("ErrorHandler", ErrorHandler);

//Normal Dahboard
Vue.component("Navbar", Nav);
Vue.component("Alert", Alert);
Vue.component("FileList", FileList);
Vue.component("FileProperty", FileProperty);
Vue.component("DirectoryList", DirectoryList);
Vue.component("DirectoryAdd", DirectoryAdd);
Vue.component("Control", Control);
Vue.component("Upload", Upload);
Vue.component("Profile", Profile);
Vue.component("ChangePwd", ChangePwd);
Vue.component("Compress", Compress);
Vue.component("Preview", Preview);
Vue.component("ResetPwd", ResetPwd);
Vue.component("TwoFactorAuthTOTP", TwoFA);
Vue.component("LoginTFA", LoginTFA);


//Admin Dashboard
Vue.component("AdminDashboard", AdminDashboard);
Vue.component("Admin-Counter", AdminCounter);
Vue.component("Admin-User-Create", AdminUserCreate);
Vue.component("Admin-User-List", AdminUserList);
Vue.component("Admin-User-Edit", AdminUserEdit);
Vue.component("Admin-Group-Create", AdminGroupCreate);
Vue.component("Admin-Group-List", AdminGroupList);
Vue.component("Admin-config", AdminConfig);

Vue.config.productionTip = false;

Vue.toasted.register("AuthErrorToast", "Oops.. Something Went Wrong..", {
  type: "error",
  icon: "error_outline"
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App, ServiceHelper },
  template: "<App/>"
});

new Vue({
  router,
  components: { Nav },
  template: "<Navbar/>"
});

new Vue({
  router,
  components: { Login, ServiceHelper },
  template: "<Login/>"
});

new Vue({
  router,
  components: { LoginTFA, ServiceHelper },
  template: "<LoginTFA/>"
});

new Vue({
  components: { Alert },
  template: "<Alert/>"
});

new Vue({
  components: { DirectoryList },
  template: "<DirectoryList/>"
});

new Vue({
  components: { FileList },
  template: "<FileList/>"
});

new Vue({
  components: { DirectoryAdd },
  template: "<DirectoryAdd/>"
});

new Vue({
  components: { Profile },
  template: "<Profile/>"
});

new Vue({
  components: { ChangePwd },
  template: "<ChangePwd/>"
});

new Vue({
  components: { AdminGroupCreate },
  template: "<Admin-Group-Create/>"
});

new Vue({
  components: { AdminCounter },
  template: "<Admin-Counter/>"
});

new Vue({
  components: { AdminUserCreate },
  template: "<Admin-User-Create/>"
});
new Vue({
  components: { AdminUserList },
  template: "<Admin-User-List/>"
});

new Vue({
  components: { AdminUserEdit },
  template: "<Admin-User-Edit/>"
});

new Vue({
  components: { AdminGroupList },
  template: "<Admin-Group-List/>"
});

new Vue({
  components: { Compress },
  template: "<Compress/>"
});

new Vue({
  components: { Preview },
  template: "<Preview/>"
});

new Vue({
  components: { ResetPwd },
  template: "<ResetPwd/>"
});

new Vue({
  components: { AdminConfig },
  template: "<Admin-Config/>"
});

new Vue({
  components: { TwoFA },
  template: "<TwoFactorAuthTOTP/>"
});