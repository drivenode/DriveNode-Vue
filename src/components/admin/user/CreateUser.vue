<template>
  <div>
    <b-form @submit="submitUser()" novalidate v-on:submit.prevent>
      <Alert :msg="msg" :color="alertColour" :show="msg.length>0"></Alert>
      <b-form-group
        id="username"
        label="Username"
        label-for="usernameInput"
        :invalid-feedback="usernameInvalidFeedback"
        :valid-feedback="usernameValidFeedback"
        :state="usernameState"
      >
        <b-form-input
          v-if="$checkIsLocalLoginMethod"
          id="usernameInput"
          :state="usernameState"
          v-model.trim="username"
        ></b-form-input>
        <b-form-select
          v-if="!$checkIsLocalLoginMethod"
          v-model="username"
          :options="adUserAvailable"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="password"
        label="Password"
        label-for="passwordInput"
        :invalid-feedback="passwordInvalidFeedback"
        :valid-feedback="passwordValidFeedback"
        :state="passwordState"
      >
        <b-form-input
          id="passwordInput"
          type="password"
          :state="passwordState"
          v-model.trim="password"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="conpassword"
        label="Confirm Password"
        label-for="conPwdInput"
        :invalid-feedback="conpasswordInvalidFeedback"
        :valid-feedback="conpasswordValidFeedback"
        :state="conpasswordState"
      >
        <b-form-input
          id="conPwdInput"
          type="password"
          :state="conpasswordState"
          v-model.trim="conPwd"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="name"
        label="Name"
        label-for="nameInput"
        :invalid-feedback="nameInvalidFeedback"
        :valid-feedback="nameValidFeedback"
        :state="nameState"
      >
        <b-form-input
          id="nameInput"
          placeholder="Enter Name"
          type="text"
          :state="nameState"
          v-model.trim="name"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="email"
        label="Email"
        label-for="emailInput"
        :invalid-feedback="emailInvalidFeedback"
        :valid-feedback="emailValidFeedback"
        :state="state"
      >
        <b-form-input
          id="emailInput"
          placeholder="Enter Email"
          type="email"
          :state="emailState"
          v-model.trim="email"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="group"
        label="Group"
        label-for="groupInput"
        :invalid-feedback="groupInvalidFeedback"
        :valid-feedback="groupValidFeedback"
        :state="groupState"
      >
        <b-form-select v-model="group" :state="groupState">
          <option value>Please select an option</option>
          <option :value="item._id" v-for="item in groups">{{item.groupName}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="Activate">
        <b-form-radio-group v-model="activate" :options="activateOptions" name="radioInline"></b-form-radio-group>
      </b-form-group>
      <b-btn
        variant="info"
        class="btn btn-block"
        :disabled="!(usernameStatus&&pwdStatus&&conPwdState&&emailStatus&&groupStatus&&nameStatus)||isSuccess"
        type="submit"
      >Submit</b-btn>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "createUser",
  data() {
    return {
      groups: [],
      username: "",
      password: "",
      conPwd: "",
      email: "",
      group: "",
      name: "",
      activate: true,
      activateOptions: [
        { text: "Activate", value: true },
        { text: "Deactivate", value: false }
      ],
      state: false,
      usernameStatus: false,
      pwdStatus: false,
      conPwdState: false,
      emailStatus: false,
      groupStatus: false,
      nameStatus: false,
      msg: "",
      alertColour: "",
      isSubmit: false,
      isSuccess: false,
      adUserAvailable: []
    };
  },
  mounted() {
    this.getGroup();
    this.getAdAvailableUsers();
  },
  methods: {
    getGroup() {
      this.$http.getMethod("admin/group", {}).then(res => {
        this.groups = res.data.data;
      });
    },
    submitUser() {
      let json = {};
      json.username = this.username;
      json.password = this.$base64.Base64.encode(this.password);
      json.confirmPwd = this.$base64.Base64.encode(this.conPwd);
      json.email = this.email;
      json.group = this.group;
      json.name = this.name;
      json.space = 0; //MB
      json.activate = this.activate;
      this.$http
        .postMethod("admin/user", json)
        .then(res => {
          this.msg = "User Created";
          this.alertColour = "success";
        })
        .catch(err => {
          this.msg = err.response.data.msg;
          this.alertColour = "danger";
        });
    },
    getAdAvailableUsers() {
      let me = this;
      if (!this.$checkIsLocalLoginMethod) {
        this.$http.getMethod("/admin/ad/user", {}).then(res => {
          let users = res.data.data.available;
          me.adUserAvailable = [];
          for (let i = 0; i < users.length; i++) {
            me.adUserAvailable.push({ value: users[i], text: users[i] });
          }
          //=res.data.data;
          console.log(res.data);
        });
      }
    }
  },
  computed: {
    usernameState() {
      return this.username.length > 0 ? true : false;
    },
    usernameInvalidFeedback() {
      if (this.username.length > 0) {
        this.usernameStatus = true;
        return "";
      } else {
        return "Please enter something";
      }
    },
    usernameValidFeedback() {
      return this.state === true ? "Valid" : "";
    },
    passwordState() {
      return this.password.length >= 8 ? true : false;
    },
    passwordInvalidFeedback() {
      if (this.password.length >= 8) {
        this.pwdStatus = true;
        return "";
      } else if (this.password.length < 8) {
        this.pwdStatus = false;
        return "Length must large than 8";
      } else {
        this.pwdStatus = false;
        return "Please enter something";
      }
    },
    passwordValidFeedback() {
      return this.state === true ? "Valid" : "";
    },

    conpasswordState() {
      return this.conPwd.length >= 8
        ? this.password == this.conPwd
          ? true
          : false
        : false;
    },
    conpasswordInvalidFeedback() {
      if (this.password != this.conPwd) {
        this.conPwdState = false;
        return "Password does not match";
      }
      if (this.conPwd.length >= 8) {
        this.conPwdState = true;
        return "";
      } else if (this.conPwd.length < 8) {
        return "Length must large than 8";
      } else {
        return "Please enter something";
      }
    },
    conpasswordValidFeedback() {
      return this.state === true ? "Valid" : "";
    },
    emailState() {
      return this.emailStatus;
    },
    emailInvalidFeedback() {
      if (this.email.length > 0) {
        let emailArr = this.email.split("@");
        if (emailArr.length <= 1) {
          this.emailStatus = false;
          return "Must include @";
        } else {
          this.emailStatus = true;
          return "";
        }
      } else {
        this.emailStatus = false;
        return "Please enter your email";
      }
    },
    emailValidFeedback() {
      return this.state === true ? "Valid" : "";
    },

    groupState() {
      return this.groupStatus;
    },
    groupInvalidFeedback() {
      if (this.group.length > 0) {
        this.groupStatus = true;
        return "";
      } else {
        this.groupStatus = false;
        return "Please choose a group";
      }
    },
    groupValidFeedback() {
      return this.state === true ? "Valid" : "";
    },
    nameState() {
      return this.nameStatus;
    },
    nameInvalidFeedback() {
      if (this.name.length > 0) {
        this.nameStatus = true;
        return "";
      } else {
        this.nameStatus = false;
        return "Please enter your name";
      }
    },
    nameValidFeedback() {
      return this.state === true ? "Valid" : "";
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>