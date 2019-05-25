<template>
  <div class="loginPage">
    <b-modal
      size="lg"
      class="float-left modal-resetPwd"
      ref="resetModalRef"
      hide-footer
      title="Forgot Password"
    >
      <ResetPwd/>
    </b-modal>
    <div class="wrapper">
      <b-form class="form-signin" @submit="Login" v-on:submit.prevent>
        <h2 class="form-signin-heading loginItem">Login</h2>
        <b-form-input
          type="text"
          v-model="username"
          class="form-control loginItem"
          placeholder="Username"
          autofocus
        />
        <b-form-input
          type="password"
          v-model="password"
          class="form-control loginItem"
          placeholder="Password"
        />
        <b-button class="btn btn-lg btn-primary btn-block loginItem" type="submit">Login</b-button>
        <b-button
          v-if="$checkIsLocalLoginMethod"
          class="btn btn-lg btn-warning btn-block loginItem"
          type="button"
          @click="resetPasswordModal"
        >Forgot Password</b-button>
        <Alert :msg="msg" :color="alertColour" :show="msg.length>0"></Alert>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      result: "",
      success: false,
      msg: "",
      alertColour: "",
      twoFa: false
    };
  },
  mounted() {
    this.$auth.logout();
  },
  methods: {
    Login() {
      var res = "";
      this.$http
        .postMethod("auth/login", {
          username: this.username,
          password: this.$base64.Base64.encode(this.password)
        })
        .then(response => {
          if (response && response.data) {
            this.msg = response.data.msg;
            this.result = response.data;
            this.alertColour = "success";
            if (response.data.userInfo.TwoFA) {
              console.log("TWOFA:" + response.data.userInfo.TwoFA);
              this.$auth.totpSuccess(response.data.userInfo.token);
              this.$router.push(
                "/LoginTFA?uid=" + response.data.userInfo.userId
              );
            } else {
              console.log("TWOFA:" + response.data.userInfo.TwoFA);
              this.$auth.loginSuccess(
                response.data.userInfo.token,
                response.data.userInfo
              );
              this.$auth.isAuth();
              this.$root.$emit("setNav");
              //this.$router.go({ name: "home" });
              this.$router.push({ path: "/" });
            }
          } else {
            this.msg = "Error!";
            this.alertColour = "danger";
          }
        })
        .catch(error => {
          if (error && error.response) {
            this.msg = error.response.data.msg;
            this.result = error.response.data;
            this.alertColour = "danger";
          } else {
            this.msg = "Error";
            this.result = "error";
            this.alertColour = "danger";
          }
        });
    },
    checkInit() {
      this.$http.getMethod("/install/check", {}).then(response => {
        if (response && response.data) {
          this.$route.push({ path: "/installation" });
        }
      });
    },
    resetPasswordModal() {
      this.$refs.resetModalRef.show();
    }
  }
};
</script>
<style scope>
body {
  background: #eee !important;
}

.wrapper {
  margin-top: 80px;
  margin-bottom: 80px;
}

.form-signin {
  max-width: 380px;
  padding: 15px 35px 45px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);

  .form-signin-heading,
  .checkbox {
    margin-bottom: 30px;
  }

  .checkbox {
    font-weight: normal;
  }

  .form-control {
    position: relative;
    font-size: 16px;
    height: auto;
    padding: 10px;
    @include box-sizing(border-box);

    &:focus {
      z-index: 2;
    }
  }

  input[type="text"] {
    margin-bottom: -1px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  input[type="password"] {
    margin-bottom: 20px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
.loginItem {
  margin-bottom: 2%;
}
</style>