import Vue from "vue";
import Router from "vue-router";
import adminRouter from "@/components/admin/router";
import Home from "@/components/Home";
import Profile from "@/components/dashboard/profile/Profile";
import ChangePwd from "@/components/dashboard/profile/ChangePwd";
import Login from "@/components/Login";
import Installation from "@/components/installation/Installation";
import AuthService from "@/service/AuthService.js";
import TwoFA from "@/components/dashboard/profile/TwoFA";
import LoginTFA from "@/components/LoginTFA";


Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: "/loginTFA",
      name: "loginTFA",
      component: LoginTFA,
      meta: { requiresAuth: false }
    },
    {
      path: "/installation",
      name: "installation",
      component: Installation
      //meta: { requiresAuth: false }
    },
    {
      path: "/profile",
      component: Profile,
      name: "profile",
      meta: { requiresAuth: true },
      children: []
    },
    {
      path: "/profile/changepwd",
      name: "changepwd",
      component: ChangePwd,
      meta: { requiresAuth: true }
    },
    {
      path: "/profile/tfa",
      name: "tfa",
      component: TwoFA,
      meta: { requiresAuth: true }
    }
  ].concat(adminRouter)
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    var isLogin = AuthService.isAuth();
    if (!AuthService.isAuthBool) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresAdmin)) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.isAdmin) {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
