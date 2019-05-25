<template>
  <div id="installation">
    <div class="wrapper">
      <div class="form-installation">
        <b-container fluid class>
          <b-form id="installationForm" @submit="initial()" novalidate>
            <div>
              <h3>DriveNode Installation</h3>
            </div>
            <Alert :color="alertColor" :msg="alertMsg" :show="alertMsg.length>0"/>
            <label for="username">Username</label>
            <b-input id="username" v-model="form.username" disabled/>
            <b-form-group id="pwd" label="Password" label-for="password">
              <b-form-input
                class="md-col"
                type="password"
                v-model="form.pwd"
                :state="!$v.form.pwd.$invalid"
                id="password"
                placeholder="Password"
              ></b-form-input>
              <b-form-invalid-feedback
                id="passwordInvalidFeedback"
              >Password length must larger than 8</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="conpassword" label="Confirm Password" label-for="conpassword">
              <b-form-input
                class="md-col"
                type="password"
                v-model="form.conpwd"
                :state="conpwdValidation"
                id="conpassword"
                placeholder="Confirm Password"
              ></b-form-input>
              <b-form-invalid-feedback
                v-show="!conpwdEmpty"
                id="conpasswordInvalidFeedback"
              >Confirm Password must input</b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-show="!pwdNotMatch"
                id="passwordNotMatchInvalidFeedback"
              >Password not match</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="emaillabel" label="Email" label-for="email">
              <b-form-input
                class="md-col"
                type="email"
                v-model="form.email"
                :state="emailValidation"
                id="email"
                placeholder="Email"
              ></b-form-input>
              <b-form-invalid-feedback v-show="!emailEmpty" id="emailEmptyFeedback">Email must enter</b-form-invalid-feedback>
              <b-form-invalid-feedback
                v-show="!emailInvalid"
                id="emailInvalidFeedback"
              >Email must contain @</b-form-invalid-feedback>
            </b-form-group>
            <b-button variant="primary" class="btn-block" type="submit">Save</b-button>
          </b-form>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "installation",
  data() {
    return {
      isInitial: false,
      alertColor: "",
      alertMsg: "",
      form: {
        username: "admin",
        pwd: "",
        conpwd: "",
        email: ""
      },
      conpwdEmpty: false,
      pwdNotMatch: false,
      emailEmpty: false,
      emailInvalid: false
    };
  },
  mounted() {
    this.check();
    this.$root.$on("onCheckingInitial", (init, cb) => {
      
      this.check()
    });
  },
  validations: {
    form: {
      pwd: {
        required,
        minLength: minLength(8)
      },
      conpwd: {
        required,
        minLength: minLength(8)
      },
      email: {
        required
      }
    }
  },
  computed: {
    conpwdValidation() {
      if (this.form.pwd == this.form.conpwd) {
        this.pwdNotMatch = true;
      } else {
        this.pwdNotMatch = false;
      }
      if (this.form.conpwd.length >= 8) {
        this.conpwdEmpty = true;
      } else {
        this.conpwdEmpty = false;
      }
      if (this.pwdNotMatch && this.conpwdEmpty) {
        return true;
      } else {
        return false;
      }
    },
    emailValidation() {
      if (this.form.email.length > 0) {
        this.emailEmpty = true;
      } else {
        this.emailEmpty = false;
      }
      let emailArr = this.form.email.split("@");

      if (emailArr.length > 1) {
        this.emailInvalid = true;
      } else {
        this.emailInvalid = false;
      }
      if (this.emailInvalid && this.emailEmpty) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    initial() {
      if (this.pwdNotMatch&& this.conpwdEmpty && this.emailInvalid && this.emailEmpty){
        let json = {};
        let form = this.form;
        json.password = this.$base64.Base64.encode(form.pwd);
        json.confirmPassword = this.$base64.Base64.encode(form.conpwd);
        json.email = form.email;
        this.$http.postMethod("/install", json).then(response => {
            this.alertMsg = response.msg.data.msg
            this.alertColor = "success";
          })
          .catch((error)=>{
            this.alertMsg = error.response.data.msg.msg;
            this.alertColor = "danger";
          });
      } else {
        this.alertMsg = "Invalid input";
        this.alertColor = "danger";
      }
    },
    check(){
      this.$http.getMethod('/install/check',{}).then(res=>{
        console.log(res.data)
        if(res&&!res.data){
          this.isInitial = false;
          window.location.href="/"
        }else{
          this.isInitial = true;
        }
      }).catch(err=>{
        this.isInitial = false;
          window.location.href="/"
      })
    }
  }
};
</script>

<style scoped>
.wrapper {
  margin-top: 80px;
  margin-bottom: 80px;
}

.form-installation {
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
    margin-bottom: 2px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  input[type="password"] {
    margin-bottom: 20px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>