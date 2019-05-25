<template>
  <div>
    <div class="wrapper">
      <b-form class="form-signin" @submit="Auth" v-on:submit.prevent>
        <h2 class="form-signin-heading loginItem">Two Factor Authentication</h2>
        <b-form-input
          type="text"
          v-model="token"
          class="form-control loginItem"
          placeholder="Token"
          autofocus
        />
        <b-button class="btn btn-lg btn-info btn-block loginItem" type="submit">Login</b-button>
        <Alert :msg="msg" :color="alertColour" :show="msg.length>0"></Alert>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginTFA",
  data() {
    return {
      token: "",
      isEnabled: false,
      result: "",
      success: false,
      msg: "",
      alertColour: "",
      uid: this.$route.query.uid
    };
  },
  mounted() {
    this.uid = this.$route.query.uid;
  },
  methods: {
    Auth() {
      let me = this;
      this.$http
        .totpAuth("/auth/tfa", { token: me.token, uid: me.uid })
        .then(data => {
          if (data && data.data && data.data.success) {
            this.$auth.loginSuccess(
              data.data.userInfo.token,
              data.data.userInfo
            );
            this.$auth.isAuth();
            setTimeout(() => {
              this.$router.push("/");
            }, 500);
          } else {
            this.msg = "Invalid Token";
            this.result = false;
            this.alertColour = "danger";
          }
        })
        .catch(err => {
          this.msg = err.response.data.msg;
          this.result = err.response.data;
          this.alertColour = "danger";
        });
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