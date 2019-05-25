<template>
  <div>
    <div v-if="!$checkIsLocalLoginMethod">
      <b-form-input v-model="username" placeholder="Enter your username"></b-form-input>
      <b-form-input v-model="email" type="email" placeholder="Enter your email"></b-form-input>
      <b-button type="button" class="btn btn-lg btn-block" @click="resetPwd">Reset</b-button>
      <Alert :msg="msg" :color="alertColour" :show="msg.length>0"></Alert>
    </div>
    <div
      v-if="$checkIsLocalLoginMethod"
    >Please contact your administrator, since driveNode enabled {{authMethed}}.</div>
  </div>
</template>

<script>
export default {
  name: "resetPassword",
  data() {
    return {
      username: "",
      email: "",
      result: "",
      success: false,
      msg: "",
      alertColour: "",
      notLogin: false,
      authMethed: ""
    };
  },
  mounted() {
    this.resetAlert();
  },
  methods: {
    resetPwd() {
      let username = this.username;
      let email = this.email;
      if (username != "" && email != "") {
        let json = {};
        json.username = username;
        json.email = email;
        this.$http
          .putMethod("/users/resetPassword", json)
          .then(res => {
            this.msg = res.data.msg;
            this.alertColour = "success";
            this.isSuccess = false;
          })
          .catch(err => {
            this.msg = err.response.data.msg;
            this.alertColour = "danger";
            this.isSuccess = false;
          });
      } else {
        this.msg = "Please enter both username and password";
        this.alertColour = "danger";
      }
    },
    resetAlert() {
      this.msg = "";
      this.alertColour = "";
      this.success = false;
    }
  }
};
</script>

<style scoped>
</style>