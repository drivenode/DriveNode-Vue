export default {
  name: "AuthService",
  data() {
    return {
      isAuthBool: false,
      isAdmin: false
    };
  },
  mounted() {
    this.$root.$on("checkAuth", () => {
      this.checkLogin();
    });
  },
  isAuth() {
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("token").length > 0) {
        this.isAuthBool = true;
        return true;
      } else {
        this.isAuthBool = false;
        return false;
      }
    } else {
      this.isAuthBool = false;
      return false;
    }
  },
  totpSuccess(token) {
    if (token.length > 0) {
      localStorage.setItem("totptoken", token);
      //this.isAuth();
    }
  },
  loginSuccess(token, userInfo) {
    if (token.length > 0) {
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      this.isAuth();
    }
  },
  logout() {
    localStorage.setItem("token", "");
    localStorage.setItem("userInfo", "");
    localStorage.clear();
  },
  checkLogin() {
    this.$http
      .getMethod("token/token", {})
      .then()
      .catch(error => {
        this.isAuthBool = false;
        this.logout();
      });
  },
  getToken() {
    return localStorage.getItem("token");
  },
  getUserInfo() {
    let userInfo = localStorage.getItem("userInfo");
    return JSON.parse(userInfo);
  },
  checkAdmin() {
    let userInfo = this.getUserInfo();
    if (userInfo.isAdmin) {
    }
  },
  checkAdminPermission(permission) {
    if (this.isAuthBool) {
      let userInfo = this.getUserInfo();
      if (userInfo.isAdmin) {
        var data = userInfo.group;
        var valid = false;
        for (var attributename in data) {
          for (var permissionData in permission) {
            if (!valid) {
              if (permissionData == "files" || permissionData == "dir") {
                for (var a in permission[permissionData]) {
                  for (var b in data[attributename]) {
                    if (
                      a == b &&
                      permission[permissionData][a] == data[attributename][b]
                    ) {
                      valid = true;
                    }
                  }
                }
              }
              if (
                permissionData == attributename &&
                data[attributename] == permission[permissionData]
              ) {
                valid = true;
              }
            }
          }
        }
        return valid;
      } else {
        return false;
      }
    }
  }
};
