<template>
  <div id="changePwd">
    <b-card
      title="Change Password"
      img-src="static/images/chPwd.jpeg"
      img-alt
      img-top
      tag="a"
      style="max-width: 30rem;"
      class="mb-2 text-center"
    >
      <b-form @submit="savePwd()" v-on:submit.prevent>
        <div role="group">
          <b-form-group id="oldPwdInputGroup" label="Old Password" label-for="oldPwd">
            <b-form-input
              type="password"
              class="md-col"
              v-model="form.oldPassword"
              id="oldPwd"
              :state="!$v.form.oldPassword.$invalid"
              placeholder="Enter your old password"
            ></b-form-input>
            <b-form-invalid-feedback
              v-if="!form.oldPassword.required"
              id="oldPwdLiveFeedback"
            >This is a required field</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group id="newPwdInputGroup" label="New Password" label-for="newPwd">
            <b-form-input
              type="password"
              class="md-col"
              v-model="form.newPassword"
              :state="!$v.form.newPassword.$invalid&&$v.form.newPassword.$minLength"
              id="newPwd"
              placeholder="Enter your new password"
            ></b-form-input>
            <b-form-invalid-feedback
              v-if="!$v.form.newPassword.required"
              id="newPwdLiveFeedback"
            >This is a required field</b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-if="!$v.form.newPassword.minLength"
              id="newPwdLiveLengthFeedback"
            >Length must be larger than 8</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group id="conNewPwdInputGroup1" label="Confirm Password" label-for="conNewPwd">
            <b-form-input
              type="password"
              class="md-col"
              v-model="form.confirmPassword"
              :state="!$v.form.confirmPassword.$invalid&&$v.form.confirmPassword.$minLength"
              id="conNewPwd"
              placeholder="Enter your old password"
            ></b-form-input>
            <b-form-invalid-feedback
              v-if="!$v.form.confirmPassword.required"
              id="conNewPwdLiveFeedback"
            >This is a required field</b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-if="!$v.form.confirmPassword.minLength"
              id="conNewPwdLiveLengthFeedback"
            >Length must be larger than 8</b-form-invalid-feedback>
          </b-form-group>
          <b-btn type="submit" variant="success" v-if="!isSuccess">Save</b-btn>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  name: "changePwd",
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      isModal: false,
      name: "",
      submitStatus: "",
      isSuccess: false
    };
  },
  mounted() {
    this.$v.$reset;
  },
  methods: {
    savePwd() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        //this.submitStatus = 'PENDING'
        let form = this.form;
        if (form.newPassword != form.confirmPassword) {
          this.submitStatus = "NOTMATCH";
        } else {
          let json = {};
          json.oldPassword = this.$base64.Base64.encode(this.form.oldPassword);
          json.newPassword = this.$base64.Base64.encode(this.form.newPassword);
          json.confirmPassword = this.$base64.Base64.encode(
            this.form.confirmPassword
          );
          this.$http
            .putMethod("users/changePwd", json)
            .then(response => {
              this.$toasted.show("Password changed", {
                position: "bottom-right",
                duration: 5000,
                fitToScreen: true
              });
              isSuccess = true;
            })
            .catch(err => {
              this.$toasted.show("Password not changed", {
                type: "danger",
                position: "bottom-right",
                duration: 5000,
                fitToScreen: true
              });
            });
        }
      }
    }
  },
  validations: {
    form: {
      oldPassword: {
        required
      },
      newPassword: {
        required,
        minLength: minLength(8)
      },
      confirmPassword: {
        required,
        minLength: minLength(8)
      }
    }
  },
  mixins: [validationMixin]
};
</script>

<style scoped>
#changePwd {
  margin-top: 5%;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>